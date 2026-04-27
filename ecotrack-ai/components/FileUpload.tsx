'use client';
import { useState } from 'react';
import { supabase } from 'lib/supabase';

export default function FileUpload() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `bills/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('bills')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      alert('Upload Success! File is in Supabase.');
      
    } catch (error) {
      console.error(error);
      alert('Upload failed. Check console.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ border: '2px dashed #ccc', padding: '20px', borderRadius: '10px' }}>
      <input type="file" onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}