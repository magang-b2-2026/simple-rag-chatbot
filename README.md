# Chatbot Panduan Monev MagangHub

Aplikasi chatbot berbasis RAG (Retrieval-Augmented Generation) untuk membantu pengguna mencari informasi dari panduan Monev MagangHub. Project ini terdiri dari frontend React + Vite, backend FastAPI, dan database vektor Qdrant untuk pencarian semantik.

## Teknologi yang Digunakan

- Frontend: React + Vite
- Styling: Tailwind CSS
- Backend: FastAPI
- Database vektor: Qdrant
- Embedding: FastEmbed
- LLM: Groq
- Data source: PDF panduan Monev

## Struktur Folder

- `api/` - kode backend FastAPI
  - `chat.py` - endpoint `/api/chat` dan `/api/health`
  - `requirements.txt` - dependency Python
- `src/` - kode frontend React
- `data/` - folder dokumen PDF yang akan di-index ke Qdrant
- `ingest.py` - script untuk membaca PDF, memecah teks, dan menyimpan ke Qdrant
- `public/` - aset publik
- `package.json` - konfigurasi frontend dan script Vite

## Prasyarat

Sebelum menjalankan aplikasi, pastikan sudah memiliki:

- Node.js 18+
- npm atau pnpm
- Python 3.10+
- Qdrant (bisa local atau cloud)
- API key Groq

## 1. Clone Project

```bash
git clone <repository-url>
cd chatbot-magang
```

## 2. Instalasi Frontend

```bash
npm install
```

## 3. Instalasi Backend Python

Masuk ke folder `api` lalu buat virtual environment dan install dependency:

```bash
cd api
python -m venv .venv
```

```cmd
.\.venv\Scripts\activate.bat
```

Lalu install dependency:

```bash
pip install -r requirements.txt
pip install uvicorn
```

## 4. Konfigurasi Environment

Buat file `.env` di root project. Isi dengan variabel berikut:

```env
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=
GROQ_API_KEY=your_groq_api_key_here
```

## 5. Siapkan Database Vector Qdrant

Pastikan Qdrant sudah aktif.

Setelah itu, siapkan file PDF panduan dalam folder `data/` dengan nama:

```bash
data/panduan_monev.pdf
```

Lalu jalankan script ingest untuk meng-index dokumen ke Qdrant:

```bash
cd ..
python ingest.py
```

Script ini akan:

- membaca file PDF
- memecah teks menjadi chunk
- melakukan embedding
- menyimpan data ke collection `panduan_monev_indonesia` di Qdrant

## 6. Jalankan Backend

Buka terminal baru lalu jalankan:

```bash
cd api
source .venv/bin/activate
uvicorn chat:app --host 127.0.0.1 --port 8000 --reload
```

Pada Windows:

```powershell
cd api
.\.venv\Scripts\Activate.ps1
uvicorn chat:app --host 127.0.0.1 --port 8000 --reload
```

Backend siap di:

```text
http://127.0.0.1:8000
```

Endpoint yang tersedia:

- `GET /api/health` - cek status backend
- `POST /api/chat` - kirim pertanyaan ke chatbot

## 7. Jalankan Frontend

Buka terminal baru, lalu jalankan dari root project:

```bash
npm run dev
```

Secara default Vite akan berjalan di:

```text
http://localhost:5173
```

Frontend ini sudah dikonfigurasi agar request `/api/*` diteruskan ke backend FastAPI pada port `8000` melalui proxy Vite.