import {INIT_LOCAL_USER_PEER, INIT_LOCAL_USER_SOCKET, RESET_LOCAL_USER, SET_LOCAL_USER_LOADING, SET_LOCAL_USER_METADATA} from '../actionTypes';
import Peer from "peerjs";
import {API_BASE_URL, PORT_SIGNALING, PORT_SOCKET, SSL_ENABLED} from "../../constants";
import io from "socket.io-client";
import {getPersistedData, persistData, serializeQueryString} from '../../utils';
import {addConnection, removeConnection} from "./connections.actions";
import {addCall} from "./calls.actions";
import {startLocalStream} from "./streams.actions";
import {setCurrentRoomError} from './room.actions';

export const resetLocalUser = () => ({type: RESET_LOCAL_USER});

/**
 * Init the socket.io client. Once socket is ready, init the peerJS Peer and store them in the store.
 */
export const initLocalUser = () => async (dispatch, getState) => {
    const metadata = getPersistedData('metadata');

    if (!getState().localUser.loading) {
        if (!metadata.nickname || !metadata.nickname.length) {
            dispatch(setCurrentRoomError({error: {name: 'RoomError', message: 'Please enter a nickname before joining the room.'}}));
        } else {
            dispatch(initLocalUserSocket(metadata));
        }
    }
};

const initLocalUserSocket = (metadata) => async (dispatch, getState) => {
    dispatch({type: SET_LOCAL_USER_LOADING, payload: {loading: true}});
    const protocol = SSL_ENABLED ? 'https' : 'http';
    const socket = io(`${protocol}://${API_BASE_URL}:${PORT_SOCKET}`, {
        transports: ['websocket'],
        secure: SSL_ENABLED,
        query: serializeQueryString(metadata)
    });

    dispatch(initLocalUserSocketListeners(socket));
}

const initLocalUserSocketListeners = (socket) => async (dispatch, getState) => {
    socket.on('ready', (socketId) => {
        dispatch({type: INIT_LOCAL_USER_SOCKET, payload: {socket}});
        dispatch(initLocalUserPeer(socketId));
    });

    socket.on('user-leave', (socketId) => {
        const connection = getState().connections.data[socketId];
        if (connection) {
            dispatch(removeConnection(connection));
        }
    });
}

const initLocalUserPeer = (customPeerId) => async (dispatch, getState) => {
    // FIXME peer init can fail when socket.id start with an underscore. Rarely happens though, allow peerId to be different from socketId
    const peer = await new Peer(customPeerId, {
        host: API_BASE_URL,
        port: PORT_SIGNALING,
        path: '/peer/signal',
        // debug: 3,
        config: {iceServers: [{url: 'stun:stun.l.google.com:19302'}]}
    });
    await dispatch({type: INIT_LOCAL_USER_PEER, payload: {peer}});
    await dispatch(initLocalUserPeerListeners(peer));
    dispatch({type: SET_LOCAL_USER_LOADING, payload: {loading: false}});
};

const initLocalUserPeerListeners = (localPeer) => async (dispatch, getState) => {
    localPeer.on('open', id => {
    });

    localPeer.on('connection', connection => {
        dispatch(addConnection(connection));
    });

    localPeer.on('call', async call => {
        const localStream = await getState().streams.data[localPeer.id] || dispatch(startLocalStream(localPeer));
        call.answer(localStream);
        dispatch(addCall(call));
    })
};

export const setMetadata = (metadata) => (dispatch, getState) => {
    persistData('metadata', metadata);
    dispatch({type: SET_LOCAL_USER_METADATA, payload: {metadata}});
};
