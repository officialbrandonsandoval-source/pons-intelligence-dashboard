import Navbar from '../components/Navbar';
import VoiceButton from '../components/VoiceButton';
import TopActionCard from '../components/TopActionCard';
import RevenueLeaks from '../components/RevenueLeaks';
import DealPipeline from '../components/DealPipeline';
import '../styles/pages/Dashboard.css';

function Dashboard({ onNavigate }) {
  return (
    <div className="dashboard-page">
      <Navbar onNavigate={onNavigate} />
      
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Hero Section with Voice Button */}
          <div className="dashboard-hero">
            <div className="hero-content">
              <h1 className="dashboard-title">Revenue Intelligence</h1>
              <p className="dashboard-subtitle">
                AI-powered insights and voice commands for your pipeline
              </p>
            </div>
            <VoiceButton />
          </div>
          
          {/* Top Action Card - Dominant Hero Card */}
          <div className="top-action-section">
            <TopActionCard />
          </div>
          
          {/* Revenue Leaks Section */}
          <RevenueLeaks />
          
          {/* Deal Pipeline Rankings */}
          <DealPipeline />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
