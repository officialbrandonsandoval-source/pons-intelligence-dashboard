import Navbar from '../components/Navbar';
import '../styles/pages/Settings.css';

function Settings({ onNavigate }) {
  return (
    <div className="settings-page">
      <Navbar onNavigate={onNavigate} />
      
      <main className="settings-main">
        <div className="settings-container">
          <h1 className="settings-title">Settings</h1>
          
          <div className="settings-section">
            <h2 className="settings-section-title">Account</h2>
            <div className="settings-card">
              <div className="settings-item">
                <label className="settings-label">Company Name</label>
                <input 
                  type="text" 
                  className="settings-input"
                  placeholder="Enter company name"
                />
              </div>
              <div className="settings-item">
                <label className="settings-label">Email</label>
                <input 
                  type="email" 
                  className="settings-input"
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>
          
          <div className="settings-section">
            <h2 className="settings-section-title">CRM Integration</h2>
            <div className="settings-card">
              <div className="settings-item">
                <label className="settings-label">Connected CRM</label>
                <div className="connected-crm">
                  <span className="crm-badge">Salesforce</span>
                  <button className="btn-text">Disconnect</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="settings-section">
            <h2 className="settings-section-title">Notifications</h2>
            <div className="settings-card">
              <div className="settings-toggle-item">
                <div>
                  <div className="settings-label">Deal Alerts</div>
                  <div className="settings-description">
                    Get notified when deals require attention
                  </div>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="settings-toggle-item">
                <div>
                  <div className="settings-label">Revenue Updates</div>
                  <div className="settings-description">
                    Receive weekly revenue intelligence reports
                  </div>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
