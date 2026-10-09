import React from 'react';
import { AlertTriangle, RefreshCw, Trash2, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    window.location.href = '/#/';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: 'var(--bg-app, #F8FAFC)',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
          }}
        >
          <div
            style={{
              maxWidth: '440px',
              width: '100%',
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px 24px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              border: '1px solid #E2E8F0'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#FEF2F2',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                border: '1.5px solid #FCA5A5'
              }}
            >
              <AlertTriangle size={28} />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
              Something went wrong
            </h2>

            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: '1.5', marginBottom: '20px' }}>
              {this.state.error?.name === 'QuotaExceededError'
                ? 'Browser local storage limit was reached due to photos. Storage has been guarded.'
                : 'An unexpected application issue occurred.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#00A896',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={16} />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetStorage}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '11px 18px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  color: '#475569',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={15} color="#EF4444" />
                <span>Clear Cache & Reset Data</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
