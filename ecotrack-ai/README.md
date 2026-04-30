# 🌿 EcoTrack AI
### *Automating Sustainability through Multimodal Intelligence*

**EcoTrack AI** is a full-stack sustainability agent that bridges the gap between physical utility bills and digital carbon tracking. By leveraging **Gemini 2.5 Flash**, the platform automates the extraction of energy consumption data from messy paper bills and provides real-time analytics on an individual's environmental impact.

---

## 🚀 The Core Mission (Problem Statement)
Most people want to reduce their carbon footprint, but manual tracking is a major friction point. Paper bills are often discarded, and their data is rarely utilized for personal climate accountability. **EcoTrack AI** solves this by:
* **Removing Friction:** Zero manual data entry via AI-powered OCR.
* **Standardizing Metrics:** Converting raw kWh into CO₂ mass (0.695 kg/kWh).
* **Historical Persistence:** Creating a "Sustainability Diary" that survives long after the paper bill is recycled.

---

## 🛠️ Tech Stack
* **Frontend:** Next.js (App Router) with responsive Inline-System-Styles.
* **AI Engine:** Google Gemini 2.5 Flash (Vision-to-JSON extraction).
* **Database:** Supabase (PostgreSQL) for persistent carbon logging.
* **Storage:** Supabase Buckets for secure utility bill hosting.

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
```bash
git clone [https://github.com/your-username/ecotrack-ai.git](https://github.com/your-username/ecotrack-ai.git)
cd ecotrack-ai

npm install

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key

npm run dev