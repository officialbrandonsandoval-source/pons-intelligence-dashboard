import { useMemo, useState } from 'react';
import { connectGHL } from '../api/client';
import '../styles/pages/ConnectGoHighLevel.css';

function ConnectGoHighLevel({ onNavigate }) {
  const [userId, setUserId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [locationId, setLocationId] = useState('');

  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const canSubmit = useMemo(() => {
    return userId.trim() && apiKey.trim() && locationId.trim() && status !== 'loading';
  }, [userId, apiKey, locationId, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setStatus('loading');

    try {
      await connectGHL(userId.trim(), apiKey.trim(), locationId.trim());
      setStatus('success');

      // Small UX pause so users see success state.
      window.setTimeout(() => {
        // Requested redirect path. App routing currently uses state strings;
        // we'll map this in App.jsx to the existing dashboard page.
        onNavigate('/dashboard');
      }, 450);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err?.message || 'Failed to connect GoHighLevel');
    }
  };

  return (
    <div className="connect-ghl-page">
      <div className="connect-ghl-container">
        <button className="back-button" onClick={() => onNavigate('connect-crm')}>
          ← Back
        </button>

        <header className="connect-ghl-header">
          <div className="connect-ghl-badge">CRM Connection</div>
          <h1 className="connect-ghl-title">Connect GoHighLevel</h1>
          <p className="connect-ghl-subtitle">
            Enter your GoHighLevel credentials to link your account.
          </p>
        </header>

        <form className="connect-ghl-card" onSubmit={handleSubmit}>
          <label className="connect-ghl-field">
            <span className="connect-ghl-label">User ID</span>
            <input
              className="connect-ghl-input"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g. 123456"
              autoComplete="username"
              inputMode="text"
              required
            />
          </label>

          <label className="connect-ghl-field">
            <span className="connect-ghl-label">API Key</span>
            <input
              className="connect-ghl-input"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="••••••••••••••••"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          <label className="connect-ghl-field">
            <span className="connect-ghl-label">Location ID</span>
            <input
              className="connect-ghl-input"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              placeholder="e.g. abcdEFGHIjkl"
              inputMode="text"
              required
            />
          </label>

          <div className="connect-ghl-status" aria-live="polite">
            {status === 'loading' && (
              <div className="connect-ghl-statusRow">
                <span className="connect-ghl-spinner" aria-hidden="true" />
                <span>Connecting…</span>
              </div>
            )}

            {status === 'error' && (
              <div className="connect-ghl-error">
                <strong>Connection failed.</strong>
                <div className="connect-ghl-errorText">{errorMessage}</div>
              </div>
            )}

            {status === 'success' && (
              <div className="connect-ghl-success">
                Connected. Redirecting to dashboard…
              </div>
            )}
          </div>

          <button className="connect-ghl-submit" type="submit" disabled={!canSubmit}>
            {status === 'loading' ? 'Connecting…' : 'Connect GoHighLevel'}
          </button>

          <p className="connect-ghl-footnote">
            Your credentials are sent securely to your backend. Never paste keys into untrusted pages.
          </p>
        </form>
      </div>
    </div>
  );
}

export default ConnectGoHighLevel;
