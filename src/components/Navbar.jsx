import '../styles/components/Navbar.css';

function Navbar({ onNavigate }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => onNavigate('dashboard')}>
          <span className="navbar-logo">PONS</span>
        </div>
        
        <div className="navbar-menu">
          <button 
            className="navbar-link"
            onClick={() => onNavigate('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className="navbar-link"
            onClick={() => onNavigate('settings')}
          >
            Settings
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
