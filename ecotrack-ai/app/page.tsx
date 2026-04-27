import FileUpload from '@/components/FileUpload';

export default function Home() {
  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>EcoTrack AI 🌿</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Automating sustainability for a greener planet.
      </p>
      
      <div style={{ border: '1px solid #eee', padding: '20px', borderRadius: '12px', background: '#f9f9f9' }}>
        <FileUpload />
      </div>
    </div>
  );
}