import '../../styles/components/TopActionCard.css';

function TopActionCard() {
  return (
    <section className="topActionCard" aria-label="Top action">
      <header className="topActionCard__header">
        <div className="topActionCard__title">Top Action</div>
        <div className="topActionCard__badge">AI Priority</div>
      </header>

      <div className="topActionCard__body">
        <h2 className="topActionCard__headline">Follow up with Acme Corp today</h2>
        <p className="topActionCard__subtext">
          The deal has been quiet for 14 days. A quick pricing + ROI follow-up could unblock next steps.
        </p>
      </div>

      <footer className="topActionCard__footer">
        <div className="topActionCard__metric">
          <div className="topActionCard__metricLabel">Deal value</div>
          <div className="topActionCard__metricValue">$125,000</div>
        </div>

        <button type="button" className="topActionCard__cta">
          Take action
        </button>
      </footer>
    </section>
  );
}

export default TopActionCard;
