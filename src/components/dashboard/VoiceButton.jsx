import { useMemo, useState } from 'react';
import '../../styles/components/VoiceButton.css';

// Frontend-only UI button (no voice logic wired here yet).
// Keeps styling consistent with the new Dashboard palette.
function VoiceButton() {
  const [state, setState] = useState('idle'); // idle | processing

  const label = useMemo(() => {
    if (state === 'processing') return 'Processing…';
    return 'Voice';
  }, [state]);

  const handleClick = async () => {
    if (state === 'processing') return;

    // Temporary UI state to demonstrate interaction.
    setState('processing');
    window.setTimeout(() => setState('idle'), 900);
  };

  return (
    <button
      type="button"
      className={`voiceButton ${state === 'processing' ? 'is-processing' : ''}`}
      onClick={handleClick}
      aria-label="Voice command"
    >
      <span className="voiceButton__icon" aria-hidden="true">
        <span className="voiceButton__dot" />
      </span>
      <span className="voiceButton__label">{label}</span>
      {state === 'processing' ? <span className="voiceButton__spinner" aria-hidden="true" /> : null}
    </button>
  );
}

export default VoiceButton;
