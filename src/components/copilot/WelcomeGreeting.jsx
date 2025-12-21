function WelcomeGreeting({ text }) {
  return (
    <div>
      <h1 className="copilotTitle">Copilot</h1>
      <p className="copilotSubtitle">{text}</p>
    </div>
  );
}

export default WelcomeGreeting;
