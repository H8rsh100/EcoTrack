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
      setResult(null);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `bills/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('bills').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('bills').getPublicUrl(filePath);

      const aiResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: publicUrl }),
      });

      if (!aiResponse.ok) throw new Error('AI Analysis failed');

      const aiData = await aiResponse.json();
      setResult(aiData);
      if (onUploadSuccess) onUploadSuccess();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Analysis failed. Check console.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', cursor: 'pointer' }}>
        <input 
          type="file" 
          onChange={handleUpload} 
          disabled={uploading}
          style={{ 
            position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' 
          }}
        />
        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>
            {uploading ? '⌛' : '📤'}
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>
            {uploading ? 'Gemini is thinking...' : 'Click to upload bill'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
            PNG or JPG (Max 10MB)
          </p>
        </div>
      </div>

      {result && (
        <div style={{ 
          marginTop: '24px', 
          paddingTop: '24px', 
          borderTop: '1px solid #e2e8f0',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px' }}>LIVE ANALYSIS</span>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#15803d', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>SUCCESS</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>UNITS</p>
              <p style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a' }}>{result.units || result.units_consumed} <small style={{ fontSize: '12px', fontWeight: '500' }}>kWh</small></p>
            </div>
            <div style={{ padding: '16px', background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>IMPACT</p>
              <p style={{ fontSize: '24px', fontWeight: '900', color: '#16a34a' }}>{(result.carbonImpact || result.estimated_co2_kg).toFixed(2)} <small style={{ fontSize: '12px', fontWeight: '500' }}>kg</small></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}