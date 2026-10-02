import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/common/TaskCard';
import { 
  ClipboardList, 
  Search, 
  RotateCcw,
  Pill, 
  Activity,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export default function Tasks() {
  const { captainType } = useAuth();
  const { labTasks, pharmacyTasks, resetAllTasks } = useTasks();

  const isPharmacy = captainType === 'pharmacy';
  const tasks = isPharmacy ? pharmacyTasks : labTasks;

  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED'
  const [searchQuery, setSearchQuery] = useState('');

  const assignedCount = tasks.filter(t => t.status === 'ASSIGNED').length;
  const inProgressCount = tasks.filter(t => t.status !== 'ASSIGNED' && t.status !== 'COMPLETED' && t.status !== 'CANCELLED').length;
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;

  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (filter === 'ASSIGNED' && task.status !== 'ASSIGNED') return false;
    if (filter === 'IN_PROGRESS' && (task.status === 'ASSIGNED' || task.status === 'COMPLETED' || task.status === 'CANCELLED')) return false;
    if (filter === 'COMPLETED' && task.status !== 'COMPLETED') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const patientMatch = task.patientName?.toLowerCase().includes(q);
      const idMatch = task.id?.toLowerCase().includes(q);
      const testMatch = task.testName?.toLowerCase().includes(q);
      const pharmacyMatch = task.pharmacyName?.toLowerCase().includes(q);
      return patientMatch || idMatch || testMatch || pharmacyMatch;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '10px', 
                background: isPharmacy ? '#E6F8F5' : '#EEF4FB', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              {isPharmacy ? <Pill size={22} color="#00A896" /> : <Activity size={22} color="#002244" />}
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-heading)' }}>
              {isPharmacy ? 'My Pharmacy Dispatches' : 'My Assigned Lab Tests'}
            </h1>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Active pickup routes, cold chain logistics, patient OTP handovers, and completed trips.
          </p>
        </div>

        <button
          onClick={resetAllTasks}
          style={{
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: 'var(--radius-md)',
            padding: '8px 14px',
            fontSize: '12px',
            fontWeight: '700',
            color: 'var(--text-body)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all var(--transition-fast)'
          }}
          title="Restore sample tasks for testing"
        >
          <RotateCcw size={14} />
          <span>Reset Sample Tasks</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', border: '1px solid var(--border-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Patient, ID, Medicine or Lab test..."
              style={{
                width: '100%',
                padding: '11px 14px 11px 40px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                outline: 'none',
                fontSize: '13px',
                background: '#F8FAFC',
                fontWeight: '500'
              }}
            />
            <Search
              size={17}
              color="#64748B"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { id: 'ALL', label: 'All', count: tasks.length },
              { id: 'ASSIGNED', label: 'New', count: assignedCount },
              { id: 'IN_PROGRESS', label: 'In Progress', count: inProgressCount },
              { id: 'COMPLETED', label: 'Done', count: completedCount }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  background: filter === tab.id 
                    ? (isPharmacy ? 'linear-gradient(135deg, #00A896 0%, #008779 100%)' : 'linear-gradient(135deg, #002244 0%, #003366 100%)')
                    : '#F1F5F9',
                  color: filter === tab.id ? 'white' : 'var(--text-body)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: filter === tab.id ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <span>{tab.label}</span>
                <span 
                  style={{ 
                    background: filter === tab.id ? 'rgba(255,255,255,0.25)' : '#E2E8F0',
                    color: filter === tab.id ? 'white' : '#475569',
                    fontSize: '10px',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    fontWeight: '800'
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task Cards List */}
      {filteredTasks.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '52px 24px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto' }}>
            <ClipboardList size={28} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-heading)' }}>
            No matching tasks found
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '340px', margin: '6px auto 18px auto' }}>
            No tasks match the active filter "{filter}". Try modifying search keywords or clearing filters.
          </p>
          <button onClick={() => { setFilter('ALL'); setSearchQuery(''); }} className="btn btn-outline">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
