import {ADD_CONNECTION, ADD_NEW_MESSAGE, ADD_PEER, REMOVE_CONNECTION, SET_CURRENT_ROOM} from '../actionTypes';
import {addStream, removeStream} from './remoteStreams.actions';
import {setCurrentRoomError} from './room.actions';
import {startLocalStream} from './localStream.actions';

export const addConnection = (connection) => async (dispatch, getState) => {
  if (connection && connection.socketId) {
    console.log('addConnection', connection);
    await dispatch({ type: ADD_CONNECTION, payload: { connection } });
    await dispatch(initConnectionListeners(connection));
  }
};

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
    dataChannel.onmessage = evt => {
      console.log('received message: ', evt);
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
      console.log('datachannel open', dataChannel);
    };

    dataChannel.onclose = () => {
      console.log('datachannel close');
    };
  }
};

export const initConnectionListeners = connection => (dispatch, getState) => {
  if (connection && connection.socketId) {
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
        socket.emit('signaling', { receiverSocketId: connection.remoteSocketId, iceCandidates: iceCandidates });
        iceCandidates = [];
      }

      if (currentIteration <= maxIterations) {
        const rawDelay = baseDelay * Math.pow(delayMultiplier, currentIteration);
        const roundedDelay = Math.round(rawDelay / 100 * 2) * 100 / 2;

        console.log('TIMER DELAY', roundedDelay);
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
      if (streams[0]) {
        dispatch(addStream(connection.remoteSocketId, streams[0]));
      } else {
        console.error('ontrack - this should not happen... streams[0] is empty!');
      }
    };

    connection.onnegotiationneeded = async evt => {
      if (connection.signalingState !== 'stable') return;

      try {
        connection.makingOffer = true;
        await connection.setLocalDescription(); // newer syntax that implicitly knows whether to create offer or answer

        const { socket } = getState().localUser;
        socket.emit('signaling', { receiverSocketId: connection.remoteSocketId, description: connection.localDescription });
      } catch (err) {
        console.error(err);
      } finally {
        connection.makingOffer = false;
      }
    };

    connection.oniceconnectionstatechange = () => {
      if (connection.iceConnectionState === 'failed') {
        connection.restartIce();
      }
    };

    connection.onsignalingstatechange = evt => {
      if (connection.signalingState && connection.localDescription && connection.remoteDescription) {
        console.log('CONNECTION ESTABLISHED!!');
      }
    };

    connection.ondatachannel = async evt => {
      console.log('ondatachannel', evt);
      connection.defaultDataChannel = evt.channel;
      await dispatch(initDataChannelListeners(connection.defaultDataChannel));
      dispatch(introduceYourself(connection.defaultDataChannel));

    };

    connection.onmessage = evt => {
      console.log('---------connection.onmessage', evt);
      // Now handled by dataChannels without wrapper of peerjs
    };
  }
};

export const connectWithPeer = remoteSocketId => async (dispatch, getState) => {
  const { socket } = getState().localUser;

  if (remoteSocketId !== socket.id) {
    const existingConnection = getState().connections.data[remoteSocketId];
    return existingConnection ? existingConnection : dispatch(initNewRTCPeerConnection(remoteSocketId));
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
  const { socket } = getState().localUser;

  const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    iceCandidatePoolSize: 1
  };

  const newConnection = new RTCPeerConnection(configuration);
  newConnection.socketId = socket.id;
  newConnection.remoteSocketId = remoteSocketId;

  newConnection.defaultDataChannel = newConnection.createDataChannel('default');
  dispatch(initDataChannelListeners(newConnection.defaultDataChannel));

  const localStreamWrapper = await getState().localUser.mediaStream;
  if (localStreamWrapper) {
    localStreamWrapper.stream.getTracks().forEach(track => newConnection.addTrack(track, localStreamWrapper.stream));
  }

  await dispatch(addConnection(newConnection));
  return newConnection;
};

export const updateStreamForConnections = (newStream) => async (dispatch, getState) => {
  const connections = Object.values(getState().connections.data);

  connections.forEach(connection => {
    const senders = connection.getSenders();
    senders.forEach((sender) => connection.removeTrack(sender));

    if (newStream) {
      newStream.getTracks().forEach(track => connection.addTrack(track, newStream));
    }
  });
};
