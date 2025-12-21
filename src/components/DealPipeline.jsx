import '../styles/components/DealPipeline.css';

function DealPipeline() {
  const deals = [
    {
      id: 1,
      rank: 1,
      company: 'Acme Corp',
      value: 125000,
      stage: 'Proposal',
      probability: 65,
      health: 'medium',
      lastContact: '14 days ago',
      nextAction: 'Schedule pricing call',
      priority: 'high',
    },
    {
      id: 2,
      rank: 2,
      company: 'TechStart Inc',
      value: 85000,
      stage: 'Negotiation',
      probability: 80,
      health: 'high',
      lastContact: '2 days ago',
      nextAction: 'Send final proposal',
      priority: 'medium',
    },
    {
      id: 3,
      rank: 3,
      company: 'Global Systems',
      value: 210000,
      stage: 'Discovery',
      probability: 45,
      health: 'low',
      lastContact: '21 days ago',
      nextAction: 'Re-engage contact',
      priority: 'high',
    },
    {
      id: 4,
      rank: 4,
      company: 'InnovateCo',
      value: 45000,
      stage: 'Proposal',
      probability: 70,
      health: 'high',
      lastContact: '1 day ago',
      nextAction: 'Follow up on demo',
      priority: 'medium',
    },
    {
      id: 5,
      rank: 5,
      company: 'Enterprise Solutions',
      value: 175000,
      stage: 'Negotiation',
      probability: 55,
      health: 'medium',
      lastContact: '7 days ago',
      nextAction: 'Address technical concerns',
      priority: 'high',
    },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getHealthClass = (health) => {
    return `health-${health}`;
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  return (
    <section className="deal-pipeline-section">
      <div className="section-header">
        <h2 className="section-title">Deal Pipeline Rankings</h2>
        <div className="pipeline-filters">
          <button className="filter-btn active">All Deals</button>
          <button className="filter-btn">High Priority</button>
          <button className="filter-btn">At Risk</button>
        </div>
      </div>

      <div className="deal-pipeline-table">
        <div className="table-header">
          <div className="col-rank">Rank</div>
          <div className="col-company">Company</div>
          <div className="col-value">Value</div>
          <div className="col-stage">Stage</div>
          <div className="col-probability">Win %</div>
          <div className="col-health">Health</div>
          <div className="col-action">Next Action</div>
          <div className="col-buttons"></div>
        </div>

        <div className="table-body">
          {deals.map((deal) => (
            <div 
              key={deal.id} 
              className={`deal-row ${getPriorityClass(deal.priority)}`}
            >
              <div className="col-rank">
                <span className="rank-badge">#{deal.rank}</span>
              </div>
              
              <div className="col-company">
                <div className="company-info">
                  <span className="company-name">{deal.company}</span>
                  <span className="last-contact">{deal.lastContact}</span>
                </div>
              </div>

              <div className="col-value">
                <span className="deal-value">{formatCurrency(deal.value)}</span>
              </div>

              <div className="col-stage">
                <span className="stage-badge">{deal.stage}</span>
              </div>

              <div className="col-probability">
                <div className="probability-container">
                  <div className="probability-bar">
                    <div 
                      className="probability-fill"
                      style={{ width: `${deal.probability}%` }}
                    ></div>
                  </div>
                  <span className="probability-text">{deal.probability}%</span>
                </div>
              </div>

              <div className="col-health">
                <span className={`health-badge ${getHealthClass(deal.health)}`}>
                  {deal.health}
                </span>
              </div>

              <div className="col-action">
                <span className="next-action">{deal.nextAction}</span>
              </div>

              <div className="col-buttons">
                <button className="btn-deal-action">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pipeline-summary">
        <div className="summary-item">
          <span className="summary-label">Total Pipeline Value</span>
          <span className="summary-value">
            {formatCurrency(deals.reduce((sum, deal) => sum + deal.value, 0))}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Weighted Value</span>
          <span className="summary-value">
            {formatCurrency(
              deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0)
            )}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Active Deals</span>
          <span className="summary-value">{deals.length}</span>
        </div>
      </div>
    </section>
  );
}

export default DealPipeline;
