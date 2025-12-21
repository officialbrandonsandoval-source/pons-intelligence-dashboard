# PONS Dashboard - Component Architecture

## Component Hierarchy

```
App.jsx (Router)
│
├── Landing.jsx
│   ├── Hero Section
│   ├── CTA Buttons
│   └── Gradient Background
│
├── ConnectCRM.jsx
│   ├── CRM Cards (Salesforce, HubSpot, Pipedrive)
│   └── Navigation
│
├── Dashboard.jsx ⭐ MAIN VIEW
│   │
│   ├── Navbar.jsx
│   │   ├── Logo (PONS)
│   │   └── Menu Links (Dashboard, Settings)
│   │
│   ├── Hero Section
│   │   ├── Title + Subtitle
│   │   └── VoiceButton.jsx 🎤
│   │       ├── States: idle | recording | processing | speaking
│   │       ├── MediaRecorder Integration
│   │       └── Speech Synthesis
│   │
│   ├── TopActionCard.jsx 🎯 HERO CARD
│   │   ├── Priority Badge
│   │   ├── Company + Deal Value
│   │   ├── Deal Description
│   │   ├── AI Recommendation Box
│   │   └── Action Button
│   │
│   ├── RevenueLeaks.jsx 💰
│   │   ├── Section Header + Total at Risk
│   │   ├── Leak Cards Grid
│   │   │   ├── Category + Trend
│   │   │   ├── Value + Deal Count
│   │   │   ├── Progress Bar
│   │   │   └── Action Button
│   │   └── Footer Buttons
│   │
│   └── DealPipeline.jsx 📊
│       ├── Section Header + Filters
│       ├── Deal Table
│       │   ├── Rank Badge
│       │   ├── Company Info + Last Contact
│       │   ├── Deal Value
│       │   ├── Stage Badge
│       │   ├── Win Probability Bar
│       │   ├── Health Badge
│       │   ├── Next Action
│       │   └── View Button
│       └── Pipeline Summary
│
└── Settings.jsx
    ├── Account Section
    ├── CRM Integration
    └── Notifications Toggle
```

## Voice Button States

```
┌─────────────────────────────────────────────────┐
│  IDLE (Purple)                                  │
│  • Default state                                │
│  • Microphone icon                              │
│  • Click to start recording                     │
└─────────────────────────────────────────────────┘
                    ↓ Click
┌─────────────────────────────────────────────────┐
│  RECORDING (Red)                                │
│  • Recording audio                              │
│  • Circle icon                                  │
│  • Pulsing animation                            │
│  • Ripple effect                                │
│  • Click to stop                                │
└─────────────────────────────────────────────────┘
                    ↓ Click
┌─────────────────────────────────────────────────┐
│  PROCESSING (Purple + Spinner)                  │
│  • Sending to backend                           │
│  • Processing audio                             │
│  • Spinner animation                            │
│  • Disabled state                               │
└─────────────────────────────────────────────────┘
                    ↓ Response Received
┌─────────────────────────────────────────────────┐
│  SPEAKING (Green)                               │
│  • Playing audio response                       │
│  • Speaker icon                                 │
│  • Pulsing animation                            │
│  • Click to stop                                │
└─────────────────────────────────────────────────┘
                    ↓ Complete
                  Back to IDLE
```

## Data Flow

### Voice Command Flow

```
User Clicks Voice Button
        ↓
Request Microphone Permission
        ↓
Initialize MediaRecorder
        ↓
Start Recording (RED STATE)
        ↓
User Clicks Again to Stop
        ↓
Stop MediaRecorder
        ↓
Get Audio Blob
        ↓
PROCESSING STATE
        ↓
POST /voice/process (FormData)
        ↓
Backend: Speech-to-Text
        ↓
Backend: Process Command
        ↓
Backend: Generate Response
        ↓
Response JSON { text: "..." }
        ↓
SPEAKING STATE
        ↓
Web Speech API: speakText()
        ↓
Play Audio Response
        ↓
IDLE STATE
```

### API Client Flow

```
Component
    ↓
voiceAPI.method()
    ↓
apiClient.post/get()
    ↓
Add x-api-key header
    ↓
Fetch API
    ↓
Backend Endpoint
    ↓
JSON Response
    ↓
Component State Update
    ↓
UI Re-render
```

## Styling Architecture

```
globals.css
  • CSS Reset
  • Base Styles
  • Scrollbar
  • Selection Color

theme.css
  • CSS Variables
  • Color Palette
  • Spacing Scale
  • Typography Scale
  • Border Radius
  • Shadows

Component-Specific CSS
  • Navbar.css
  • VoiceButton.css
  • TopActionCard.css
  • RevenueLeaks.css
  • DealPipeline.css
  
Page-Specific CSS
  • Landing.css
  • Dashboard.css
  • Settings.css
```

## Visual Hierarchy

```
┌───────────────────────────────────────────────────────┐
│  NAVBAR (64px height, sticky)                        │
│  Logo + Menu Links                                    │
└───────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────┐
│  HERO SECTION                                         │
│  Title (2.5rem) + Subtitle (1.125rem)    [Voice Btn] │
└───────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────┐
│  TOP ACTION CARD - DOMINANT HERO (Purple gradient)   │
│  • Larger padding (2rem)                              │
│  • Purple glow border                                 │
│  • Bigger value (2.5rem)                              │
│  • AI Recommendation prominent                        │
└───────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────┐
│  REVENUE LEAKS SECTION                                │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐      │
│  │ Leak Card  │  │ Leak Card  │  │ Leak Card  │      │
│  │ Category   │  │ Category   │  │ Category   │      │
│  │ Value      │  │ Value      │  │ Value      │      │
│  │ Progress   │  │ Progress   │  │ Progress   │      │
│  └────────────┘  └────────────┘  └────────────┘      │
└───────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────┐
│  DEAL PIPELINE RANKINGS                               │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Rank │ Company │ Value │ Stage │ Win% │ Health │  │
│  ├─────────────────────────────────────────────────┤  │
│  │  #1  │ Acme    │ $125K │ Prop  │ 65%  │ Medium │  │
│  │  #2  │ Tech    │ $85K  │ Nego  │ 80%  │ High   │  │
│  └─────────────────────────────────────────────────┘  │
│  Pipeline Summary (Total, Weighted, Count)            │
└───────────────────────────────────────────────────────┘
```

## Color Usage Guide

### Background Layers
- **Layer 1 (Body)**: `#0B0B0E` (Matte Black)
- **Layer 2 (Cards)**: `#151519` (Secondary)
- **Layer 3 (Hover)**: `#1C1C21` (Tertiary)

### Text Hierarchy
- **Primary**: `#FFFFFF` (Headings, values)
- **Secondary**: `rgba(255,255,255,0.6)` (Body, labels)
- **Tertiary**: `rgba(255,255,255,0.4)` (Meta info)

### Semantic Colors
- **Primary Action**: `#7C3AED` (Purple)
- **High Priority**: `#EF4444` (Red)
- **Medium Priority**: `#EAB308` (Yellow)
- **Success/High Health**: `#22C55E` (Green)

### Borders
- **Subtle**: `rgba(255,255,255,0.08)` (Default cards)
- **Medium**: `rgba(255,255,255,0.12)` (Hover state)
- **Accent**: `rgba(124,58,237,0.3)` (Purple borders)

## Responsive Breakpoints

```
Desktop:   1400px+   (Optimal)
Laptop:    1024px    (Reduced columns)
Tablet:    768px     (Single column)
Mobile:    480px     (Stacked layout)
```

## Key Interactions

### Hover States
- Cards: `translateY(-2px)` + border color change
- Buttons: Color change + scale effect
- Table rows: Background overlay

### Click States
- Buttons: `scale(0.98)` on active
- Voice button: State-specific animations

### Loading States
- Processing: Spinner rotation
- Disabled: Opacity 0.7

### Focus States
- Inputs: Purple border glow
- Buttons: Outline removed (accessibility handled via visible hover)

## Performance Optimizations

- CSS-only animations (no JS)
- Minimal re-renders (local state)
- Lazy loading for components
- Debounced voice recording
- Memoized formatters
- CSS Grid for layouts (GPU-accelerated)
- Transform animations (hardware-accelerated)
