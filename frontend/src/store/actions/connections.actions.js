import {ADD_CONNECTION, REMOVE_CALL, REMOVE_CONNECTION, REMOVE_STREAM} from "../actionTypes";
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
            const type = data.type;
            if (type === 'message') {
                console.log( `%c MESSAGE - ${data.textMessage.author}: "${data.textMessage.text}"`, 'background: black; color: white; padding: 1rem');
            }

            // TODO this is where we could receive plugin data of other peers. Example: coords where they placed something in a game.
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
