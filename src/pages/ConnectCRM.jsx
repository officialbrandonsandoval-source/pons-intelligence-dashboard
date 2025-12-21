import '../styles/pages/ConnectCRM.css';

function ConnectCRM({ onNavigate }) {
  const handleConnect = (crm) => {
    console.log(`Connecting to ${crm}...`);
    onNavigate('dashboard');
  };

  const handleGoHighLevel = () => {
    // Note: App-level routing is currently state-based.
    // This string is intentionally the requested path so it can be wired up in App.jsx next.
    onNavigate('/connect/gohighlevel');
  };

  return (
    <div className="connect-crm-page">
      <div className="connect-crm-container">
        <button 
          className="back-button"
          onClick={() => onNavigate('landing')}
        >
          ← Back
        </button>
        
        <div className="connect-crm-content">
          <h1 className="connect-crm-title">Connect Your CRM</h1>
          <p className="connect-crm-subtitle">
            Choose your CRM platform to get started
          </p>
          
          <div className="crm-options">
            <button
              className="crm-card crm-card--disabled"
              disabled
              aria-disabled="true"
              aria-label="Salesforce (coming soon)"
            >
              <div className="crm-icon" aria-hidden="true">SF</div>
              <h3 className="crm-name">Salesforce</h3>
              <p className="crm-description">Coming soon</p>
              <div className="crm-card-footer">
                <span className="crm-pill crm-pill--disabled">Disabled</span>
              </div>
            </button>
            
            <button 
              className="crm-card"
              onClick={() => handleConnect('HubSpot')}
              aria-label="HubSpot (OAuth)"
            >
              <div className="crm-icon">HS</div>
              <h3 className="crm-name">HubSpot</h3>
              <p className="crm-description">Connect via OAuth</p>
              <div className="crm-card-footer">
                <span className="crm-pill crm-pill--oauth">OAuth</span>
              </div>
            </button>
            
            <button
              className="crm-card crm-card--disabled"
              disabled
              aria-disabled="true"
              aria-label="Pipedrive (coming soon)"
            >
              <div className="crm-icon" aria-hidden="true">PD</div>
              <h3 className="crm-name">Pipedrive</h3>
              <p className="crm-description">Coming soon</p>
              <div className="crm-card-footer">
                <span className="crm-pill crm-pill--disabled">Disabled</span>
              </div>
            </button>

            <button
              className="crm-card crm-card--gohighlevel"
              onClick={handleGoHighLevel}
              aria-label="GoHighLevel (connect)"
            >
              <div className="crm-icon crm-icon--gohighlevel">GHL</div>
              <h3 className="crm-name">GoHighLevel</h3>
              <p className="crm-description">Connect your GoHighLevel account</p>
              <div className="crm-card-footer">
                <span className="crm-pill crm-pill--active">Active</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConnectCRM;
