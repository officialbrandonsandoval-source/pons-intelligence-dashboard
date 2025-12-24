import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import WelcomeGreeting from '../components/copilot/WelcomeGreeting';
import CoreMetrics from '../components/copilot/CoreMetrics';
import AskBar from '../components/copilot/AskBar';
import Conversation from '../components/copilot/Conversation';
import ModeToggle from '../components/copilot/ModeToggle';
import { ask as askCopilot } from '../api/copilot';
import { speakText } from '../api/voice';
import { getGHLStatus } from '../api/client';
import '../styles/copilot.css';

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function CopilotDashboard({ onNavigate }) {
  const [mode, setMode] = useState('hybrid'); // silent | hybrid | voice
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState('');
  const [needsGHLConnect, setNeedsGHLConnect] = useState(false);
  const [ghlConnected, setGhlConnected] = useState(false);
  const [ghlStatusLoading, setGhlStatusLoading] = useState(true);

  const [metrics, setMetrics] = useState(null);
  const [topActionOpen, setTopActionOpen] = useState(false);

  const [messages, setMessages] = useState([]);
  const [lastTranscript, setLastTranscript] = useState('');

  const greetingText = useMemo(() => {
    const base = metrics?.greeting || 'I’m online. Ask me about cash at risk, velocity, or what to do next.';
    return base;
  }, [metrics]);

  const shouldSpeak = mode === 'hybrid' || mode === 'voice';

  const speakGreeting = async (text) => {
    // Use centralized voice API.
    // This still stays non-blocking to keep UI smooth.
    try {
      await speakText({ text });
    } catch {
      // Intentionally ignore to keep UI smooth.
    }
  };

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      setStatus('loading');
      setErrorMessage('');
      setNeedsGHLConnect(false);
      setGhlStatusLoading(true);
      setGhlConnected(false);

      try {
        // Best-effort: check GHL connection, but do not hard-block demo.
        // In production demos, this call can fail due to CORS if the backend isn't allowing the Vercel origin yet.
        let isConnected = false;
        try {
          const statusRes = await getGHLStatus('dev');
          isConnected = Boolean(statusRes?.connected ?? statusRes?.isConnected ?? statusRes?.ok);
        } catch {
          // Treat as not connected, but allow Copilot demo to proceed.
          isConnected = false;
        }

        if (cancelled) return;

        setGhlConnected(isConnected);
        setGhlStatusLoading(false);

        // Auto-run on load
        // Requirement: Call /api/copilot with "What is at risk?" and render key metrics.
        const autoQuery = 'What is at risk?';

        setMetrics(null);
        setMessages([{ id: makeId(), role: 'user', content: autoQuery }]);
        setStatus('ready');

        const fallback = await askCopilot(autoQuery);

        const cashAtRisk = fallback?.structured?.cashAtRisk;
        const velocity = fallback?.structured?.velocity;
        const topAction = fallback?.structured?.nextBestAction;
        const answerText = fallback?.answer || 'No answer returned.';

        if (cancelled) return;

        // Text-only: show assistant answer in chat.
        setMessages((prev) => [...prev, { id: makeId(), role: 'assistant', content: answerText }]);

        // Render three key metrics (text-only)
        setMetrics({
          cashAtRisk: typeof cashAtRisk === 'number' ? { amount: cashAtRisk, deals: 0 } : cashAtRisk,
          velocity: typeof velocity === 'string' ? { label: velocity, wow: 0 } : velocity,
          topAction:
            typeof topAction === 'string'
              ? { label: topAction, detail: '' }
              : topAction,
        });

        if (shouldSpeak) {
          await speakGreeting(answerText);
        }
      } catch (err) {
        if (cancelled) return;
        // Only fail the page if Copilot itself fails.
        setStatus('error');
        const msg = err?.message || 'Failed to load Copilot';
        setErrorMessage(msg);
        setGhlStatusLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Speak greeting automatically only when hybrid/voice.
    if (!shouldSpeak) return;
    if (messages.length === 0) return;
    const first = messages[0];
    if (!first || first.role !== 'assistant') return;

    // Only speak when mode changes into a speaking mode.
    speakGreeting(first.content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const handleAsk = async (query) => {
    // Demo-friendly: allow Copilot even when GHL isn't connected.
    // We keep the banner to encourage connecting, but don't block /api/copilot.

    const userMsg = { id: makeId(), role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);

    try {
      // Contract: POST /api/copilot with { query }
      const res = await askCopilot(query);

      const cashAtRisk = res?.structured?.cashAtRisk;
      const velocity = res?.structured?.velocity;
      const topAction = res?.structured?.nextBestAction;
      const answerText = res?.answer || 'No answer returned.';

      // Answer text in chat panel
      setMessages((prev) => [...prev, { id: makeId(), role: 'assistant', content: answerText }]);

      // Display three key metrics (text-only)
      setMetrics({
        cashAtRisk: typeof cashAtRisk === 'number' ? { amount: cashAtRisk, deals: 0 } : cashAtRisk,
        velocity: typeof velocity === 'string' ? { label: velocity, wow: 0 } : velocity,
        topAction:
          typeof topAction === 'string'
            ? { label: topAction, detail: '' }
            : topAction,
      });

      if (shouldSpeak) {
        await speakGreeting(answerText);
      }
    } catch (err) {
      const statusCode = err?.status;
      if (statusCode === 401 || statusCode === 403) {
        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: 'assistant',
            content:
              'Not authorized to access Copilot. Please connect and verify permissions (401/403).',
          },
        ]);
        return;
      }
      const assistantMsg = {
        id: makeId(),
        role: 'assistant',
        content: err?.message || 'Something went wrong.',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }
  };

  const handleVoiceResult = async (result) => {
    // Requirement: Voice triggers same flow and appends conversation history.
    const transcript = result?.transcript || result?.text || '';
    if (transcript) setLastTranscript(transcript);

    const query = transcript || 'What is at risk?';
    await handleAsk(query);
  };

  const containerClass = `copilotGrid ${mode === 'voice' ? 'voiceOnly' : ''}`;

  // Demo-friendly: treat the page as usable even if GHL isn't connected.
  // We still show the connect banner when disconnected.
  const isConnectedGateOpen = !ghlStatusLoading;

  return (
    <div className="copilotPage">
      <Navbar onNavigate={onNavigate} />

      <main className="copilotMain">
        <header className="copilotHeader">
          <WelcomeGreeting text={greetingText} />
          <ModeToggle mode={mode} onChange={setMode} />
        </header>

        {!isConnectedGateOpen ? (
          <div
            style={{
              marginTop: 12,
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
                : 'Connect your GoHighLevel account to enable Copilot and voice controls.'}
            </div>
            <div style={{ marginTop: 10 }}>
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
            </div>
          </div>
        ) : null}

        {status === 'error' ? (
          <div style={{ marginTop: 16, color: '#a1a1aa' }}>
            <div>{errorMessage}</div>

            {needsGHLConnect ? (
              <div style={{ marginTop: 12 }}>
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

                <div style={{ marginTop: 8, fontSize: 13, color: '#71717a' }}>
                  Once connected, come back here and I’ll be able to answer using your real CRM data.
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {mode === 'voice' ? (
          <div className="voiceOnlyBanner">
            <div style={{ fontWeight: 800, color: '#ffffff' }}>Voice-only</div>
            <div className="wave" aria-hidden="true" />
            <div>Transcript: {lastTranscript || '—'}</div>
            <div>Last answer: {messages[messages.length - 1]?.content || '—'}</div>
          </div>
        ) : null}

        <div className={containerClass}>
          <CoreMetrics
            metrics={metrics}
            topActionOpen={topActionOpen}
            onToggleTopAction={() => setTopActionOpen((v) => !v)}
          />

          <section className="conversation" aria-label="Copilot conversation">
            <Conversation messages={messages} />
            <AskBar
              disabled={status !== 'ready' || !isConnectedGateOpen}
              hidden={!isConnectedGateOpen}
              mode={mode}
              onAsk={handleAsk}
              onVoiceResult={handleVoiceResult}
              transcript={lastTranscript}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default CopilotDashboard;
