import { useState } from 'react';
import Landing from './pages/Landing';
import ConnectCRM from './pages/ConnectCRM';
import ConnectGoHighLevel from './pages/ConnectGoHighLevel';
import CopilotDashboard from './pages/CopilotDashboard';
import Settings from './pages/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onNavigate={setCurrentPage} />;
      case 'connect-crm':
        return <ConnectCRM onNavigate={setCurrentPage} />;
      case '/connect/gohighlevel':
        return <ConnectGoHighLevel onNavigate={setCurrentPage} />;
      case 'dashboard':
      case '/dashboard':
        return <CopilotDashboard onNavigate={setCurrentPage} />;
      case 'settings':
        return <Settings onNavigate={setCurrentPage} />;
      default:
        return <Landing onNavigate={setCurrentPage} />;
    }
  };

  return <div className="app">{renderPage()}</div>;
}

export default App;
