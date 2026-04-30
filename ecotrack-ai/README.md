🌿 EcoTrack AI
Automating Sustainability through Multimodal Intelligence
EcoTrack AI is a full-stack sustainability agent that bridges the gap between physical utility bills and digital carbon tracking. By leveraging Gemini 2.5 Flash, the platform automates the extraction of energy consumption data from messy paper bills and provides real-time analytics on an individual's environmental impact.

🚀 The Core Mission (Problem Statement)
Most people want to reduce their carbon footprint, but manual tracking is a major friction point. Paper bills are often discarded, and their data is rarely utilized for personal climate accountability. EcoTrack AI solves this by:

Removing Friction: Zero manual data entry via AI-powered OCR.

Standardizing Metrics: Converting raw kWh into CO₂ mass (0.695 kg/kWh).

Historical Persistence: Creating a "Sustainability Diary" that survives long after the paper bill is recycled.

🛠️ Tech Stack
Frontend: Next.js (App Router) with responsive Inline-System-Styles.

AI Engine: Google Gemini 2.5 Flash (Vision-to-JSON extraction).

Database: Supabase (PostgreSQL) for persistent carbon logging.

Storage: Supabase Buckets for secure utility bill hosting.

⚙️ Installation & Setup
Clone the repository:

Bash
git clone https://github.com/your-username/ecotrack-ai.git
cd ecotrack-ai
Install dependencies:

Bash
npm install
Configure Environment Variables:
Create a .env.local file and add your credentials:

Code snippet
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
Run the development server:

Bash
npm run dev
📊 The Science Behind the Math
EcoTrack AI uses a standard emission factor for calculations:

Total CO2 (kg) = Consumption (kWh) x 0.695

Note: The factor 0.695 represents a generalized grid intensity, which can be adjusted in the API route for specific regional grids.


Built with passion by Harsh Gade to make sustainability accessible to everyone.