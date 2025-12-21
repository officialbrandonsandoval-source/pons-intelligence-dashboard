import '../../styles/components/LoadingState.css';

function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="loadingState" role="status" aria-live="polite">
      <span className="loadingState__spinner" aria-hidden="true" />
      <span className="loadingState__label">{label}</span>
    </div>
  );
}

export default LoadingState;
