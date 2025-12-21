import { useState, useEffect, useRef } from 'react';
import { VoiceRecorder, voiceAPI, speakText, stopSpeaking } from '../api/voice';
import '../styles/components/VoiceButton.css';

// Voice states
const VOICE_STATES = {
  IDLE: 'idle',
  RECORDING: 'recording',
  PROCESSING: 'processing',
  SPEAKING: 'speaking',
  ERROR: 'error',
};

function VoiceButton() {
  const [voiceState, setVoiceState] = useState(VOICE_STATES.IDLE);
  const [errorMessage, setErrorMessage] = useState('');
  const recorderRef = useRef(null);
  const sessionIdRef = useRef(null);

  useEffect(() => {
    // Initialize voice recorder on mount
    recorderRef.current = new VoiceRecorder();
    
    return () => {
      // Cleanup on unmount
      if (recorderRef.current) {
        recorderRef.current.cleanup();
      }
      stopSpeaking();
    };
  }, []);

  const handleVoiceClick = async () => {
    try {
      switch (voiceState) {
        case VOICE_STATES.IDLE:
          await startRecording();
          break;
        case VOICE_STATES.RECORDING:
          await stopRecording();
          break;
        case VOICE_STATES.SPEAKING:
          stopSpeaking();
          setVoiceState(VOICE_STATES.IDLE);
          break;
        case VOICE_STATES.ERROR:
          setVoiceState(VOICE_STATES.IDLE);
          setErrorMessage('');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Voice interaction error:', error);
      setErrorMessage(error.message);
      setVoiceState(VOICE_STATES.ERROR);
    }
  };

  const startRecording = async () => {
    try {
      // Initialize microphone if needed
      if (!recorderRef.current.stream) {
        await recorderRef.current.initialize();
      }

      // Start a new session
      const sessionData = await voiceAPI.startSession();
      sessionIdRef.current = sessionData.sessionId;

      // Start recording
      recorderRef.current.startRecording();
      setVoiceState(VOICE_STATES.RECORDING);
    } catch (error) {
      if (error.message.includes('denied')) {
        throw new Error('Microphone access denied. Please enable microphone permissions.');
      }
      throw error;
    }
  };

  const stopRecording = async () => {
    setVoiceState(VOICE_STATES.PROCESSING);

    try {
      // Stop recording and get audio blob
      const audioBlob = await recorderRef.current.stopRecording();

      // Send audio to backend for processing
      const response = await voiceAPI.sendAudioBlob(
        audioBlob,
        sessionIdRef.current
      );

      // Handle the response
      if (response.text) {
        setVoiceState(VOICE_STATES.SPEAKING);
        await speakText(response.text);
        setVoiceState(VOICE_STATES.IDLE);
      } else {
        setVoiceState(VOICE_STATES.IDLE);
      }

      // End session
      if (sessionIdRef.current) {
        await voiceAPI.endSession(sessionIdRef.current);
        sessionIdRef.current = null;
      }
    } catch (error) {
      console.error('Processing error:', error);
      setVoiceState(VOICE_STATES.IDLE);
      throw error;
    }
  };

  const getButtonContent = () => {
    switch (voiceState) {
      case VOICE_STATES.RECORDING:
        return {
          icon: <RecordingIcon />,
          label: 'Recording...',
        };
      case VOICE_STATES.PROCESSING:
        return {
          icon: <ProcessingIcon />,
          label: 'Processing...',
        };
      case VOICE_STATES.SPEAKING:
        return {
          icon: <SpeakingIcon />,
          label: 'Speaking...',
        };
      case VOICE_STATES.ERROR:
        return {
          icon: <ErrorIcon />,
          label: 'Error',
        };
      default:
        return {
          icon: <MicrophoneIcon />,
          label: 'Voice Command',
        };
    }
  };

  const { icon, label } = getButtonContent();

  return (
    <div className="voice-button-container">
      <button
        className={`voice-button ${voiceState}`}
        onClick={handleVoiceClick}
        disabled={voiceState === VOICE_STATES.PROCESSING}
        aria-label={label}
        title={label}
      >
        {icon}
        {voiceState === VOICE_STATES.RECORDING && (
          <span className="recording-indicator"></span>
        )}
        {voiceState === VOICE_STATES.PROCESSING && (
          <span className="processing-spinner"></span>
        )}
      </button>
      {errorMessage && (
        <div className="voice-error-tooltip">{errorMessage}</div>
      )}
    </div>
  );
}

// SVG Icons
const MicrophoneIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z"
      fill="currentColor"
    />
    <path
      d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10H3V12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12V10H19Z"
      fill="currentColor"
    />
    <path d="M11 22H13V24H11V22Z" fill="currentColor" />
  </svg>
);

const RecordingIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="8" fill="currentColor" />
  </svg>
);

const ProcessingIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
      fill="currentColor"
      opacity="0.3"
    />
    <path
      d="M12 4C14.21 4 16.21 4.9 17.62 6.31L15.5 8.43C14.66 7.59 13.4 7 12 7V4Z"
      fill="currentColor"
    />
  </svg>
);

const SpeakingIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 9V15H7L12 20V4L7 9H3Z"
      fill="currentColor"
    />
    <path
      d="M16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.02C15.48 15.29 16.5 13.77 16.5 12Z"
      fill="currentColor"
    />
    <path
      d="M14 3.23V5.29C16.89 6.15 19 8.83 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.72 18.01 4.14 14 3.23Z"
      fill="currentColor"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
      fill="currentColor"
    />
  </svg>
);

export default VoiceButton;
