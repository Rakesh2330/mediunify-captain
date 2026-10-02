import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { 
  Wallet, 
  TrendingUp, 
  CheckCircle2
} from 'lucide-react';

export default function Earnings() {
  const { earnings, history } = useTasks();
  const { profile, captainType } = useAuth();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'COMPLETED' | 'PENDING'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wallet size={22} color="#00A896" />
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-heading)' }}>
              Captain Earnings & Settlements
            </h1>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Track daily task fees, surge incentives, weekly payouts and settlement history.
          </p>
        </div>
      </div>

      {/* Top 4 Stat Cards: Today, This Week, This Month, Total Lifetime */}
      <div className="earnings-stat-grid">
        {/* Today */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #002244 0%, #003366 100%)', color: 'white' }}>
          <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>
            Today's Earnings
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#FFFFFF', marginTop: '4px' }}>
            ₹{earnings.today.amount}
          </div>
          <div style={{ fontSize: '12px', color: '#34D399', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
            <TrendingUp size={14} />
            <span>{earnings.today.tasksCompleted} tasks • {earnings.today.hoursOnline} active</span>
          </div>
        </div>

        {/* This Week */}
        <div className="card">
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            This Week
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-heading)', marginTop: '4px' }}>
            ₹{earnings.thisWeek.amount}
          </div>
          <div style={{ fontSize: '12px', color: '#059669', marginTop: '8px', fontWeight: '600' }}>
            Includes ₹{earnings.thisWeek.incentive} weekly bonus
          </div>
        </div>

        {/* This Month */}
        <div className="card">
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            This Month (September)
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-heading)', marginTop: '4px' }}>
            ₹{earnings.thisMonth.amount}
          </div>
          <div style={{ fontSize: '12px', color: '#0284C7', marginTop: '8px', fontWeight: '600' }}>
            {earnings.thisMonth.tasksCompleted} total assignments completed
          </div>
        </div>

        {/* Total Lifetime */}
        <div className="card">
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Total Earnings (Lifetime)
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-primary-navy)', marginTop: '4px' }}>
            ₹{earnings.totalLifetime}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '600' }}>
            Total processed earnings
          </div>
        </div>
      </div>

      {/* Transactions & Settlements List */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-heading)' }}>
            Recent Payment Ledger & Task Payouts
          </h2>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'COMPLETED', 'PENDING'].map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  background: activeTab === t ? 'var(--color-primary-navy)' : '#F1F5F9',
                  color: activeTab === t ? 'white' : 'var(--text-body)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table / Responsive Card Stack */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {history.slice(0, 8).map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderBottom: idx < history.length - 1 ? '1px solid #F1F5F9' : 'none',
                  transition: 'background var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: item.status === 'COMPLETED' ? '#ECFDF5' : '#FEF2F2',
                      color: item.status === 'COMPLETED' ? '#059669' : '#DC2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '14px', color: 'var(--text-heading)', fontFamily: 'monospace' }}>
                        {item.id}
                      </strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        • {item.type === 'pharmacy' ? 'Pharmacy Delivery' : 'Sample Collection'}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {item.patientName} • {item.date}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: item.status === 'COMPLETED' ? '#059669' : '#94A3B8' }}>
                    +₹{item.earnings}
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: item.status === 'COMPLETED' ? '#059669' : '#DC2626',
                      textTransform: 'uppercase'
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
