import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Halo! Saya adalah AI asisten untuk Panduan Monev MagangHub. Ada yang bisa saya bantu?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.answer }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Maaf, sistem sedang mengalami gangguan." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Background utama menggunakan warna cerah khas neobrutalism
    <div className="flex flex-col h-screen bg-[#FFE600] items-center justify-center p-4 font-sans text-black">
      {/* Container utama dengan border tebal dan hard shadow */}
      <div className="w-full max-w-2xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header dengan warna mencolok dan garis bawah tebal */}
        <div className="bg-[#FF90E8] border-b-4 border-black p-4 text-center font-black text-xl uppercase tracking-wider">
          Panduan Monev MagangHub
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F4F4F0]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] p-4 border-4 border-black font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                  msg.role === "user"
                    ? "bg-[#23A094] rounded-2xl rounded-br-none text-white"
                    : "bg-white rounded-2xl rounded-bl-none"
                }`}
              >
                {msg.role === "user" ? (
                  msg.content
                ) : (
                  <div
                    className="flex flex-col gap-2 text-base 
                  [&>ol]:list-decimal [&>ul]:list-disc 
                  [&>ol]:ml-6 [&>ul]:ml-6 
                  [&>li]:pl-1 [&>p]:mb-2"
                  >
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border-4 border-black max-w-[75%] p-4 rounded-2xl rounded-bl-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold animate-pulse">
                Mengetik jawaban...
              </div>
            </div>
          )}
        </div>

        {/* Form input dengan pemisah garis tebal */}
        <form
          onSubmit={sendMessage}
          className="border-t-4 border-black bg-white p-4 flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan sesuatu..."
            className="flex-1 border-4 border-black bg-[#F4F4F0] rounded-xl px-4 py-3 font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#FF6B6B] text-black font-black uppercase tracking-wider px-6 py-3 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ff4f4f] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:bg-gray-400 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
}
