'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase using Next.js public environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface HistoryProps {
  refreshKey: number;
}

export default function History({ refreshKey }: HistoryProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('carbon_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && data) {
      setLogs(data);
    } else if (error) {
      console.error("Supabase Fetch Error:", error.message);
    }
    setLoading(false);
  };

  // Re-run fetchLogs every time refreshKey changes
  useEffect(() => {
    fetchLogs();
  }, [refreshKey]);

  return (
    <div style={{ marginTop: '40px' }}>
      <h3 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        color: '#333', 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        📊 Recent Impact History
      </h3>

      {loading ? (
        <p style={{ color: '#999', fontStyle: 'italic' }}>Syncing with database...</p>
      ) : logs.length === 0 ? (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          background: '#f9f9f9', 
          borderRadius: '12px', 
          color: '#999',
          border: '1px dashed #ddd'
        }}>
          No records yet. Upload your first bill to see your impact!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {logs.map((log) => (
            <div key={log.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '15px 20px', 
              background: '#fff', 
              borderRadius: '15px', 
              border: '1px solid #efefef',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#2d3748' }}>
                  {log.consumption_value} kWh
                </div>
                <div style={{ fontSize: '0.7rem', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: '#059669', fontSize: '1.1rem' }}>
                  {log.co2_emitted_kg?.toFixed(2)} kg CO₂
                </div>
                <div style={{ fontSize: '0.7rem', color: '#a0aec0', textTransform: 'uppercase' }}>
                  Carbon Footprint
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}