import '../styles/components/TopActionCard.css';

function TopActionCard() {
  return (
    <div className="card top-action-card">
      <div className="card-header">
        <h3 className="card-title">Top Action</h3>
        <span className="priority-badge high">High Priority</span>
      </div>
      
      <div className="card-content">
        <div className="action-company">Acme Corp</div>
        <div className="action-value">$125,000</div>
        <div className="action-description">
          Deal stalled for 14 days. Last contact was a pricing discussion.
        </div>
        
        <div className="action-recommendation">
          <div className="recommendation-label">AI Recommendation</div>
          <div className="recommendation-text">
            Schedule a follow-up call to address pricing concerns and present ROI analysis
          </div>
        </div>
        
        <button className="btn-action">Take Action</button>
      </div>
    </div>
  );
}

export default TopActionCard;
