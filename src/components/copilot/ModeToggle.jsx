function ModeToggle({ mode, onChange }) {
  const options = [
    { key: 'silent', label: 'Silent' },
    { key: 'hybrid', label: 'Hybrid' },
    { key: 'voice', label: 'Voice-only' },
  ];

  return (
    <div className="modeToggle" role="tablist" aria-label="Copilot mode">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          className={`modeToggle__btn ${mode === opt.key ? 'is-active' : ''}`}
          onClick={() => onChange(opt.key)}
          role="tab"
          aria-selected={mode === opt.key}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default ModeToggle;
