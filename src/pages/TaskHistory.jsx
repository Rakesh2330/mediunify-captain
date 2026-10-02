import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import { 
  History, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Pill, 
  Activity, 
  Search, 
  X, 
  Eye, 
  Star,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

export default function TaskHistory() {
  const { history } = useTasks();
  const { captainType } = useAuth();
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'COMPLETED' | 'CANCELLED'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const isPharmacy = captainType === 'pharmacy';

  // Strictly isolate history by the logged-in captain's role
  const filteredHistory = history.filter(item => {
    if (item.type !== captainType) return false;
    if (filter === 'COMPLETED' && item.status !== 'COMPLETED') return false;
    if (filter === 'CANCELLED' && item.status !== 'CANCELLED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = item.patientName?.toLowerCase().includes(q);
      const idMatch = item.id?.toLowerCase().includes(q);
      const titleMatch = item.title?.toLowerCase().includes(q);
      return nameMatch || idMatch || titleMatch;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={22} color="var(--color-primary-navy)" />
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-heading)' }}>
            Completed Task History
          </h1>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
          {isPharmacy
            ? 'Review past completed pharmacy orders, patient deliveries and trip earnings.'
            : 'Review past completed diagnostic sample collections, laboratory drop-offs and trip earnings.'}
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isPharmacy ? "Search by Order ID, Patient, or Medication..." : "Search by Lab ID, Patient, or Test..."}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                outline: 'none',
                fontSize: '13px',
                background: '#F8FAFC'
              }}
            />
            <Search
              size={17}
              color="#64748B"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { id: 'ALL', label: 'All Records' },
              { id: 'COMPLETED', label: 'Completed' },
              { id: 'CANCELLED', label: 'Cancelled' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  background: filter === tab.id ? 'var(--color-primary-navy)' : '#F1F5F9',
                  color: filter === tab.id ? 'white' : 'var(--text-body)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Items Grid */}
      {filteredHistory.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
          {filteredHistory.map(item => {
            const isPharmacy = item.type === 'pharmacy';
            return (
              <div
                key={item.id}
                className="card"
                onClick={() => setSelectedItem(item)}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '800', fontFamily: 'monospace', color: 'var(--color-primary-navy)', fontSize: '14px' }}>
                      {item.id}
                    </span>
                    <span style={{ fontSize: '11px', background: isPharmacy ? '#ECFDF5' : '#F0F9FF', color: isPharmacy ? '#065F46' : '#0369A1', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                      {isPharmacy ? 'Pharmacy' : 'Lab Test'}
                    </span>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                {/* Title & Patient */}
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-heading)', marginBottom: '4px' }}>
                  {item.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <User size={14} color="#00A896" />
                  <span>{item.patientName}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
                  <MapPin size={13} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.patientAddress}
                  </span>
                </div>

                {/* Meta Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-card)', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <Calendar size={13} />
                    <span>{item.date} • {item.completedTime}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.patientRating && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#D97706', fontWeight: '700' }}>
                        <Star size={13} fill="#D97706" /> {item.patientRating}
                      </span>
                    )}
                    <span style={{ fontWeight: '800', color: '#059669', fontSize: '15px' }}>
                      +₹{item.earnings}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <History size={36} color="#94A3B8" style={{ margin: '0 auto 12px auto' }} />
          <h3>No records match this filter</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Try selecting "All Tasks" to view the complete history archive.
          </p>
        </div>
      )}

      {/* Item Details Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck size={22} color="var(--color-primary-teal)" />
                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>
                  {selectedItem.id} Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Task / Service</span>
                <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-heading)' }}>{selectedItem.title}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Patient</span>
                  <div style={{ fontWeight: '600' }}>{selectedItem.patientName}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Completed Time</span>
                  <div style={{ fontWeight: '600' }}>{selectedItem.date} at {selectedItem.completedTime}</div>
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Delivery / Collection Address</span>
                <div style={{ fontWeight: '500' }}>{selectedItem.patientAddress}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#F8FAFC', padding: '10px', borderRadius: '8px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Earnings Credited</span>
                  <div style={{ fontWeight: '800', fontSize: '16px', color: '#059669' }}>₹{selectedItem.earnings}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Status</span>
                  <div style={{ marginTop: '2px' }}><StatusBadge status={selectedItem.status} /></div>
                </div>
              </div>

              {selectedItem.proofImage && (
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
                    Uploaded Proof / Specimen Photo
                  </span>
                  <img
                    src={selectedItem.proofImage}
                    alt="Proof"
                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  />
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '20px' }}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
