'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

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
  const [stats, setStats] = useState({ totalKwh: 0, totalCo2: 0 });

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('carbon_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLogs(data);
      // Calculate totals for Analytics
      const kwh = data.reduce((sum, item) => sum + (Number(item.consumption_value) || 0), 0);
      const co2 = data.reduce((sum, item) => sum + (Number(item.co2_emitted_kg) || 0), 0);
      setStats({ totalKwh: kwh, totalCo2: co2 });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  return (
    <div style={{ marginTop: '40px' }}>
      {/* --- BRICK 8: ANALYTICS HEADER --- */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px', 
        marginBottom: '40px' 
      }}>
        <div style={{ 
          padding: '25px', 
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', 
          borderRadius: '24px', 
          border: '1px solid #bbf7d0',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Energy</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#14532d', margin: '10px 0' }}>
            {stats.totalKwh.toLocaleString()} <span style={{ fontSize: '1rem' }}>kWh</span>
          </h2>
        </div>
        
        <div style={{ 
          padding: '25px', 
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)', 
          borderRadius: '24px', 
          border: '1px solid #fecaca',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.8rem', color: '#991b1b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Carbon Debt</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#7f1d1d', margin: '10px 0' }}>
            {stats.totalCo2.toFixed(1)} <span style={{ fontSize: '1rem' }}>kg</span>
          </h2>
        </div>
      </div>

      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
        📊 Detailed Log History
      </h3>

      {loading ? (
        <p style={{ color: '#999', textAlign: 'center' }}>Syncing with Eco-Ledger...</p>
      ) : logs.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: '#f9f9f9', borderRadius: '20px', border: '2px dashed #ddd' }}>
          No footprint detected. Upload a bill to begin.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {logs.map((log) => (
            <div key={log.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '20px', 
              background: '#fff', 
              borderRadius: '18px', 
              border: '1px solid #eee',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <div>
                <span style={{ fontWeight: '800', color: '#1f2937' }}>{log.consumption_value} kWh</span>
                <p style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{new Date(log.created_at).toDateString()}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: '800', color: '#059669' }}>{log.co2_emitted_kg} kg CO₂</span>
                <p style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Verified by Gemini</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}