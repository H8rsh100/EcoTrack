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
      {/* --- ANALYTICS CARDS --- */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '24px', 
        marginBottom: '40px' 
      }}>
        <div style={{ 
          padding: '30px', 
          background: '#f0fdf4', 
          borderRadius: '28px', 
          border: '1px solid #dcfce7',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <p style={{ fontSize: '0.75rem', color: '#166534', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Energy</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#14532d', margin: '8px 0' }}>
            {stats.totalKwh.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: '500' }}>kWh</span>
          </h2>
        </div>
        
        <div style={{ 
          padding: '30px', 
          background: '#fef2f2', 
          borderRadius: '28px', 
          border: '1px solid #fee2e2',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <p style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Carbon Debt</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#7f1d1d', margin: '8px 0' }}>
            {stats.totalCo2.toFixed(2)} <span style={{ fontSize: '1rem', fontWeight: '500' }}>kg</span>
          </h2>
        </div>
      </div>

      <h3 style={{ 
        fontSize: '1.25rem', 
        fontWeight: '800', 
        color: '#1f2937', 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        📊 Detailed Log History
      </h3>

      {loading ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>Syncing Eco-Ledger...</p>
      ) : logs.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', background: '#f9fafb', borderRadius: '24px', border: '2px dashed #e5e7eb', color: '#6b7280' }}>
          Your footprint is empty. Start by uploading a bill.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {logs.map((log) => (
            <div key={log.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '20px 24px', 
              background: '#fff', 
              borderRadius: '20px', 
              border: '1px solid #f3f4f6',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)'
            }}>
              <div>
                <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#111827' }}>{log.consumption_value} kWh</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500' }}>
                  {new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '800', color: '#059669', fontSize: '1.1rem' }}>
                  {Number(log.co2_emitted_kg).toFixed(2)} kg CO₂
                </div>
                <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: '700', textTransform: 'uppercase' }}>Verified by Gemini</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}