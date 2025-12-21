import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import WelcomeGreeting from '../components/copilot/WelcomeGreeting';
import CoreMetrics from '../components/copilot/CoreMetrics';
import AskBar from '../components/copilot/AskBar';
import Conversation from '../components/copilot/Conversation';
import ModeToggle from '../components/copilot/ModeToggle';
import { copilotAPI } from '../api/copilot';
import { apiClient } from '../api/client';
import '../styles/copilot.css';

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function CopilotDashboard({ onNavigate }) {
  const [mode, setMode] = useState('hybrid'); // silent | hybrid | voice
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState('');

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
    // Use existing /api/voice/speak endpoint.
    // If backend doesn’t support it yet, this will fail silently.
    try {
      await apiClient.post('/api/voice/speak', { text });
    } catch {
      // Intentionally ignore to keep UI smooth.
    }
  };

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      setStatus('loading');
      setErrorMessage('');

      try {
        const res = await copilotAPI.init({
          source: 'gohighlevel',
          userId: 'dev',
          mode: 'hybrid',
        });

        if (cancelled) return;

        const initialGreeting =
          res?.greeting ||
          res?.message ||
          'I’m online. Ask me about cash at risk, velocity, or what to do next.';

        setMetrics(res?.metrics || res?.data?.metrics || null);
        setMessages([{ id: makeId(), role: 'assistant', content: initialGreeting }]);
        setStatus('ready');

        if (shouldSpeak) {
          await speakGreeting(initialGreeting);
        }
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        setErrorMessage(err?.message || 'Failed to load Copilot');
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
    const userMsg = { id: makeId(), role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await copilotAPI.ask({
        source: 'gohighlevel',
        userId: 'dev',
        mode,
        query,
      });

      const answer = res?.answer || res?.response || res?.message || 'Done.';
      const assistantMsg = { id: makeId(), role: 'assistant', content: answer };
      setMessages((prev) => [...prev, assistantMsg]);

      if (shouldSpeak) {
        await speakGreeting(answer);
      }

      if (res?.metrics) {
        setMetrics((prev) => ({ ...(prev || {}), ...res.metrics }));
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

  return (
    <div className="copilotPage">
      <Navbar onNavigate={onNavigate} />

      <main className="copilotMain">
        <header className="copilotHeader">
          <WelcomeGreeting text={greetingText} />
          <ModeToggle mode={mode} onChange={setMode} />
        </header>

        {status === 'error' ? (
          <div style={{ marginTop: 16, color: '#a1a1aa' }}>
            {errorMessage}
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
              disabled={status !== 'ready'}
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
