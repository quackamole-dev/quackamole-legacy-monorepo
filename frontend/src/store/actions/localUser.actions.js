import {INIT_LOCAL_USER_SOCKET, RESET_LOCAL_USER, SET_LOCAL_USER_LOADING, SET_LOCAL_USER_METADATA} from '../actionTypes';
import io from 'socket.io-client';
import {getPersistedData, persistData, serializeQueryString} from '../../utils';
import {initNewRTCPeerConnection, removeConnection} from './connections.actions';
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

    socket.on('signaling', async ({ senderSocketId, description, iceCandidates }) => {
      // For reference: https://w3c.github.io/webrtc-pc/#perfect-negotiation-example
      try {
        let connection = getState().connections.data[senderSocketId];

        if (!connection) {
          // If connection does not already exists, the senderSocketId was sending the very first offer
          connection = await (dispatch(initNewRTCPeerConnection(senderSocketId, description)));
          connection.polite = true; // the peer receiving very first offer is initially the polite one
          connection.makingOffer = false;
          connection.ignoringOffer = false;
          connection.isSettingRemoteAnswerPending = false;
        }

        if (description) {
          // An offer may come in while we are busy processing SRD(answer).
          // In this case, we will be in "stable" by the time the offer is processed
          // so it is safe to chain it on our Operations Chain now.

          const readyForOffer = !connection.makingOffer && (connection.signalingState === 'stable' || connection.isSettingRemoteAnswerPending);
          const offerCollision = description.type === 'offer' && !readyForOffer;

          // While impolite peer is making an offer he will ignore incoming offers
          connection.ignoreOffer = !connection.polite && offerCollision;
          if (connection.ignoreOffer) { return; }

          connection.isSettingRemoteAnswerPending = description.type === 'answer';
          await connection.setRemoteDescription(description); // with implicit rollback

          if (description.type === 'offer') {
            await connection.setLocalDescription();
            socket.emit('signaling', { receiverSocketId: connection.remoteSocketId, description: connection.localDescription });
          } else if (iceCandidates) {
            try {
              for (const candidate of iceCandidates) {
                await connection.addIceCandidate(new RTCIceCandidate(candidate));
              }
            } catch (err) {
              if (!connection.ignoreOffer) {
                throw err;
              }
            }
          }

        }
      } catch (err) {
        console.error(err);
      }
    });
  });
};

export const setMetadata = (metadata) => (dispatch, getState) => {
  persistData('metadata', metadata);
  dispatch({ type: SET_LOCAL_USER_METADATA, payload: { metadata } });
};

