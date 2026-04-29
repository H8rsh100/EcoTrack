'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface FileUploadProps {
  onUploadSuccess?: () => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setResult(null); // Clear previous results
      
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `bills/${fileName}`;

      // 1. Upload the physical file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('bills')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Generate a Public URL so our AI can "see" the bill
      const { data: { publicUrl } } = supabase.storage
        .from('bills')
        .getPublicUrl(filePath);

      // 3. Hit our internal AI API Route
      const aiResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: publicUrl }),
      });

      if (!aiResponse.ok) throw new Error('AI Analysis failed');

      const aiData = await aiResponse.json();
      setResult(aiData);

      // 4. TRIGGER REFRESH (Brick 7 Handshake)
      // This tells the Parent (page.tsx) to tell History.tsx to update
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Check the console!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Zone */}
      <div className="p-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors text-center">
        <input 
          type="file" 
          onChange={handleUpload} 
          disabled={uploading}
          className="cursor-pointer text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
        />
        {uploading && (
          <p className="mt-4 text-green-600 font-medium animate-pulse">
            Gemini AI is analyzing your footprint...
          </p>
        )}
      </div>

      {/* AI Result Display */}
      {result && (
        <div className="p-6 bg-white border border-green-100 rounded-2xl shadow-sm ring-1 ring-green-900/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Analysis Result</h3>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md uppercase">
              {result.category || 'Electricity'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Consumption</p>
              <p className="text-xl font-bold text-slate-900">{result.units || result.units_consumed} kWh</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-green-600">Carbon Impact</p>
              <p className="text-xl font-bold text-green-700">{result.carbonImpact || result.estimated_co2_kg} kg CO₂</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}