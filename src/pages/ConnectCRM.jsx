import '../styles/pages/ConnectCRM.css';

function ConnectCRM({ onNavigate }) {
  const handleConnect = (crm) => {
    console.log(`Connecting to ${crm}...`);
    onNavigate('dashboard');
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
              className="crm-card"
              onClick={() => handleConnect('Salesforce')}
            >
              <div className="crm-icon">SF</div>
              <h3 className="crm-name">Salesforce</h3>
              <p className="crm-description">Connect your Salesforce account</p>
            </button>
            
            <button 
              className="crm-card"
              onClick={() => handleConnect('HubSpot')}
            >
              <div className="crm-icon">HS</div>
              <h3 className="crm-name">HubSpot</h3>
              <p className="crm-description">Connect your HubSpot account</p>
            </button>
            
            <button 
              className="crm-card"
              onClick={() => handleConnect('Pipedrive')}
            >
              <div className="crm-icon">PD</div>
              <h3 className="crm-name">Pipedrive</h3>
              <p className="crm-description">Connect your Pipedrive account</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConnectCRM;
