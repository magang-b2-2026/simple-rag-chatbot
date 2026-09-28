import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from langchain_qdrant import QdrantVectorStore
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str

embeddings = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")

vector_store = QdrantVectorStore.from_existing_collection(
    embedding=embeddings,
    collection_name="panduan_monev_maganghub",
    url=os.environ.get("QDRANT_URL"),
    api_key=os.environ.get("QDRANT_API_KEY"),
)

retriever = vector_store.as_retriever(search_kwargs={"k": 3})

llm = ChatGroq(
    model="openai/gpt-oss-20b", 
    api_key=os.environ.get("GROQ_API_KEY")
)

system_prompt = (
    "Kamu adalah asisten AI yang bertugas membantu peserta menggunakan aplikasi Monev MagangHub. "
    "Gunakan konteks panduan berikut untuk menjawab pertanyaan user. "
    "Jika jawaban tidak ada di konteks, bilang saja kamu tidak tahu dan jangan mengarang jawaban. "
    "Jawablah dengan sopan, ringkas, dan jelas dalam bahasa Indonesia.\n\n"
    "Konteks:\n{context}"
)

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}"),
])

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

rag_chain = (
    {"context": retriever | format_docs, "input": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

@app.get("/api/health")
def health_check():
    return {"status": "Backend is running!"}

@app.post("/api/chat")
def chat(request: ChatRequest):
    try:
        answer = rag_chain.invoke(request.question)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))