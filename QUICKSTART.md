# PONS Dashboard - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
# Set VITE_API_URL to your backend URL
# Set VITE_API_KEY to your API key
```

### Step 3: Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Step 4: Test Voice Commands

1. Navigate to Dashboard page
2. Click the purple voice button (top right)
3. Grant microphone permission when prompted
4. Click again to start recording (button turns red)
5. Speak your command
6. Click to stop recording
7. Wait for AI response (button turns green)

---

## 🎯 Key Components

### VoiceButton
Location: `src/components/VoiceButton.jsx`

**Props**: None (standalone)

**States**:
- `idle` - Ready (purple)
- `recording` - Recording (red, pulsing)
- `processing` - Sending to backend (spinner)
- `speaking` - Playing response (green)
- `error` - Error occurred (red with tooltip)

**Usage**:
```jsx
import VoiceButton from './components/VoiceButton';

<VoiceButton />
```

### RevenueLeaks
Location: `src/components/RevenueLeaks.jsx`

**Props**: None (uses internal data)

**Features**:
- Grid of leak cards
- Severity indicators
- Progress bars
- Action buttons

**Usage**:
```jsx
import RevenueLeaks from './components/RevenueLeaks';

<RevenueLeaks />
```

### DealPipeline
Location: `src/components/DealPipeline.jsx`

**Props**: None (uses internal data)

**Features**:
- Ranked deal table
- Win probability bars
- Health badges
- Pipeline summary

**Usage**:
```jsx
import DealPipeline from './components/DealPipeline';

<DealPipeline />
```

---

## 🔌 API Integration

### Voice API

```javascript
import { VoiceRecorder, voiceAPI, speakText } from './api/voice';

// Initialize recorder
const recorder = new VoiceRecorder();
await recorder.initialize();

// Record audio
recorder.startRecording();
// ... user speaks ...
const audioBlob = await recorder.stopRecording();

// Send to backend
const response = await voiceAPI.sendAudioBlob(audioBlob, sessionId);

// Play response
await speakText(response.text);

// Cleanup
recorder.cleanup();
```

### HTTP Client

```javascript
import { apiClient } from './api/client';

// GET request
const data = await apiClient.get('/endpoint');

// POST request
const result = await apiClient.post('/endpoint', { key: 'value' });

// FormData POST
const formData = new FormData();
formData.append('file', blob);
const response = await apiClient.postFormData('/upload', formData);
```

---

## 🎨 Styling Guide

### Using Theme Variables

```css
.my-component {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}
```

### Common Patterns

**Card Component**:
```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.card:hover {
  border-color: var(--border-medium);
  transform: translateY(-2px);
}
```

**Button Component**:
```css
.btn-primary {
  background: var(--purple-primary);
  color: var(--text-primary);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--purple-hover);
  transform: translateY(-1px);
}
```

**Badge Component**:
```css
.badge {
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-sm);
  font-size: 0.6875rem;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
}

.badge.high {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
```

---

## 📝 Common Tasks

### Adding a New Page

1. Create page component in `src/pages/NewPage.jsx`:
```jsx
function NewPage({ onNavigate }) {
  return (
    <div className="new-page">
      <h1>New Page</h1>
    </div>
  );
}

export default NewPage;
```

2. Create page styles in `src/styles/pages/NewPage.css`

3. Add route to `src/App.jsx`:
```jsx
case 'new-page':
  return <NewPage onNavigate={setCurrentPage} />;
```

### Adding a New Component

1. Create component in `src/components/NewComponent.jsx`:
```jsx
import '../styles/components/NewComponent.css';

function NewComponent({ data }) {
  return (
    <div className="new-component">
      {/* Component content */}
    </div>
  );
}

export default NewComponent;
```

2. Create styles in `src/styles/components/NewComponent.css`

3. Import and use in page:
```jsx
import NewComponent from '../components/NewComponent';

<NewComponent data={myData} />
```

### Adding a New API Endpoint

1. Open `src/api/client.js` or create new API module

2. Add method:
```javascript
export const myAPI = {
  async getData() {
    return apiClient.get('/my-endpoint');
  },
  
  async postData(payload) {
    return apiClient.post('/my-endpoint', payload);
  },
};
```

3. Use in component:
```javascript
import { myAPI } from '../api/client';

const data = await myAPI.getData();
```

---

## 🐛 Troubleshooting

### Microphone Not Working

**Issue**: Voice button shows error
**Solution**: 
- Check browser microphone permissions
- Use HTTPS (required for production)
- Check console for errors

### API Requests Failing

**Issue**: Network errors in console
**Solution**:
- Verify `.env` configuration
- Check backend is running
- Verify API key is correct
- Check CORS settings on backend

### Styles Not Loading

**Issue**: Components look unstyled
**Solution**:
- Verify CSS import path
- Check file exists in `src/styles/`
- Clear browser cache
- Restart dev server

### Hot Reload Not Working

**Issue**: Changes not reflecting
**Solution**:
```bash
# Stop dev server (Ctrl+C)
# Clear cache
rm -rf node_modules/.vite

# Restart
npm run dev
```

---

## 📦 Building for Production

```bash
# Build optimized bundle
npm run build

# Output in /dist folder

# Preview production build locally
npm run preview

# Deploy /dist folder to your hosting
```

### Environment Variables for Production

Create `.env.production`:
```bash
VITE_API_URL=https://api.yourdomain.com
VITE_API_KEY=prod-api-key-here
VITE_ENV=production
```

---

## 🔐 Security Checklist

- [ ] Use HTTPS in production
- [ ] Store API keys in environment variables (never commit)
- [ ] Validate all user input
- [ ] Implement rate limiting on backend
- [ ] Use CORS properly
- [ ] Sanitize voice command responses
- [ ] Implement authentication
- [ ] Add request timeouts

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)

---

## 💡 Tips & Best Practices

### Performance
- Keep components small and focused
- Use CSS for animations (not JS)
- Lazy load heavy components
- Optimize images
- Use production build for deployment

### Code Style
- Use meaningful variable names
- Add comments for complex logic
- Keep functions pure when possible
- Extract reusable logic to utilities
- Follow existing file structure

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "Add new feature"

# Push and create PR
git push origin feature/new-feature
```

---

## 🆘 Need Help?

1. Check `ARCHITECTURE.md` for system overview
2. Check `README.md` for full documentation
3. Search existing issues
4. Contact development team

---

Happy coding! 🚀
