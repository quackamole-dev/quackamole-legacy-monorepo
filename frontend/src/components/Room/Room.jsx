import React, {useEffect, useState} from 'react';
import {Box} from "@material-ui/core";
import RoomSidebar from "./RoomSidebar/RoomSidebar";
import RoomPluginContent from "./RoomPluginContent/RoomPluginContent";
import RoomMediaManager from "./RoomMediaManager/RoomMediaManager";
import Peer from "peerjs";
import {API_BASE_URL, PORT_SIGNALING, PORT_SOCKET} from "../../constants";
import io from "socket.io-client";
import {serializeQueryString} from "../../utils";
import {connect} from "react-redux";
import {addConnection, removeConnection} from "../../store/actions/connections.actions";

const Room = ({connections, addConnection, removeConnection, match}) => {
    const [socket, setSocket] = useState(null);
    const [localPeer, setLocalPeer] = useState(null);

    const initPeer = (_socket) => {
        if (_socket) {
            const customPeerId = _socket.id;
            const peer = new Peer(customPeerId, {
                host: API_BASE_URL,
                port: PORT_SIGNALING,
                path: '/peer/signal',
                // debug: 3,
                config: {iceServers: [{url: 'stun:stun.l.google.com:19302'}]}
            });

            console.log('peer', customPeerId, peer);
            setLocalPeer(peer);
        } else {
            console.log('could not create new Peer because the socket.io connection is not established yet');
        }
    };

    const initSocket = (queryParams = {}) => {
        const socket = io(`http://${API_BASE_URL}:${PORT_SOCKET}`, {
            // transports: ['websocket'],
            secure: true,
            query: serializeQueryString(queryParams)
        });

        socket.on('ready', (socketId) => {
            setSocket(socket);
        });

        // Init Listeners
        socket.on('user-join', (room) => {
            console.log('new user joined room, he will connect to you shortly');
        });

        // socket.on('user-leave', (data) => {
        //     const connectionWithLeavingUser = connections[data.peerId];
        //     console.log('user left room', data.peerId, connectionWithLeavingUser);
        //
        //     if (connectionWithLeavingUser) {
        //         connectionWithLeavingUser.close();
        //     }
        // });
    };

    const initConnectionListeners = (connection) => {
        connection.on('data', data => {
            const parsedData = JSON.parse(data);

            if (parsedData.textMessage) {
                console.log(
                    `%c MESSAGE - ${parsedData.textMessage.author}: "${parsedData.textMessage.text}"`,
                    'background: black; color: white; padding: 1rem'
                );
            }
        });
        connection.on('close', () => removeConnection(connection));
    };

    useEffect(() => {
        initSocket({nickname: 'andi'});
    }, []);

    useEffect(() => {
        if (localPeer) {
            console.log('peer initialized: ', localPeer);

            localPeer.on('open', id => {
                console.log('My peer ID is: ' + localPeer.id, localPeer);
            });

            localPeer.on('connection', connection => {
                console.log('on connection with', connection, 'metadata: ', connection.metaData, connection.metadata);
                addConnection(connection);
                initConnectionListeners(connection);
            });

            localPeer.on('disconnected', connection => {
                console.log('-------DISCONNECTED', connection);
                addConnection(connection);
                initConnectionListeners(connection);
            });

            const roomId = match.params.roomId;
            joinRoom(roomId, 'dummy123');
        }
    }, [localPeer]);

    useEffect(() => {
        if (socket && socket.id) {
            console.log('socket', socket);
            initPeer(socket);
        }

        // On unmount: notify other people that you left before actually disconnecting
        return () => {
            const roomId = match.params.roomId;

            if (socket) {
                socket.emit('leave', roomId); // TODO change id for real rooms.
            }

            if (connections) {
                Object.values(connections).forEach(conn => conn.close());
            }
        }
    }, [socket]);

    const joinRoom = (roomId, password) => {
        console.log('join room', roomId);
        socket.emit('join', {roomId, password, peerId: localPeer.id},
            // callback: the joining user himself is responsible to establish connections with other users
            (data) => {
                if (data) {
                    console.log('joined room', data);
                    data.room.joinedUsers.forEach((peerId) => {
                        if (peerId !== localPeer.id) {
                            connectWithPeer(peerId);
                        }
                    });
                }
            });
    };

    const connectWithPeer = async (remotePeerId) => {
        const connection = await localPeer.connect(remotePeerId, {
            metadata: {
                nickname: 'test-metadata'
            }
        });
        addConnection(connection);
        initConnectionListeners(connection);
    };

    // const handleJoinRoom = (e) => {
    //     const roomId = match.params.roomId;
    //     joinRoom(roomId, 'dummy123');
    // };

    return (
        <>
            <RoomSidebar />
            {/*<button onClick={handleJoinRoom}>join room</button>*/}

            <Box display='flex' flexDirection='row' width={1} height={'100%'} border={1} justifyContent={'space-between'} >
                <RoomPluginContent/>
                <RoomMediaManager localPeer={localPeer}/>
            </Box>

        </>
    );
};

const mapStateToProps = (state) => ({
    connections: state.connections.data,
});

export default connect(mapStateToProps, {addConnection, removeConnection})(Room);

