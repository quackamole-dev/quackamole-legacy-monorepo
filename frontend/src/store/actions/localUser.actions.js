import {INIT_LOCAL_USER_SOCKET, RESET_LOCAL_USER, SET_LOCAL_USER_LOADING, SET_LOCAL_USER_METADATA} from '../actionTypes';
import {API_BASE_URL, PORT_SOCKET, SSL_ENABLED} from "../../constants";
import io from "socket.io-client";
import {getPersistedData, persistData, serializeQueryString} from '../../utils';
import {addConnection, initDataChannelListeners, removeConnection} from './connections.actions';
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
        // transports: ['websocket'],
        secure: SSL_ENABLED,
        query: serializeQueryString(metadata)
    });

    dispatch(initLocalUserSocketListeners(socket));
}

const initLocalUserSocketListeners = (socket) => async (dispatch, getState) => {
    socket.on('ready', (socketId) => {
        dispatch({type: INIT_LOCAL_USER_SOCKET, payload: {socket}});

        socket.on('user-leave', (socketId) => {
            const connection = getState().connections.data[socketId];
            if (connection) {
                dispatch(removeConnection(connection));
            }
        });

        socket.on('offer', async ({senderSocketId, offer}) => {
            console.log('OFFER received - senderId:', senderSocketId, 'offer:', offer);

            const connection = new RTCPeerConnection(); // TODO check first if one already exists
            connection.socketId = socket.id; // FIXME temporary solution. store as es6 map. do "new Map(Array.from(m).reverse())" for reverse lookup
            connection.remoteSocketId = senderSocketId;

            connection.defaultDataChannel = connection.createDataChannel('default'); // FIXME temporary. create wrapper for RTCPeerConnection
            console.log('--defaultDataChannel created', connection.defaultDataChannel);
            dispatch(initDataChannelListeners(connection.defaultDataChannel));

            const localStream = await getState().streams.data[socket.id] || dispatch(startLocalStream());
            connection.addStream(localStream); // addStream needs to be called BEFORE attempting to create offer/answer
            await dispatch(addConnection(connection));


            await connection.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await connection.createAnswer();
            await connection.setLocalDescription(answer);
            socket.emit('answer', {receiverSocketId: senderSocketId, answer: answer})

        });

        socket.on('answer', ({senderSocketId, answer}) => {
            const connection = getState().connections.data[senderSocketId];

            if (connection) {
                console.log('ANSWER received - senderId:', senderSocketId, 'answer:', answer, 'connection:', connection);
                connection.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });

        socket.on('ice-candidate', ({senderSocketId, iceCandidate}) => {
            const connection = getState().connections.data[senderSocketId];

            if (connection) {
                console.log('ICE Candidate received - senderId:', senderSocketId);
                connection.addIceCandidate(new RTCIceCandidate(iceCandidate));
            }
        });
    });
}

export const setMetadata = (metadata) => (dispatch, getState) => {
    persistData('metadata', metadata);
    dispatch({type: SET_LOCAL_USER_METADATA, payload: {metadata}});
};
