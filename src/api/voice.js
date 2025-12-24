import { api, apiClient } from './client';

// Rules enforced:
// - All requests go through client.js (apiClient)
// - No fetch()
// - No manual base URLs / port references
// - Errors are surfaced (never swallowed)

export async function startSession() {
  // Endpoint: POST /api/voice/session/start
  // Contract requirement: must call {VITE_API_URL}/api/voice/session/start (never same-origin /api).
  return apiClient.post('api/voice/session/start', {
    timestamp: new Date().toISOString(),
  });
}

// Requested API shape
export async function startVoiceSession() {
  const res = await api.post('/api/voice/session/start');
  return res.data;
}

export async function sendVoiceCommand({ audioBlob, sessionId }) {
  // Endpoint: POST /api/voice/command
  // Ensure: FormData used for audio
  if (!audioBlob) {
    throw new Error('sendVoiceCommand requires audioBlob');
  }

  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  if (sessionId) {
    formData.append('sessionId', sessionId);
  }

  return apiClient.postFormData('api/voice/command', formData);
}

export async function speakText({ text, voice, format } = {}) {
  // Endpoint: POST /api/voice/speak
  if (!text || String(text).trim().length === 0) {
    throw new Error('speakText requires non-empty text');
  }

  return apiClient.post('api/voice/speak', {
    text,
    ...(voice ? { voice } : {}),
    ...(format ? { format } : {}),
  });
}

export async function playAudioResponse(audioResponse, { autoPlay = true } = {}) {
  // Plays audio returned by /api/voice/speak.
  // Supports common response shapes:
  // - Blob/ArrayBuffer (if apiClient is later extended)
  // - { audioUrl }
  // - { audio: "data:audio/...;base64,..." }

  if (!audioResponse) {
    throw new Error('playAudioResponse requires an audioResponse');
  }

  let src = null;

  if (typeof audioResponse === 'string') {
    src = audioResponse;
  } else if (audioResponse?.audioUrl && typeof audioResponse.audioUrl === 'string') {
    src = audioResponse.audioUrl;
  } else if (audioResponse?.audio && typeof audioResponse.audio === 'string') {
    src = audioResponse.audio;
  } else {
    throw new Error('Unsupported audio response shape from /api/voice/speak');
  }

  const audio = new Audio(src);
  audio.preload = 'auto';

  if (autoPlay) {
    await audio.play();
  }

  return audio;
}

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
