import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import WelcomeGreeting from '../components/copilot/WelcomeGreeting';
import CoreMetrics from '../components/copilot/CoreMetrics';
import AskBar from '../components/copilot/AskBar';
import Conversation from '../components/copilot/Conversation';
import ModeToggle from '../components/copilot/ModeToggle';
import { postInsights } from '../api/insights';
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
        // Requirement: Before calling /api/copilot, confirm GHL is connected.
        // Check: GET {VITE_API_URL}/api/auth/ghl/status?userId=dev
        const statusRes = await getGHLStatus('dev');
        const isConnected = Boolean(statusRes?.connected ?? statusRes?.isConnected ?? statusRes?.ok);

        if (cancelled) return;

        setGhlConnected(isConnected);
        setGhlStatusLoading(false);

        if (!isConnected) {
          setStatus('ready');
          setMessages([
            {
              id: makeId(),
              role: 'assistant',
              content: 'GoHighLevel is not connected. First connect.',
            },
          ]);
          return;
        }

        const initialGreeting = 'I’m online. Ask me about cash at risk, velocity, or what to do next.';

        setMetrics(null);
        setMessages([{ id: makeId(), role: 'assistant', content: initialGreeting }]);
        setStatus('ready');

        if (shouldSpeak) {
          await speakGreeting(initialGreeting);
        }
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        const msg = err?.message || 'Failed to load Copilot';
        setErrorMessage(msg);
        if (/gohighlevel is not connected/i.test(msg)) {
          setNeedsGHLConnect(true);
        }
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
    if (!ghlConnected) {
      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: 'assistant', content: 'GoHighLevel is not connected. First connect.' },
      ]);
      return;
    }

    const userMsg = { id: makeId(), role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);

    try {
      // Requirement: When user asks a question, call POST /api/insights with mock/demo deals
      const res = await postInsights({
        userId: 'dev',
        source: 'demo',
        query,
      });

      const cashAtRisk = res?.cashAtRisk;
      const velocity = res?.velocity;
      const nextBestAction = res?.nextBestAction;
      const voiceSummary = res?.voiceSummary;

      const lines = [
        cashAtRisk ? `Cash at Risk: ${cashAtRisk}` : null,
        velocity ? `Velocity: ${velocity}` : null,
        nextBestAction ? `Next Best Action: ${nextBestAction}` : null,
        voiceSummary ? `Summary: ${voiceSummary}` : null,
      ].filter(Boolean);

      const text = lines.length > 0 ? lines.join('\n') : 'No insights returned.';

      setMessages((prev) => [...prev, { id: makeId(), role: 'assistant', content: text }]);

      // Display in the metric cards too (text-only, no charts/tables)
      setMetrics({
        cashAtRisk: typeof cashAtRisk === 'number' ? { amount: cashAtRisk, deals: 0 } : cashAtRisk,
        velocity:
          typeof velocity === 'string'
            ? { label: velocity, wow: 0 }
            : velocity,
        topAction:
          typeof nextBestAction === 'string'
            ? { label: nextBestAction, detail: voiceSummary || '' }
            : nextBestAction,
        voiceSummary,
      });

      // Requirement: Text + voice only
      if (shouldSpeak) {
        await speakGreeting(voiceSummary || text);
      }
    } catch (err) {
      const assistantMsg = {
        id: makeId(),
        role: 'assistant',
        content: err?.message || 'Something went wrong.',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }
  };

  const handleVoiceResult = async () => {
    // We reuse existing VoiceButton pattern, which currently speaks its own backend response.
    // In Copilot, we treat voice result as a trigger to refresh the Copilot state.
    // If your backend returns transcript/command in /api/voice/command, we can wire it later.
    setLastTranscript('Voice command captured.');
  };

  const containerClass = `copilotGrid ${mode === 'voice' ? 'voiceOnly' : ''}`;

  const isConnectedGateOpen = ghlConnected && !ghlStatusLoading;

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
