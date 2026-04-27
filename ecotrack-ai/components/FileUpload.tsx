import FileUpload from '@/components/FileUpload';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            EcoTrack AI <span className="text-green-600">🌿</span>
          </h1>
          <p className="text-slate-500">
            Upload your utility bills and let AI track your carbon footprint.
          </p>
        </div>

        {/* This is our new component! */}
        <FileUpload />

        <div className="pt-8 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            Powered by Next.js 15 & Gemini 2.0 Flash
          </p>
        </div>
      </div>
    </div>
  );
}