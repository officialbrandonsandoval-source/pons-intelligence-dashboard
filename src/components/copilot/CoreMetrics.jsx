function CoreMetrics({ metrics, topActionOpen, onToggleTopAction }) {
  const cashValue = metrics?.cashAtRisk?.amount ?? 342000;
  const cashDeals = metrics?.cashAtRisk?.deals ?? 8;

  const velocityLabel = metrics?.velocity?.label ?? 'Pipeline moving';
  const velocityWow = metrics?.velocity?.wow ?? 12;

  const topActionLabel = metrics?.topAction?.label ?? 'Follow up with Acme Corp today';
  const topActionDetail =
    metrics?.topAction?.detail ??
    'Deal stalled ~14 days. Send ROI + pricing recap and propose next step.';

  const formatCurrency = (value) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(value);
    } catch {
      return `$${value}`;
    }
  };

  return (
    <section className="coreMetrics" aria-label="Core metrics">
      <div className="metricCard">
        <div className="metricCard__kicker">CASH AT RISK</div>
        <div className="metricCard__value">{formatCurrency(cashValue)}</div>
        <div className="metricCard__meta">{cashDeals} deals flagged</div>
      </div>

      <div className="metricCard">
        <div className="metricCard__kicker">VELOCITY</div>
        <div className="metricCard__value">{velocityLabel}</div>
        <div className="metricCard__meta">WoW {velocityWow > 0 ? '+' : ''}{velocityWow}%</div>
      </div>

      <div className="metricCard">
        <div className="metricCard__kicker">TOP ACTION</div>
        <div className="metricCard__value" style={{ fontSize: 18, lineHeight: 1.25 }}>{topActionLabel}</div>
        <button type="button" className="metricCard__cta" onClick={onToggleTopAction}>
          {topActionOpen ? 'Hide details' : 'Open details'}
        </button>
        {topActionOpen ? <div className="metricDetails">{topActionDetail}</div> : null}
      </div>
    </section>
  );
}

export default CoreMetrics;
