import {ADD_NEW_MESSAGE} from '../actionTypes'

export const sendMessage = (text) => async (dispatch, getState) => {
    const connections = Object.values(getState().connections.data);
    const localPeer = getState().localUser.peer;

    connections.forEach(connection => connection.send({textMessage: {
        text: text,
        peerId: localPeer.id
    }}));

    dispatch({
        type: ADD_NEW_MESSAGE,
        payload: {
            text: text,
            peerId: localPeer.id
        }
    });
}

