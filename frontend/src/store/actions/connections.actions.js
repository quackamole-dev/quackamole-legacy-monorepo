import {ADD_CONNECTION, REMOVE_CONNECTION, ADD_NEW_MESSAGE, ADD_PEER, SET_CURRENT_ROOM_ERROR, SET_CURRENT_ROOM} from "../actionTypes";
import {callConnection, removeCall} from "./calls.actions";
import {removeStream} from "./streams.actions";

export const addConnection = connection => (dispatch, getState) => {
    if (connection && connection.peer) {
        dispatch({type: ADD_CONNECTION, payload: {connection}});
        dispatch(initConnectionListeners(connection));
    }
};

export const removeConnection = connection => (dispatch, getState) => {
    if (connection && connection.peer) {

        const stream = getState().streams.data[connection.peer];
        if (stream) {
            dispatch(removeStream(connection.peer));
        }

        const call = getState().calls.data[connection.peer];
        if (call) {
            dispatch(removeCall(call));
        }

        dispatch({type: REMOVE_CONNECTION, payload: {connection}});
    }
};

export const initConnectionListeners = connection => (dispatch, getState) => {
    if (connection && connection.connectionId) {
        connection.on('open', () => {
            dispatch(introduceYourself(connection));
        });

        connection.on('data', data => {
            // TODO only do dispatches here. Let the logic be inside separate actions.
            //  data object could be an action itself --> {type: SOME_ACTION, payload: 'whatever'} or even a thunk
            console.log('connection on data', data);
            if (data.textMessage) {
                dispatch({
                    type: ADD_NEW_MESSAGE,
                    payload: data.textMessage
                });
                console.log(`%c MESSAGE - ${data.textMessage.peerId}: "${data.textMessage.text}"`, 'background: black; color: white; padding: 1rem');
            }

            const type = data.type;
            if (type === 'pluginData') {
                console.log('received plugin data:', data.payload);
                window.postMessage(data, '*');

                const iframe = getState().plugin.iframe;
                if (iframe) {
                    iframe.contentWindow.postMessage(data, "*");
                }
            }

            if (type === 'peerIntroduction') {
                console.log('Connected peer is introducing himself to you:', data.payload);
                const remoteMetadata = data.payload.metadata;
                dispatch({type: ADD_PEER, payload: {metadata: remoteMetadata, peerId: connection.peer}});
                // dispatch(introduceYourself(connection));
            }
        });

        connection.on('close', () => {
            dispatch(removeConnection(connection));
        });
    }
};

export const connectWithPeer = remotePeerId => (dispatch, getState) => {
    const {peer} = getState().localUser;

    if (remotePeerId !== peer.id) {
        const connection = peer.connect(remotePeerId, {metadata: {nickname: 'test-metadata'}});
        dispatch(addConnection(connection));
        dispatch(callConnection(connection));
    }
};

export const joinRoom = (roomId, password) => async (dispatch, getState) => {
    const {socket, peer} = getState().localUser;

    if (socket && peer) {
        socket.emit('join', {roomId, password, peerId: peer.id},
            // callback: the joining user himself is responsible to establish connections with other users
            (err, data) => {
                if (!err) {
                    dispatch({type: SET_CURRENT_ROOM, payload: {room: data.room}});
                    data.room.joinedUsers.forEach((remotePeerId) => dispatch(connectWithPeer(remotePeerId)));
                } else {
                    console.log('room error', err);
                    dispatch({type: SET_CURRENT_ROOM_ERROR, payload: {error: err}});
                }
            });
    }
};

export const introduceYourself = (connection) => async (dispatch, getState) => {
    const metadata = getState().localUser.metadata;

    if (metadata) {
        connection.send({type: 'peerIntroduction', payload: {metadata}})
    }
};
