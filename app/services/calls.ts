import { Platform } from 'react-native';

export type CallState = 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';

export type CallType = 'audio' | 'video';

type CallConfig = {
  appId: string;
  channelName: string;
  token: string | null;
  uid: number;
};

let currentCallState: CallState = 'idle';
let callConfig: CallConfig | null = null;
let localStream: any = null;
let remoteStream: any = null;
let rtcEngine: any = null;
let peerConnection: RTCPeerConnection | null = null;

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
];

/**
 * Planned Agora/WebRTC Integration:
 *
 * Integration approach:
 * - Use `react-native-agora` SDK for production (handles signaling, media relay, recording)
 *   or `react-native-webrtc` for self-hosted WebRTC with a signaling server (e.g., Socket.IO).
 *
 * Flow:
 * 1. User A calls User B via a signaling server (or Agora channel).
 * 2. App generates/retrieves an Agora token or WebRTC offer/answer via signaling.
 * 3. Both peers join the same channel/room.
 * 4. Media streams are published and subscribed.
 * 5. ICE candidates are exchanged for NAT traversal.
 * 6. When the call ends, the channel is left and resources are cleaned up.
 *
 * File structure:
 * - This service abstracts the engine so screens only call startCall/acceptCall/endCall.
 * - Incoming call detection will come from a push notification or signaling event.
 */

export async function startCall(userId: string): Promise<void> {
  currentCallState = 'calling';
  console.log(`[Calls] Starting call with user: ${userId}`);

  /**
   * Planned implementation:
   *   1. Request camera/mic permissions via expo-permissions or react-native-permissions.
   *   2. Initialize Agora engine or RTCPeerConnection.
   *   3. Join channel (channel name could be `${userId}-${currentUserId}`).
   *   4. Publish local audio stream (and video if CallType is 'video').
   *   5. Notify the other user via push notification / signaling.
   *   6. Set up event listeners for remote stream, disconnect, errors.
   *
   * Example (Agora):
   *   import RtcEngine from 'react-native-agora';
   *   const engine = await RtcEngine.create('YOUR_APP_ID');
   *   await engine.enableAudio();
   *   await engine.joinChannel(token, channelName, null, 0);
   *   engine.addListener('onRemoteAudioStateChanged', ...);
   *
   * Example (WebRTC):
   *   const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
   *   const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
   *   stream.getTracks().forEach(track => pc.addTrack(track, stream));
   *   const offer = await pc.createOffer();
   *   await pc.setLocalDescription(offer);
   *   // Send offer via signaling server to userId
   */
}

export async function acceptCall(callId: string): Promise<void> {
  currentCallState = 'connected';
  console.log(`[Calls] Accepting call: ${callId}`);

  /**
   * Planned implementation:
   *   1. Join the same channel / room as the caller.
   *   2. If using WebRTC: set remote description, create answer, send back.
   *   3. Begin publishing local stream.
   *   4. Update UI to show "Connected" state.
   */
}

export async function endCall(callId: string): Promise<void> {
  currentCallState = 'ended';
  console.log(`[Calls] Ending call: ${callId}`);

  /**
   * Planned implementation:
   *   1. Leave Agora channel / close RTCPeerConnection.
   *   2. Stop local media tracks.
   *   3. Release engine resources.
   *   4. Notify the other participant via signaling.
   *
   * Example (Agora):
   *   await engine.leaveChannel();
   *   engine.destroy();
   *
   * Example (WebRTC):
   *   peerConnection.close();
   *   localStream.getTracks().forEach(t => t.stop());
   */
}

export function toggleMute(): void {
  if (localStream) {
    const audioTrack = localStream.getAudioTracks?.()?.[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      console.log(`[Calls] Mute toggled: ${audioTrack.enabled ? 'unmuted' : 'muted'}`);
    }
  }
  /**
   * WebRTC: toggle `audioTrack.enabled`.
   * Agora: use `engine.muteLocalAudioStream(!isMuted)`.
   */
}

export function toggleSpeaker(): void {
  /**
   * Planned implementation:
   *   - Android: switch audio route to speakerphone.
   *   - iOS: override output audio port to speaker.
   *
   * Example:
   *   import { Audio } from 'expo-av';
   *   await Audio.setAudioModeAsync({
   *     playsInSilentModeIOS: true,
   *     allowsRecordingIOS: false,
   *     shouldDuckAndroid: true,
   *     playThroughEarpieceAndroid: false,
   *   });
   */
  console.log('[Calls] Speaker toggled');
}

export function setupWebRTC(): void {
  /**
   * One-time setup:
   *   1. Configure ICE servers.
   *   2. Create RTCPeerConnection with STUN/TURN.
   *   3. Attach event listeners (onicecandidate, ontrack, onconnectionstatechange).
   *   4. Optionally set up a WebSocket signaling client.
   *
   * Example:
   *   const configuration = { iceServers: ICE_SERVERS };
   *   peerConnection = new RTCPeerConnection(configuration);
   *   peerConnection.onicecandidate = (event) => {
   *     if (event.candidate) {
   *       signalingSocket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
   *     }
   *   };
   *   peerConnection.ontrack = (event) => {
   *     remoteStream = event.streams[0];
   *     // Attach remoteStream to <RTCView> or WebRTC view component.
   *   };
   */
  console.log('[Calls] WebRTC setup initialized');
}

export function getCallState(): CallState {
  return currentCallState;
}
