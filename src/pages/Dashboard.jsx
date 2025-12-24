import { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import VoiceButton from '../components/VoiceButton';
import TopActionCard from '../components/dashboard/TopActionCard';
import RevenueLeaks from '../components/dashboard/RevenueLeaks';
import DealPipeline from '../components/DealPipeline';
import LoadingState from '../components/dashboard/LoadingState';
import { apiClient, apiUrl, getGHLStatus } from '../api/client';
import '../styles/pages/Dashboard.css';

function Dashboard({ onNavigate }) {
  const [insight, setInsight] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const [ghlConnected, setGhlConnected] = useState(false);
  const [ghlStatusLoading, setGhlStatusLoading] = useState(true);

  // Local helper to keep this change self-contained.
  // Expected backend response: { insight: ... }
  const getInsights = useCallback(async ({ source, userId }) => {
    const url = apiUrl(
      `/api/insights?source=${encodeURIComponent(source)}&userId=${encodeURIComponent(userId)}`
    );
    return apiClient.get(url);
  }, []);

  const fetchInsights = useCallback(async () => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await getInsights({ source: 'gohighlevel', userId: 'dev' });
      setInsight(response?.insight ?? null);
      setStatus('success');
    } catch (err) {
      setInsight(null);
      setStatus('error');
      setErrorMessage(err?.message || 'Failed to fetch insights');
    }
  }, [getInsights]);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      setGhlStatusLoading(true);

      try {
        // Requirement: On dashboard load: GET /api/auth/ghl/status?userId=dev
        const statusRes = await getGHLStatus('dev');
        const isConnected = Boolean(
          statusRes?.connected ?? statusRes?.isConnected ?? statusRes?.ok
        );

        if (cancelled) return;

        setGhlConnected(isConnected);
        setGhlStatusLoading(false);

        if (isConnected) {
          fetchInsights();
        } else {
          // Don't attempt insights until connected.
          setInsight(null);
          setStatus('success');
        }
      } catch (err) {
        if (cancelled) return;
        setGhlConnected(false);
        setGhlStatusLoading(false);
        setInsight(null);
        setStatus('success');
        // Non-fatal: still show dashboard skeleton, but keep everything gated.
        setErrorMessage(err?.message || 'Failed to check GoHighLevel status');
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [fetchInsights]);

  const handleBackToConnect = () => {
    onNavigate('/connect');
  };

  const handleVoiceResult = () => {
    fetchInsights();
  };

  if (status === 'loading') {
    return (
      <div className="dashboardPage">
        <Navbar onNavigate={onNavigate} />
        <main className="dashboardMain">
          <div className="dashboardContainer">
            <LoadingState label="Fetching insights…" />
          </div>
        </main>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="dashboardPage">
        <Navbar onNavigate={onNavigate} />
        <main className="dashboardMain">
          <div className="dashboardContainer">
            <div
              style={{
                background: '#141414',
                border: '1px solid #2a2a2a',
                borderRadius: 16,
                padding: 18,
              }}
              role="alert"
            >
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Couldn’t load insights.</div>
              <div style={{ color: '#a1a1aa', marginBottom: 14 }}>{errorMessage}</div>
              <button
                type="button"
                onClick={handleBackToConnect}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  fontWeight: 700,
                }}
              >
                Back to Connect
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboardPage">
      <Navbar onNavigate={onNavigate} />
      
      <main className="dashboardMain">
        <div className="dashboardContainer">
          {!ghlConnected ? (
            <div
              style={{
                marginBottom: 14,
                background: 'rgba(124, 58, 237, 0.08)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                borderRadius: 14,
                padding: 12,
                color: '#e4e4e7',
              }}
              role="status"
              aria-live="polite"
            >
              <div style={{ fontWeight: 800, marginBottom: 6 }}>GoHighLevel not connected</div>
              <div style={{ color: '#a1a1aa', fontSize: 13 }}>
                {ghlStatusLoading
                  ? 'Checking connection status…'
                  : 'Connect GoHighLevel to enable voice controls and Copilot.'}
              </div>
              {!ghlStatusLoading ? (
                <div style={{ marginTop: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => onNavigate('/connect/gohighlevel')}
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                      border: '1px solid rgba(168, 85, 247, 0.45)',
                      color: '#ffffff',
                      padding: '10px 14px',
                      borderRadius: 10,
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Connect GoHighLevel
                  </button>
                  {errorMessage ? (
                    <div style={{ fontSize: 12, color: '#a1a1aa' }}>{errorMessage}</div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Hero Section with Voice Button */}
          <div className="dashboardHero">
            <div className="dashboardHero__content">
              <h1 className="dashboardHero__title">Revenue Intelligence</h1>
              <p className="dashboardHero__subtitle">
                AI-powered insights and voice commands for your pipeline
              </p>
              <div style={{ marginTop: 10, color: '#a1a1aa', fontSize: 13 }}>
                {insight ? 'Latest insight loaded.' : 'No insight available yet.'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button
                type="button"
                onClick={fetchInsights}
                disabled={!ghlConnected}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  fontWeight: 700,
                }}
              >
                Refresh
              </button>
              <VoiceButton
                onResult={handleVoiceResult}
                disabled={!ghlConnected}
                disabledReason="GoHighLevel not connected"
              />
            </div>
          </div>
          
          {/* Top Action Card - Dominant Hero Card */}
          <div className="dashboardTopAction">
            <TopActionCard />
          </div>
          
          {/* Revenue Leaks Section */}
          <RevenueLeaks />
          
          {/* Deal Pipeline Rankings */}
          <section className="dashboardSection" aria-label="Deal pipeline">
            <h2 className="dashboardSection__title">Deal Pipeline</h2>
            <DealPipeline />
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
