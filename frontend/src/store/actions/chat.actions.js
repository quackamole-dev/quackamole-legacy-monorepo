import {ADD_NEW_MESSAGE} from '../actionTypes';
import {sendDataToConnection} from './connections.actions';

export const sendMessage = (text) => async (dispatch, getState) => {
    const connections = Object.values(getState().connections.data);
    const socket = getState().localUser.socket;

    if (socket) {
        connections.forEach(connection => {
            // FIXME change to use separate data channel only for chat instead of identifying it by type or specific properties
            const message = {
                textMessage: { text: text, authorSocketId: socket.id }
            };

            dispatch(sendDataToConnection(connection.defaultDataChannel, message));
        });

        dispatch({
            type: ADD_NEW_MESSAGE,
            payload: {text: text, authorSocketId: socket.id}
        });
    } else {
        console.error('socket not found');
    }
};
