import '../styles/components/RevenueLeaks.css';

function RevenueLeaks() {
  const leakData = {
    totalAtRisk: 342000,
    leaks: [
      {
        id: 1,
        category: 'Stalled Deals',
        count: 8,
        value: 187000,
        severity: 'high',
        trend: 'up',
      },
      {
        id: 2,
        category: 'No Recent Contact',
        count: 5,
        value: 95000,
        severity: 'medium',
        trend: 'stable',
      },
      {
        id: 3,
        category: 'Competitive Risk',
        count: 3,
        value: 60000,
        severity: 'high',
        trend: 'up',
      },
    ],
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getSeverityClass = (severity) => {
    return `severity-${severity}`;
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  return (
    <section className="revenue-leaks-section">
      <div className="section-header">
        <h2 className="section-title">Revenue Leak Detection</h2>
        <div className="section-summary">
          <span className="summary-label">Total at Risk:</span>
          <span className="summary-value">{formatCurrency(leakData.totalAtRisk)}</span>
        </div>
      </div>

      <div className="leaks-grid">
        {leakData.leaks.map((leak) => (
          <div key={leak.id} className={`leak-card ${getSeverityClass(leak.severity)}`}>
            <div className="leak-header">
              <div className="leak-category">
                <span className="category-name">{leak.category}</span>
                <span className={`trend-indicator ${leak.trend}`}>
                  {getTrendIcon(leak.trend)}
                </span>
              </div>
              <span className={`severity-badge ${leak.severity}`}>
                {leak.severity}
              </span>
            </div>

            <div className="leak-stats">
              <div className="leak-value">{formatCurrency(leak.value)}</div>
              <div className="leak-count">{leak.count} deals affected</div>
            </div>

            <div className="leak-progress">
              <div 
                className="leak-progress-bar"
                style={{ 
                  width: `${(leak.value / leakData.totalAtRisk) * 100}%` 
                }}
              ></div>
            </div>

            <button className="leak-action-btn">
              View Details →
            </button>
          </div>
        ))}
      </div>

      <div className="leaks-footer">
        <button className="btn-view-all">
          View All Risk Factors
        </button>
        <button className="btn-export">
          Export Report
        </button>
      </div>
    </section>
  );
}

export default RevenueLeaks;
