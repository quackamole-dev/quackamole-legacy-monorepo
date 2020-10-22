import {INIT_LOCAL_USER_SOCKET, RESET_LOCAL_USER, SET_LOCAL_USER_LOADING, SET_LOCAL_USER_MEDIA_CONSTRAINTS, SET_LOCAL_USER_METADATA, SET_LOCAL_USER_MICROPHONE_ENABLED, SET_LOCAL_USER_CAMERA_ENABLED} from '../actionTypes';
import io from 'socket.io-client';
import {getPersistedData, persistData, serializeQueryString} from '../../utils';
import {addConnection, initDataChannelListeners, removeConnection} from './connections.actions';
import {startLocalStream} from './streams.actions';
import {setCurrentRoomError} from './room.actions';
import {BACKEND_URL} from '../../constants';

export const resetLocalUser = () => ({ type: RESET_LOCAL_USER });

/**
 * Init the socket.io client. Once socket is ready, init the peerJS Peer and store them in the store.
 */
export const initLocalUser = () => async (dispatch, getState) => {
  const metadata = getPersistedData('metadata');

  if (!getState().localUser.loading) {
    if (!metadata.nickname || !metadata.nickname.length) {
      dispatch(setCurrentRoomError({ error: { name: 'RoomError', message: 'Please enter a nickname before joining the room.' } }));
    } else {
      dispatch(initLocalUserSocket(metadata));
    }
  }
};

const initLocalUserSocket = (metadata) => async (dispatch, getState) => {

  dispatch({ type: SET_LOCAL_USER_LOADING, payload: { loading: true } });
  const socket = io(BACKEND_URL, {
    // transports: ['websocket'],
    secure: window.location.protocol === 'https',
    query: serializeQueryString(metadata)
  });

  dispatch(initLocalUserSocketListeners(socket));
};

const initLocalUserSocketListeners = (socket) => async (dispatch, getState) => {
  socket.on('ready', (socketId) => {
    dispatch({ type: INIT_LOCAL_USER_SOCKET, payload: { socket } });

    socket.on('user-leave', (socketId) => {
      const connection = getState().connections.data[socketId];
      if (connection) {
        dispatch(removeConnection(connection));
      }
    });

    socket.on('offer', async ({ senderSocketId, offer }) => {
      console.log('OFFER received - senderId:', senderSocketId, 'offer:', offer);

      const configuration = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        iceCandidatePoolSize: 1
      };

      const connection = new RTCPeerConnection(configuration); // TODO check first if one already exists
      connection.socketId = socket.id; // FIXME temporary solution. store as es6 map. do "new Map(Array.from(m).reverse())" for reverse lookup
      connection.remoteSocketId = senderSocketId;

      connection.defaultDataChannel = connection.createDataChannel('default'); // FIXME temporary. create wrapper for RTCPeerConnection
      console.log('--defaultDataChannel created', connection.defaultDataChannel);
      dispatch(initDataChannelListeners(connection.defaultDataChannel));

      const localStreamWrapper = await getState().localUser.mediaStream;
      let localStream = await localStreamWrapper ? localStreamWrapper.stream : dispatch(startLocalStream());
      connection.addStream(localStream); // addStream needs to be called BEFORE attempting to create offer/answer
      await dispatch(addConnection(connection));

      await connection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);
      socket.emit('answer', { receiverSocketId: senderSocketId, answer: answer });

    });

    socket.on('answer', ({ senderSocketId, answer }) => {
      const connection = getState().connections.data[senderSocketId];

      if (connection) {
        console.log('ANSWER received - senderId:', senderSocketId, 'answer:', answer, 'connection:', connection);
        connection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on('ice-candidates', ({ senderSocketId, iceCandidates }) => {
      const connection = getState().connections.data[senderSocketId];

      if (connection) {
        console.log('ICE Candidates received - senderId:', senderSocketId);
        iceCandidates.forEach(candidate => connection.addIceCandidate(new RTCIceCandidate(candidate)));
      }
    });
  });
};

export const setMetadata = (metadata) => (dispatch, getState) => {
  persistData('metadata', metadata);
  dispatch({ type: SET_LOCAL_USER_METADATA, payload: { metadata } });
};

export const setMediaStreamConstraints = (constraints) => async (dispatch, getState) => {
  await dispatch({ type: SET_LOCAL_USER_MEDIA_CONSTRAINTS, payload: { constraints } });

  // Re-Start local stream to update constraints
  const localStreamWrapper = getState().localUser.mediaStream;
  if (localStreamWrapper) {
    dispatch(startLocalStream());
  }
};

export const toggleMicrophoneEnabled = () => (dispatch, getState) => {
  const newEnabled = !getState().localUser.micEnabled;
  dispatch({ type: SET_LOCAL_USER_MICROPHONE_ENABLED, payload: { enabled: newEnabled } });

  // Re-Start local stream to update constraints
  const localStreamWrapper = getState().localUser.mediaStream;
  if (localStreamWrapper || newEnabled) {
    dispatch(startLocalStream());
  }
};

export const toggleCameraEnabled = () => (dispatch, getState) => {
  const newEnabled = !getState().localUser.camEnabled;
  dispatch({ type: SET_LOCAL_USER_CAMERA_ENABLED, payload: { enabled: newEnabled } });

  // Re-Start local stream to update constraints
  const localStreamWrapper = getState().localUser.mediaStream;
  if (localStreamWrapper || newEnabled) {
    dispatch(startLocalStream());
  }
};
