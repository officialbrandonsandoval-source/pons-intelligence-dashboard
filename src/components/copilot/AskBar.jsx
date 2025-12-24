import { useMemo, useState } from 'react';
import VoiceButton from '../VoiceButton';

function AskBar({ disabled, mode, onAsk, onVoiceResult, transcript }) {
  const [value, setValue] = useState('');

  const canSend = useMemo(() => {
    return value.trim().length > 0 && !disabled;
  }, [value, disabled]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSend) return;
    const q = value.trim();
    setValue('');
    onAsk(q);
  };

  return (
    <form className="askBar" onSubmit={handleSubmit} aria-label="Ask Copilot">
      <input
        className="askBar__input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={mode === 'voice' ? 'Voice-only mode (type disabled)' : 'Ask about pipeline, risks, next steps…'}
        disabled={disabled || mode === 'voice'}
      />

      <VoiceButton
        onResult={onVoiceResult}
        disabled={disabled}
        disabledReason="GoHighLevel is not connected. First connect."
      />

      <button
        type="submit"
        className="askBar__btn askBar__btnPrimary"
        disabled={!canSend}
        title="Send"
      >
        Send
      </button>

      {mode === 'voice' && transcript ? (
        <div style={{ display: 'none' }}>{transcript}</div>
      ) : null}
    </form>
  );
}

export default AskBar;
