import {ADD_CONNECTION, REMOVE_CONNECTION} from "../actionTypes";

export const addConnection = connection => (dispatch, getState) => {
    if (connection.peer && connection.connectionId) {
        dispatch({
            type: ADD_CONNECTION,
            payload: {connection}
        });

        dispatch(initConnectionListeners(connection));
    }
};

export const removeConnection = connection => (dispatch, getState) => {
    if (connection.connectionId) {
        dispatch({
            type: REMOVE_CONNECTION,
            payload: {connection}
        });
    }
};


export const initConnectionListeners = connection => (dispatch, getState) => {
    if (connection && connection.connectionId) {
        connection.on('data', data => {
            const parsedData = JSON.parse(data);
            if (parsedData.textMessage) {
                console.log( `%c MESSAGE - ${parsedData.textMessage.author}: "${parsedData.textMessage.text}"`, 'background: black; color: white; padding: 1rem');
            }

            // TODO this is where we could receive plugin data of other peers. Example: coords where they placed something in a game.
            if (parsedData.pluginData) {
                console.log('received plugin data:', parsedData);
            }
        });

        connection.on('close', () => {
            dispatch(removeConnection(connection));
        });
    }
};


export const joinRoom = (roomId, password) => (dispatch, getState) => {
    const {socket, peer} = getState().localUser;

    if (socket && peer) {
        socket.emit('join', {roomId, password, peerId: peer.id},
            // callback: the joining user himself is responsible to establish connections with other users
            (data) => {
                if (data) {
                    console.log('joined room', data);
                    data.room.joinedUsers.forEach((remotePeerId) => {
                        if (remotePeerId !== peer.id) {
                            const connection = peer.connect(remotePeerId, { metadata: { nickname: 'test-metadata'}});
                            dispatch(addConnection(connection));
                        }
                    });
                }
            });
    }
};
