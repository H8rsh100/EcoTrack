'use client';
import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import History from '@/components/History';

export default function Home() {
  // State to trigger History component refresh
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px', fontWeight: '800' }}>EcoTrack AI 🌿</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Automating sustainability for a greener planet.
        </p>
      </header>
      
      <div style={{ 
        border: '1px solid #eee', 
        padding: '30px', 
        borderRadius: '20px', 
        background: '#ffffff',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' 
      }}>
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Analytics Summary and Log List */}
      <History refreshKey={refreshTrigger} />
      
    </div>
  );
}