import {ADD_CONNECTION, ADD_NEW_MESSAGE, ADD_PEER, REMOVE_CONNECTION, SET_CURRENT_ROOM} from '../actionTypes';
import {addStream, removeStream} from './remoteStreams.actions';
import {setCurrentRoomError} from './room.actions';
import {startLocalStream} from './localStream.actions';

// export const addConnection = (connection) => async (dispatch, getState) => {
//   if (connection && connection.socketId) {
//     console.log('addConnection', connection);
//     await dispatch({ type: ADD_CONNECTION, payload: { connection } });
//     await dispatch(initConnectionListeners(connection));
//   }
// };

export const removeConnection = connection => async (dispatch, getState) => {
  if (connection && connection.remoteSocketId && connection.socketId) {

    const stream = getState().remoteStreams.data[connection.remoteSocketId];
    if (stream) {
      await dispatch(removeStream(connection.remoteSocketId));
    }

    connection.close();
    await dispatch({ type: REMOVE_CONNECTION, payload: { connection } });
  }
};

export const initDataChannelListeners = dataChannel => (dispatch, getState) => {
  if (dataChannel) {
    console.log(`Initializing data channel listeners...`);
    dataChannel.onmessage = evt => {
      const data = JSON.parse(evt.data);
      const type = data.type;

      if (data.textMessage) {
        dispatch({ type: ADD_NEW_MESSAGE, payload: data.textMessage });

        const metadata = getState().localUser.metadata;
        console.log(
          `%c MESSAGE - ${metadata.nickname || data.textMessage.authorSocketId}: "${data.textMessage.text}"`,
          'background: black; color: white; padding: 1rem; border: 1px solid white; border-radius: 5px;'
        );
      }

      if (type === 'PLUGIN_DATA') {
        window.postMessage(data.payload, '*');
        const iframe = getState().plugin.iframe;
        if (iframe) {
          iframe.contentWindow.postMessage(data, '*');
        }
      }

      if (type === 'PEER_INTRODUCTION') {
        console.log('Connected peer is introducing himself to you:', data.payload);
        const { senderSocketId, metadata } = data.payload;
        dispatch({ type: ADD_PEER, payload: { metadata: metadata, socketId: senderSocketId } });
      }
    };

    dataChannel.onopen = () => {
      console.log('datachannel open...');
    };

    dataChannel.onclose = () => {
      console.log('datachannel close');
    };
  }
};

export const initConnectionListeners = connection => (dispatch, getState) => {
  if (connection && connection.socketId) {
    console.log(`Initializing RTCPeerConnection listeners...`);
    const delayMultiplier = 1.5;
    const baseDelay = 450;
    const maxIterations = 9;
    let currentIteration = 0;
    let iceCandidates = [];

    // emits ice-candidates with an increasing delay until the onicecandidate null event
    // Most of the candidates trickle in within the first 0-2seconds but the null event can happen much later
    // The goal is to send ice-candidates out quickly with the least amount of signaling until the null event
    // High likelihood to be changed/simplified as time goes by...
    const timer = () => {
      if (iceCandidates.length) {
        const { socket } = getState().localUser;
        console.log(`Sending ${iceCandidates.length}x ICE CANDIDATES to peer...`);
        socket.emit('signaling', { receiverSocketId: connection.remoteSocketId, iceCandidates: iceCandidates });
        iceCandidates = [];
      }

      if (currentIteration <= maxIterations) {
        const rawDelay = baseDelay * Math.pow(delayMultiplier, currentIteration);
        const roundedDelay = Math.round(rawDelay / 100 * 2) * 100 / 2;

        // console.log('TIMER DELAY', roundedDelay);
        setTimeout(timer, Math.round(roundedDelay));
        currentIteration++;
      }
    };
    timer();

    connection.onicecandidate = (evt) => {

      const iceCandidate = evt.candidate;
      if (iceCandidate) {
        iceCandidates.push(iceCandidate);
      } else {
        console.log('no more ICE');
        currentIteration = maxIterations + 1;
        timer();
      }
    };

    connection.ontrack = ({ track, streams }) => {
      if (streams && streams[0]) {
        console.log(`A remote stream track was received from ${connection.remoteSocketId}...`);
        dispatch(addStream(connection.remoteSocketId, streams[0]));
      } else {
        console.error('ontrack - this should not happen... streams[0] is empty!');
      }
    };

    connection.onnegotiationneeded = async evt => {
      // if (connection.called) {
      //   console.log('(negotiation needed ignored because I am the called...)')
      //   return;
      // }
      // console.log('You need to send an offer to the remote peer', connection.connectionState);
      // const offer = await connection.createOffer();
      // connection.setLocalDescription(offer);
      //
      // const { socket } = getState().localUser;
      // console.log('Sending offer to remote peer...');
      // socket.emit('signaling', { receiverSocketId: connection.remoteSocketId, description: connection.localDescription });

      // try {
      //   connection.makingOffer = true;
      //   const offer = await connection.createOffer();
      //   if (connection.signalingState !== 'stable') return;
      //   console.trace('creating offer implicitly');
      //   // console.trace('Why am I "onnegotiationneeded" fired?');
      //   await connection.setLocalDescription(offer); // newer syntax that implicitly knows whether to create offer or answer
      //
      //   const { socket } = getState().localUser;
      //   socket.emit('signaling', { receiverSocketId: connection.remoteSocketId, description: connection.localDescription });
      // } catch (err) {
      //   console.error(err);
      // } finally {
      //   connection.makingOffer = false;
      // }
    };

    connection.oniceconnectionstatechange = () => {
      if (connection.iceConnectionState === 'failed') {
        console.error('oniceconnectionstatechange - restarting ICE');
        connection.restartIce();
      }
    };

    connection.onsignalingstatechange = evt => {
      if (connection.signalingState === 'stable' && connection.localDescription && connection.remoteDescription) {
        console.log('CONNECTION ESTABLISHED!! signaling state:', connection.signalingState);
      }
    };

    connection.ondatachannel = async evt => {
      console.log('Remote peer opened a data channel with you...');
      connection.defaultDataChannel = evt.channel;
      await dispatch(initDataChannelListeners(connection.defaultDataChannel));
      dispatch(introduceYourself(connection.defaultDataChannel));
    };
  }
};

/**
 * Establishes the initial connection between two peers.
 * @param remoteSocketId - The socketId of the peer you want to connect with
 */
export const connectWithPeer = remoteSocketId => async (dispatch, getState) => {
  const { socket } = getState().localUser;
  if (remoteSocketId === socket.id) return;

  const existingConnection = getState().connections.data[remoteSocketId];

  if (existingConnection) {
    console.error(`You already established a connection with ${remoteSocketId}`);
  } else {
    console.log(`Preparing to connect with "${remoteSocketId}" ...`);
    const newConnection = await dispatch(initNewRTCPeerConnection(remoteSocketId));

    await dispatch(sendNewOfferToConnection(newConnection));
    // const offer = await newConnection.createOffer();
    // await newConnection.setLocalDescription(offer);
    // console.log('Sending initial offer to remote peer...');
    // socket.emit('signaling', { receiverSocketId: newConnection.remoteSocketId, description: newConnection.localDescription });

    return newConnection;
  }
};

export const sendDataToConnection = (dataChannel, data) => async (dispatch, getState) => {
  if (dataChannel) {
    const serializedData = JSON.stringify(data);
    dataChannel.send(serializedData);
  }
};

export const joinRoom = (roomId, password) => async (dispatch, getState) => { // TODO move to room actions
  const { socket } = getState().localUser;

  if (socket) {
    socket.emit('join', { roomId, password, socketId: socket.id },
      // callback: the joining user himself is responsible to establish connections with other users
      async (err, data) => {
        if (!err) {
          await dispatch(startLocalStream());
          await dispatch({ type: SET_CURRENT_ROOM, payload: { room: data.room } });
          data.room.joinedUsers.forEach((remoteSocketId) => dispatch(connectWithPeer(remoteSocketId)));
          console.log(`There are ${data.room.joinedUsers.length}x joinedUsers`);
        } else {
          dispatch(setCurrentRoomError(err));
        }
      });
  }
};

export const introduceYourself = (dataChannel) => async (dispatch, getState) => {
  const { socket, metadata } = getState().localUser;

  if (socket && metadata) {
    dispatch(sendDataToConnection(dataChannel, { type: 'PEER_INTRODUCTION', payload: { senderSocketId: socket.id, metadata: metadata } }));
  } else {
    console.error('socket and/or metadata not available!');
  }
};

export const initNewRTCPeerConnection = (remoteSocketId) => async (dispatch, getState) => {
  console.log(`Creating new RTCPeerConnection with "${remoteSocketId}" ...`);
  const { socket } = getState().localUser;

  const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    iceCandidatePoolSize: 1
  };

  const newConnection = new RTCPeerConnection(configuration);
  newConnection.socketId = socket.id;
  newConnection.remoteSocketId = remoteSocketId;
  newConnection.defaultDataChannel = newConnection.createDataChannel('default');

  await dispatch(initDataChannelListeners(newConnection.defaultDataChannel));
  await dispatch(initConnectionListeners(newConnection));

  const localStreamWrapper = await getState().localUser.mediaStream;
  if (localStreamWrapper) {
    const tracks = localStreamWrapper.stream.getTracks();
    console.log(`Adding ${tracks.length}x stream tracks to the new RTCPeerConnection with "${remoteSocketId}"...`);
    for (const track of tracks) {
      await newConnection.addTrack(track, localStreamWrapper.stream);
    }
  }

  await dispatch({ type: ADD_CONNECTION, payload: { connection: newConnection } });
  return newConnection;
};

export const updateStreamForConnections = (newStream) => async (dispatch, getState) => {
  const connections = Object.values(getState().connections.data);

  for (const connection of connections) {
    console.log(`Updating localStream for RTCPeerConnection with "${connection.remoteSocketId}"...`);

    for (const sender of connection.getSenders()) {
      await connection.removeTrack(sender);
    }

    if (newStream) {
      for (const track of newStream.getTracks()) {
        await connection.addTrack(track, newStream);
      }
    }

    dispatch(sendNewOfferToConnection(connection));
  }
};

// // TODO move to util
// export const addLocalStreamTracksToConnection = (connection) => async (dispatch, getState) => {
//   const localStreamWrapper = getState().localUser.mediaStream;
//
//   if (localStreamWrapper) {
//     console.log(`LocalStream is active, adding tracks to RTCPeerConnection with "${connection.remoteSocketId}"...`);
//     const localStream = localStreamWrapper.stream;
//     for (const sender of connection.getSenders()) {
//       await connection.removeTrack(sender);
//     }
//
//     if (localStream) {
//       for (const track of localStream.getTracks()) {
//         await connection.addTrack(track, localStream);
//       }
//     }
//   } else {
//     console.log(`No LocalStream active...`);
//   }
// };

export const sendNewOfferToConnection = (connection) => async (dispatch, getState) => {
  const socket = getState().localUser.socket;
  const offer = await connection.createOffer();
  await connection.setLocalDescription(offer);
  console.log('Sending offer to remote peer...');
  socket.emit('signaling', { receiverSocketId: connection.remoteSocketId, description: connection.localDescription });
};
