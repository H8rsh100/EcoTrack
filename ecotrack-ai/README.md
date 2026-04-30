# 🌿 EcoTrack AI
### *Automating Sustainability through Multimodal Intelligence*

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**EcoTrack AI** is a full-stack sustainability agent that bridges the gap between physical utility bills and digital carbon tracking. By leveraging **Gemini 2.5 Flash**, the platform automates the extraction of energy consumption data from messy paper bills and provides real-time analytics on an individual's environmental impact.

---

## 🚀 The Core Mission (Problem Statement)

Most people want to reduce their carbon footprint, but manual tracking is a major friction point. Paper bills are often discarded, and their data is rarely utilized for personal climate accountability. **EcoTrack AI** solves this by:

*   **Removing Friction:** Zero manual data entry via AI-powered OCR.
*   **Standardizing Metrics:** Converting raw kWh into CO₂ mass ($0.695\text{ kg/kWh}$).
*   **Historical Persistence:** Creating a "Sustainability Diary" that survives long after the paper bill is recycled.

---

## 🛠️ Tech Stack

*   **Frontend:** Next.js (App Router) with responsive Inline-System-Styles.
*   **AI Engine:** Google Gemini 2.5 Flash (Vision-to-JSON extraction).
*   **Database:** Supabase (PostgreSQL) for persistent carbon logging.
*   **Storage:** Supabase Buckets for secure utility bill hosting.

---

## ✨ Key Features

*   **Vision-to-Data Pipeline:** Upload an image of any electricity bill, and Gemini automatically identifies the `units_consumed` and calculates `estimated_co2`.
*   **Live Handshake UI:** Uses React state lifting to refresh the history dashboard the instant an upload is processed—no page refreshes required.
*   **Lifetime Impact Analytics:** A dedicated analytics header that sums up total energy use and carbon debt across all historical records.
*   **Eco-Ledger:** A clean, ordered history of every bill uploaded, providing a transparent audit trail of your carbon footprint.

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/ecotrack-ai.git](https://github.com/your-username/ecotrack-ai.git)
   cd ecotrack-ai

Install dependencies:
npm install

Configure Environment Variables:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key

Run the development server:
npm run dev


📊 The Science Behind the Math
EcoTrack AI uses a standard emission factor for calculations:
Total CO2 (kg) = Consumption (kWh) x 0.695 
Note: The factor 0.695 represents a generalized grid intensity, which can be adjusted in the API route for specific regional grids.


## Built with passion by Harsh Gade and the team to make sustainability accessible to everyone

