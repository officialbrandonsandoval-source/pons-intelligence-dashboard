import '../styles/components/RevenueLeakCard.css';

function RevenueLeakCard() {
  return (
    <div className="card revenue-leak-card">
      <div className="card-header">
        <h3 className="card-title">Revenue Leak Detection</h3>
      </div>
      
      <div className="card-content">
        <div className="leak-amount">$342K</div>
        <div className="leak-label">At Risk This Quarter</div>
        
        <div className="leak-breakdown">
          <div className="leak-item">
            <div className="leak-item-info">
              <div className="leak-item-label">Stalled Deals</div>
              <div className="leak-item-count">8 deals</div>
            </div>
            <div className="leak-item-value">$187K</div>
          </div>
          
          <div className="leak-item">
            <div className="leak-item-info">
              <div className="leak-item-label">No Recent Contact</div>
              <div className="leak-item-count">5 deals</div>
            </div>
            <div className="leak-item-value">$95K</div>
          </div>
          
          <div className="leak-item">
            <div className="leak-item-info">
              <div className="leak-item-label">Competitive Risk</div>
              <div className="leak-item-count">3 deals</div>
            </div>
            <div className="leak-item-value">$60K</div>
          </div>
        </div>
        
        <button className="btn-action">View All Risks</button>
      </div>
    </div>
  );
}

export default RevenueLeakCard;
