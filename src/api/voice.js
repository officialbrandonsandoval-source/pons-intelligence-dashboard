import { apiClient } from './client';

// Voice API for sending commands and receiving responses
export const voiceAPI = {
  // Start a new voice session
  async startSession() {
    try {
      return await apiClient.post('/voice/session/start', {
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to start voice session:', error);
      throw error;
    }
  },

  // End an active voice session
  async endSession(sessionId) {
    try {
      return await apiClient.post('/voice/session/end', { sessionId });
    } catch (error) {
      console.error('Failed to end voice session:', error);
      throw error;
    }
  },

  // Send audio data for processing
  async sendAudioBlob(audioBlob, sessionId) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      if (sessionId) {
        formData.append('sessionId', sessionId);
      }

      return await apiClient.postFormData('/voice/process', formData);
    } catch (error) {
      console.error('Failed to send audio:', error);
      throw error;
    }
  },

  // Send a text command (for testing or fallback)
  async sendTextCommand(command, sessionId) {
    try {
      return await apiClient.post('/voice/command', {
        command,
        sessionId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to send text command:', error);
      throw error;
    }
  },

  // Get transcript for a session
  async getTranscript(sessionId) {
    try {
      return await apiClient.get(`/voice/transcript/${sessionId}`);
    } catch (error) {
      console.error('Failed to get transcript:', error);
      throw error;
    }
  },
};

// Voice Recording Manager using MediaRecorder
export class VoiceRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
  }

  async initialize() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      return true;
    } catch (error) {
      console.error('Failed to initialize microphone:', error);
      throw new Error('Microphone access denied');
    }
  }

  startRecording() {
    if (!this.stream) {
      throw new Error('Microphone not initialized');
    }

    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(this.stream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
  }

  stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        resolve(audioBlob);
      };

      this.mediaRecorder.onerror = (error) => {
        reject(error);
      };

      this.mediaRecorder.stop();
    });
  }

  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }
}

// Text-to-Speech utility
export const speakText = (text, options = {}) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;
    utterance.lang = options.lang || 'en-US';

    // Select voice if specified
    if (options.voiceName) {
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === options.voiceName);
      if (voice) {
        utterance.voice = voice;
      }
    }

    utterance.onend = () => resolve();
    utterance.onerror = (error) => reject(error);

    // Cancel any ongoing speech
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  });
};

// Helper to stop any ongoing speech
export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
};
