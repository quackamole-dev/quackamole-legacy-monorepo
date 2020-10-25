import {INIT_LOCAL_USER_SOCKET, RESET_LOCAL_USER, SET_LOCAL_USER_LOADING, SET_LOCAL_USER_METADATA} from '../actionTypes';
import io from 'socket.io-client';
import {getPersistedData, persistData, serializeQueryString} from '../../utils';
import {addConnection, initNewRTCPeerConnection, removeConnection} from './connections.actions';
import {setCurrentRoomError} from './room.actions';
import {BACKEND_URL} from '../../constants';
import {addStream} from './remoteStreams.actions';

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
      console.log('---on signaling description type =', description ? description.type : '-');
      // For reference: https://w3c.github.io/webrtc-pc/#perfect-negotiation-example
      try {
        let connection = getState().connections.data[senderSocketId];
        let wasNew = false;
        if (!connection) {
          wasNew = true;
          console.log('very first offer received. Connection does not exist yet! creating one -  I am the polite peer');
          // If connection does not already exists, the senderSocketId was sending the very first offer
          connection = await (dispatch(initNewRTCPeerConnection(senderSocketId)));
          connection.polite = true; // the peer receiving very first offer is initially the polite one
          connection.makingOffer = false;
          connection.ignoringOffer = false;
          connection.isSettingRemoteAnswerPending = false;

          // FIXME temp
          // await dispatch(addConnection(connection)); // NOTE cannote be done before setting remote description, but if not done now the receiving peer doesnt get stream. If done now the receiving peers onnegotiationneeded event gets fired errorously

          connection.ontrack = ({ track, streams }) => {
            console.log('ontrack - remote stream track received');
            if (streams && streams[0]) {
              console.log('ontrack - adding remote stream track');
              dispatch(addStream(connection.remoteSocketId, streams[0]));
            } else {
              console.error('ontrack - this should not happen... streams[0] is empty!');
            }
          };
        }

        if (description) {
          // const readyForOffer = !connection.makingOffer && (connection.signalingState === 'stable' || connection.isSettingRemoteAnswerPending);
          const offerCollision = description.type === 'offer' && (connection.makingOffer || connection.signalingState !== 'stable');

          // While impolite peer is making an offer he will ignore incoming offers
          connection.ignoreOffer = !connection.polite && offerCollision;
          if (connection.ignoreOffer) {
            console.log('I am impolite and will IGNORE the offer from socketID', connection.remoteSocketId);
            return;
          }

          // connection.isSettingRemoteAnswerPending = description.type === 'answer';
          await connection.setRemoteDescription(new RTCSessionDescription(description)); // with implicit rollback
          if (wasNew) {
            console.log('WASNEW - adding connection');
            await dispatch(addConnection(connection));
          }
          // connection.isSettingRemoteAnswerPending = false;

          if (description.type === 'offer') {
            console.log('I received an offer and will create an answer');
            const answer = await connection.createAnswer();
            await connection.setLocalDescription(answer);
            socket.emit('signaling', { receiverSocketId: connection.remoteSocketId, description: connection.localDescription });
          }
        } else if (iceCandidates) {
          try {
            console.log('--receiving ice candidates', iceCandidates.length, 'x');
            for (const candidate of iceCandidates) {
              // await connection.addIceCandidate(new RTCIceCandidate(candidate));
              await connection.addIceCandidate(candidate);
            }
          } catch (err) {
            if (!connection.ignoreOffer) {
              throw err;
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

