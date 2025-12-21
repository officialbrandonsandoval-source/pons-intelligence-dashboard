import '../styles/pages/Landing.css';

function Landing({ onNavigate }) {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-content">
          <h1 className="landing-title">PONS Intelligence Dashboard</h1>
          <p className="landing-subtitle">
            AI-powered revenue intelligence for your sales team
          </p>
          <div className="landing-actions">
            <button 
              className="btn-primary"
              onClick={() => onNavigate('connect-crm')}
            >
              Get Started
            </button>
            <button 
              className="btn-secondary"
              onClick={() => onNavigate('dashboard')}
            >
              View Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
