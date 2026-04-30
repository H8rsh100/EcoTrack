'use client';
import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import History from '@/components/History';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div style={{ 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh', 
      padding: '60px 20px', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ 
            backgroundColor: '#dcfce7', 
            color: '#166534', 
            padding: '4px 12px', 
            borderRadius: '99px', 
            fontSize: '12px', 
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>Beta Access</span>
          <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#0f172a', margin: '16px 0 8px 0' }}>
            EcoTrack<span style={{ color: '#16a34a' }}>AI</span> 🌿
          </h1>
          <p style={{ color: '#64748b', fontSize: '18px' }}>
            Automating sustainability through multimodal intelligence.
          </p>
        </header>
        
        {/* Upload Container */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          padding: '8px', 
          borderRadius: '32px', 
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          border: '1px solid #f1f5f9',
          marginBottom: '32px'
        }}>
          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '40px', 
            borderRadius: '24px', 
            border: '2px dashed #e2e8f0' 
          }}>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>

        <History refreshKey={refreshTrigger} />
      </div>
    </div>
  );
}