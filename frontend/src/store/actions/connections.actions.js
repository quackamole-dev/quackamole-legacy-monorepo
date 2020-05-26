import {ADD_CONNECTION, REMOVE_CALL, REMOVE_CONNECTION, REMOVE_STREAM, ADD_NEW_MESSAGE} from "../actionTypes";
import {callConnection} from "./calls.actions";

export const addConnection = connection => (dispatch, getState) => {
    if (connection && connection.peer) {
        dispatch({type: ADD_CONNECTION, payload: {connection}});
        dispatch(initConnectionListeners(connection));
    }
};

export const removeConnection = connection => (dispatch, getState) => {
    if (connection && connection.peer) {
        dispatch({type: REMOVE_CONNECTION, payload: {connection}});
    }
};

export const initConnectionListeners = connection => (dispatch, getState) => {
    if (connection && connection.connectionId) {
        connection.on('data', data => {
            // TODO only do dispatches here. Let the logic be inside separate actions.
            //  data object could be an action itself --> {type: SOME_ACTION, payload: 'whatever'} or even a thunk
            console.log(data, 'data');
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
            (data) => {
                if (data) {
                    data.room.joinedUsers.forEach((remotePeerId) => dispatch(connectWithPeer(remotePeerId)));
                }
            });
    }
};
