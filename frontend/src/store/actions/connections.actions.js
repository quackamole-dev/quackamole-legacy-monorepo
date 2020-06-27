import {ADD_CONNECTION, REMOVE_CONNECTION, ADD_NEW_MESSAGE, ADD_PEER, SET_CURRENT_ROOM} from "../actionTypes";
import {callConnection, removeCall} from "./calls.actions";
import {removeStream, startLocalStream} from "./streams.actions";
import {setCurrentRoomError} from "./room.actions";

export const addConnection = connection => async (dispatch, getState) => {
    if (connection && connection.peer) {
        await dispatch({type: ADD_CONNECTION, payload: {connection}});
        await dispatch(initConnectionListeners(connection));
    }
};

export const removeConnection = connection => async (dispatch, getState) => {
    if (connection && connection.peer) {

        const stream = getState().streams.data[connection.peer];
        if (stream) {
            await dispatch(removeStream(connection.peer));
        }

        const call = getState().calls.data[connection.peer];
        if (call) {
            await dispatch(removeCall(call));
        }

        await dispatch({type: REMOVE_CONNECTION, payload: {connection}});
    }
};

export const initConnectionListeners = connection => (dispatch, getState) => {
    if (connection && connection.connectionId) {
        connection.on('open', () => {
            setTimeout(() => dispatch(introduceYourself(connection), 500)); // TODO temporary delay for experimentation
        });

        connection.on('data', data => {
            console.log('on connection data', data);
            const type = data.type;

            if (data.textMessage) {
                dispatch({type: ADD_NEW_MESSAGE, payload: data.textMessage});
                console.log(`%c MESSAGE - ${data.textMessage.peerId}: "${data.textMessage.text}"`, 'background: black; color: white; padding: 1rem');
            }

            if (type === 'PLUGIN_DATA') {
                window.postMessage(data.payload, '*');
                const iframe = getState().plugin.iframe;
                if (iframe) {
                    iframe.contentWindow.postMessage(data, "*");
                }
            }

            if (type === 'PEER_INTRODUCTION') {
                console.log('Connected peer is introducing himself to you:', data.payload);
                const remoteMetadata = data.payload.metadata;
                dispatch({type: ADD_PEER, payload: {metadata: remoteMetadata, peerId: connection.peer}});
            }
        });

        connection.on('close', () => {
            dispatch(removeConnection(connection));
        });
    }
};

export const connectWithPeer = remotePeerId => async (dispatch, getState) => {
    const {peer} = getState().localUser;

    if (remotePeerId !== peer.id) {
        const connection = await peer.connect(remotePeerId);
        await dispatch(addConnection(connection));
        await dispatch(callConnection(connection));
    }
};

export const sendDataToConnection = (connection, data) => async (dispatch, getState) => {
    if (connection) {
        connection.send(data);
    }
};

export const joinRoom = (roomId, password) => async (dispatch, getState) => { // TODO move to room actions
    const {socket, peer} = getState().localUser;

    if (socket && peer) {
        socket.emit('join', {roomId, password, peerId: peer.id},
            // callback: the joining user himself is responsible to establish connections with other users
            async (err, data) => {
                if (!err) {
                    await dispatch(startLocalStream(peer));
                    await dispatch({type: SET_CURRENT_ROOM, payload: {room: data.room}});
                    data.room.joinedUsers.forEach((remotePeerId) => dispatch(connectWithPeer(remotePeerId)));
                } else {
                    dispatch(setCurrentRoomError(err));
                }
            });
    }
};

export const introduceYourself = (connection) => async (dispatch, getState) => {
    const metadata = getState().localUser.metadata;

    if (metadata) {
        dispatch(sendDataToConnection(connection, {type: 'PEER_INTRODUCTION', payload: {metadata}}));
    }
};
