import { api, apiClient } from './client';

// DEMO MODE (forced)
// - No MediaRecorder usage
// - No real audio upload
// - Still calls backend endpoints so UI/backends can be demoed end-to-end
export const demoMode = true;

// Rules enforced:
// - All requests go through client.js (apiClient)
// - No fetch()
// - No manual base URLs / port references
// - Errors are surfaced (never swallowed)

export async function startSession() {
  // Endpoint: POST /api/voice/session/start
  // Contract requirement: must call {VITE_API_URL}/api/voice/session/start (never same-origin /api).
  return apiClient.post('/api/voice/session/start', {
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
  // DEMO MODE: Ignore real audio.
  // Still call the endpoint, but send JSON so the backend can respond with a transcript/response.
  if (demoMode) {
    const data = await apiClient.post('/api/voice/command', {
      sessionId: sessionId || null,
      demo: true,
      // Optional placeholder for backends that want it
      audio: null,
    });

    return {
      transcript: data?.transcript ?? data?.text ?? data?.query ?? '',
      response: data?.response ?? data?.answer ?? data?.message ?? data?.text ?? '',
      text: data?.text ?? data?.response ?? data?.answer ?? data?.message ?? '',
      raw: data,
      demo: true,
    };
  }

  // Non-demo path: FormData used for audio
  if (!audioBlob) {
    throw new Error('sendVoiceCommand requires audioBlob');
  }

  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  if (sessionId) {
    formData.append('sessionId', sessionId);
  }

  const data = await apiClient.postFormData('/api/voice/command', formData);

  return {
    transcript: data?.transcript ?? data?.text ?? '',
    response: data?.response ?? data?.answer ?? data?.message ?? '',
    text: data?.text ?? data?.response ?? data?.answer ?? data?.message ?? '',
    raw: data,
    demo: false,
  };
}

export async function speakText({ text, voice, format } = {}) {
  // Endpoint: POST /api/voice/speak
  if (!text || String(text).trim().length === 0) {
    throw new Error('speakText requires non-empty text');
  }

  return apiClient.post('/api/voice/speak', {
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
    if (demoMode) {
      // In demo mode we must not access mic APIs.
      return true;
    }
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
    if (demoMode) {
      // No-op in demo mode.
      return;
    }
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
    if (demoMode) {
      // Return a placeholder blob so callers that expect one don't break.
      return Promise.resolve(new Blob([], { type: 'audio/webm' }));
    }
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
    if (demoMode) {
      this.mediaRecorder = null;
      this.audioChunks = [];
      this.stream = null;
      return;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }
}
