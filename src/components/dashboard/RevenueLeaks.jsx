import '../../styles/components/RevenueLeaks.css';

function RevenueLeaks() {
  const leaks = [
    {
      id: 'l1',
      title: 'No next step scheduled',
      detail: 'Acme Corp — last activity 14 days ago',
      severity: 'high',
      amount: '$125k',
    },
    {
      id: 'l2',
      title: 'Multi-thread stalled',
      detail: 'Brightline — champion not engaged',
      severity: 'medium',
      amount: '$68k',
    },
    {
      id: 'l3',
      title: 'Pricing objection unresolved',
      detail: 'Northstar — ROI deck requested',
      severity: 'low',
      amount: '$42k',
    },
  ];

  return (
    <section className="revenueLeaks" aria-label="Revenue leaks">
      <div className="revenueLeaks__header">
        <h2 className="revenueLeaks__title">Revenue Leaks</h2>
        <p className="revenueLeaks__subtitle">Fix these issues to protect pipeline value.</p>
      </div>

      <div className="revenueLeaks__grid">
        {leaks.map((leak) => (
          <article key={leak.id} className="revenueLeaks__card">
            <div className="revenueLeaks__cardTop">
              <div className={`revenueLeaks__severity revenueLeaks__severity--${leak.severity}`}>
                {leak.severity}
              </div>
              <div className="revenueLeaks__amount">{leak.amount}</div>
            </div>

            <h3 className="revenueLeaks__cardTitle">{leak.title}</h3>
            <p className="revenueLeaks__detail">{leak.detail}</p>

            <button type="button" className="revenueLeaks__cta">
              Review
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RevenueLeaks;
