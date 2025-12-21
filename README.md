# PONS Intelligence Dashboard

AI-powered voice-enabled revenue intelligence dashboard for sales teams.

## 🎯 Features

### Voice Commands
- **Voice-Enabled Interface**: Full voice command support using MediaRecorder API
- **4 Voice States**: Idle → Recording → Processing → Speaking
- **Real-time Transcription**: Speech-to-text with backend integration
- **Text-to-Speech**: Natural voice responses using Web Speech API

### Revenue Intelligence
- **Top Action Card**: Dominant hero card with AI recommendations
- **Revenue Leak Detection**: Identify at-risk deals and opportunities
- **Deal Pipeline Rankings**: Smart deal prioritization with health indicators
- **Real-time Analytics**: Live data visualization and insights

### Design System
- **Matte Black Theme**: `#0B0B0E` background
- **Purple Primary**: `#7C3AED` accent color
- **Subtle Borders**: `rgba(255,255,255,0.08)` for elegant separation
- **Dark Mode Default**: Optimized for professional use

## 🏗️ Tech Stack

- **Frontend**: React 18.3 + Vite 5.4
- **Language**: JavaScript (ES6+)
- **Styling**: Plain CSS with CSS Variables
- **APIs**: 
  - MediaRecorder API (voice recording)
  - Web Speech API (text-to-speech)
  - Fetch API (backend communication)

## 📁 Project Structure

```
src/
├── api/
│   ├── client.js          # HTTP client with x-api-key auth
│   └── voice.js           # Voice recording & TTS utilities
├── components/
│   ├── Navbar.jsx         # Top navigation
│   ├── VoiceButton.jsx    # Voice command button (4 states)
│   ├── TopActionCard.jsx  # Hero AI recommendation card
│   ├── RevenueLeaks.jsx   # Revenue leak detection grid
│   └── DealPipeline.jsx   # Deal rankings table
├── pages/
│   ├── Landing.jsx        # Landing page
│   ├── ConnectCRM.jsx     # CRM integration flow
│   ├── Dashboard.jsx      # Main dashboard
│   └── Settings.jsx       # User settings
├── styles/
│   ├── globals.css        # Global styles & resets
│   ├── theme.css          # Design system variables
│   ├── components/        # Component-specific styles
│   └── pages/             # Page-specific styles
├── App.jsx                # App router
└── main.jsx              # Entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- Modern browser with microphone access

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure your API settings in .env
# VITE_API_URL=http://localhost:8000
# VITE_API_KEY=your-api-key-here

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app runs on `http://localhost:3000` by default (or next available port).

## 🎤 Voice System Architecture

### Voice States

1. **Idle** (Purple) - Ready for voice command
2. **Recording** (Red) - Actively recording audio
3. **Processing** (Purple + Spinner) - Sending to backend
4. **Speaking** (Green) - Playing AI response

### API Integration

```javascript
// Initialize voice recorder
const recorder = new VoiceRecorder();
await recorder.initialize();

// Start recording
recorder.startRecording();

// Stop and get audio blob
const audioBlob = await recorder.stopRecording();

// Send to backend
const response = await voiceAPI.sendAudioBlob(audioBlob, sessionId);

// Speak response
await speakText(response.text);
```

### Backend API Endpoints

```
POST /voice/session/start      # Start new voice session
POST /voice/session/end        # End active session
POST /voice/process            # Send audio for processing (FormData)
POST /voice/command            # Send text command (fallback)
GET  /voice/transcript/:id     # Get session transcript
```

## 🎨 Design System

### Colors

```css
--bg-primary: #0B0B0E          /* Matte Black */
--bg-secondary: #151519        /* Card Background */
--bg-tertiary: #1C1C21         /* Elevated Elements */

--purple-primary: #7C3AED      /* Primary Actions */
--purple-hover: #6D28D9        /* Hover State */
--purple-light: #A78BFA        /* Accents */

--text-primary: #FFFFFF        /* Primary Text */
--text-secondary: rgba(255, 255, 255, 0.6)  /* Secondary Text */

--border-subtle: rgba(255, 255, 255, 0.08)  /* Borders */
```

### Typography

- **System Font Stack**: -apple-system, BlinkMacSystemFont, Segoe UI
- **Heading Sizes**: 2.5rem (hero), 1.5rem (section), 1rem (card)
- **Body Size**: 0.875rem
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Spacing

- **Container Max Width**: 1400px
- **Section Spacing**: 2rem vertical
- **Card Padding**: 1.5rem - 2rem
- **Grid Gap**: 1.5rem

### Components

- **Cards**: Subtle borders, hover lift effect
- **Buttons**: 0.75rem padding, medium font weight
- **Badges**: 0.6875rem font, uppercase
- **Tables**: Sticky headers, row hover states

## 🔒 Security

- API Key authentication via `x-api-key` header
- Environment variables for sensitive data
- CORS-compliant API client
- Microphone permission handling

## 📱 Responsive Design

- **Desktop First**: Optimized for 1400px+ screens
- **Tablet**: 768px - 1024px breakpoints
- **Mobile**: < 768px with stacked layouts
- **Touch-Friendly**: 48px+ touch targets

## 🧪 Testing Voice Features

1. Grant microphone permissions
2. Click voice button (turns red when recording)
3. Speak your command
4. Click again to stop recording
5. Wait for processing (spinner)
6. Listen to AI response (green)

## 🚧 Roadmap

- [ ] Add authentication & user sessions
- [ ] Implement real CRM integrations (Salesforce, HubSpot)
- [ ] Add voice command shortcuts
- [ ] Export reports to PDF/CSV
- [ ] Real-time deal updates via WebSocket
- [ ] Mobile app (React Native)

## 📄 License

Proprietary - All rights reserved

## 🤝 Contributing

This is a private project. For access, contact the development team.

---

Built with ❤️ using React + Vite
