import {INIT_LOCAL_USER_PEER, INIT_LOCAL_USER_SOCKET} from "../actionTypes";
import Peer from "peerjs";
import {API_BASE_URL, PORT_SIGNALING, PORT_SOCKET, SSL_ENABLED} from "../../constants";
import io from "socket.io-client";
import {serializeQueryString} from "../../utils";

export const initLocalUserPeer = (customPeerId) => async (dispatch, getState) => {
    const peer = await new Peer(customPeerId, {
        host: API_BASE_URL,
        port: PORT_SIGNALING,
        path: '/peer/signal',
        // debug: 3,
        config: {iceServers: [{url: 'stun:stun.l.google.com:19302'}]}
    });

    dispatch({
        type: INIT_LOCAL_USER_PEER,
        payload: {peer}
    })
};

export const initLocalUserSocket = (queryParams) => async (dispatch, getState) => {
    const protocol = SSL_ENABLED ? 'https' : 'http';
    const socket = io(`${protocol}://${API_BASE_URL}:${PORT_SOCKET}`, {
        // transports: ['websocket'],
        secure: SSL_ENABLED,
        query: serializeQueryString(queryParams)
    });

    socket.on('ready', (socketId) => {
        return dispatch({
            type: INIT_LOCAL_USER_SOCKET,
            payload: {socket}
        })
    });
};
