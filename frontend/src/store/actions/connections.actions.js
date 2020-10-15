import {ADD_CONNECTION, REMOVE_CONNECTION, ADD_NEW_MESSAGE, SET_CURRENT_ROOM, ADD_PEER} from '../actionTypes';
import {addStream, removeStream, startLocalStream} from './streams.actions';
import {setCurrentRoomError} from './room.actions';

export const addConnection = (connection) => async (dispatch, getState) => {
    if (connection && connection.socketId) {
        console.log('addConnection', connection);
        await dispatch({type: ADD_CONNECTION, payload: {connection}});
        await dispatch(initConnectionListeners(connection));
    }
};

export const removeConnection = connection => async (dispatch, getState) => {
    if (connection && connection.remoteSocketId && connection.socketId) {

        const stream = getState().streams.data[connection.remoteSocketId];
        if (stream) {
            await dispatch(removeStream(connection.remoteSocketId));
        }

        await dispatch({type: REMOVE_CONNECTION, payload: {connection}});
    }
};

export const initDataChannelListeners = dataChannel => (dispatch, getState) => {
        console.log('initDataChannelListeners', dataChannel);
    if (dataChannel) {
        dataChannel.onmessage = evt => {
            console.log('received message: ', evt);
            const data = JSON.parse(evt.data);
            const type = data.type;

            if (data.textMessage) {
                dispatch({type: ADD_NEW_MESSAGE, payload: data.textMessage});

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
                const {senderSocketId, metadata} = data.payload;
                dispatch({type: ADD_PEER, payload: {metadata: metadata, socketId: senderSocketId}});
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
        connection.onicecandidate = (evt) => {
            const iceCandidate = evt.candidate;

            if (iceCandidate) {
                const {socket} = getState().localUser;
                socket.emit('ice-candidate', {
                    senderSocketId: socket.id,
                    receiverSocketId: connection.remoteSocketId,
                    iceCandidate: iceCandidate
                });
            } else {
                console.log('no more ICE');
            }
        }

        connection.onaddstream = evt => {
            dispatch(addStream(connection.remoteSocketId, evt.stream));
        };

        connection.onsignalingstatechange = evt => {
            if (connection.signalingState && connection.localDescription && connection.remoteDescription) {
                console.log('CONNECTION ESTABLISHED!!');
            }
        };

        connection.ondatachannel = async evt => {
            console.log('ondatachannel', evt);
            connection.defaultDataChannel = evt.channel; // FIXME temporary. create wrapper for RTCPeerConnection
            await dispatch(initDataChannelListeners(connection.defaultDataChannel));
            // setTimeout(() => dispatch(introduceYourself(connection.defaultDataChannel), 500)); // TODO temporary delay for experimentation
            dispatch(introduceYourself(connection.defaultDataChannel)); // FIXME test whether it works without timeout now

        }

        connection.onmessage = evt => {
            console.log('---------connection.onmessage', evt);
            // Now handled by dataChannels without wrapper of peerjs
        };
    }
};

export const connectWithPeer = remoteSocketId => async (dispatch, getState) => {
    const {socket} = getState().localUser;

    if (remoteSocketId !== socket.id) {
        console.log('----- connectWithPeer() action, remoteSocketId', remoteSocketId, 'socket.id', socket.id, socket.id === remoteSocketId);
        const connection = new RTCPeerConnection(); // TODO check first if one already exists
        connection.socketId = socket.id;
        connection.remoteSocketId = remoteSocketId;

        connection.defaultDataChannel = connection.createDataChannel('default'); // FIXME temporary. create wrapper for RTCPeerConnection
        console.log('--defaultDataChannel created', connection.defaultDataChannel);
        await dispatch(initDataChannelListeners(connection.defaultDataChannel));

        const localStream = await getState().streams.data[socket.id] || dispatch(startLocalStream());
        connection.addStream(localStream); // addStream needs to be called BEFORE attempting to create offer/answer
        await dispatch(addConnection(connection));

        const offer = await connection.createOffer();
        console.log('offer created', offer);
        await connection.setLocalDescription(offer);
        socket.emit('offer', {receiverSocketId: remoteSocketId, offer: offer});
    }
};

export const sendDataToConnection = (dataChannel, data) => async (dispatch, getState) => {
    if (dataChannel) {
        const serializedData = JSON.stringify(data);
        dataChannel.send(serializedData);
    }
};

export const joinRoom = (roomId, password) => async (dispatch, getState) => { // TODO move to room actions
    const {socket} = getState().localUser;

    if (socket) {
        socket.emit('join', {roomId, password, peerId: socket.id},
            // callback: the joining user himself is responsible to establish connections with other users
            async (err, data) => {
                if (!err) {
                    await dispatch(startLocalStream(socket));
                    await dispatch({type: SET_CURRENT_ROOM, payload: {room: data.room}});
                    data.room.joinedUsers.forEach((remotePeerId) => dispatch(connectWithPeer(remotePeerId)));
                    console.log(`There are ${data.room.joinedUsers.length}x joinedUsers`);
                } else {
                    dispatch(setCurrentRoomError(err));
                }
            });
    }
};

export const introduceYourself = (dataChannel) => async (dispatch, getState) => {
    const {socket, metadata} = getState().localUser;

    if (socket && metadata) {
        dispatch(sendDataToConnection(dataChannel, {type: 'PEER_INTRODUCTION', payload: {senderSocketId: socket.id, metadata: metadata}}));
    } else {
        console.error('socket and/or metadata not available!');
    }
};
