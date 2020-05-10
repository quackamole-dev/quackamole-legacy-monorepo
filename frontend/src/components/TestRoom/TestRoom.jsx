import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux'
import Peer from "peerjs";
import io from 'socket.io-client';
import {serializeQueryString} from "../../utils";
import {API_BASE_URL, PORT_SIGNALING, PORT_SOCKET} from "../../constants";
import {addConnection, removeConnection} from "../../store/actions/connections.actions";
import {Link} from "react-router-dom";
import TestStreamManager from "./TestStreamManager/TestStreamManager";


// const calls = [];
const TestRoom = ({connections, addConnection, removeConnection}) => {
    const [socket, setSocket] = useState(null);
    const [localPeer, setLocalPeer] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState([]);

    const [inputState, setInputState] = useState({
        message: '',
        roomId: 'dummy-room-id',
        password: 'dummy123',
        nickname: ''
    });

    const initPeer = () => {
        if (socket) {
            const customPeerId = socket.id;
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

    const initSocket = () => {
        const socket = io(`https://${API_BASE_URL}:${PORT_SOCKET}`, {
            // transports: ['websocket'],
            secure: true,
            query: serializeQueryString({
                nickname: inputState.nickname || 'default nickname'
            })
        });

        socket.on('ready', (socketId) => {
            setSocket(socket);
        });

        // Init Listeners
        socket.on('user-join', (room) => {
            console.log('new user joined room, he will connect to you shortly');
        });

        socket.on('user-leave', (data) => {
            const connectionWithLeavingUser = connections[data.peerId];
            console.log('user left room', data.peerId, connectionWithLeavingUser);

            if (connectionWithLeavingUser) {
                connectionWithLeavingUser.close();
            }
        });
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
        initSocket();
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
        }
    }, [localPeer]);

    useEffect(() => {
        if (socket && socket.id) {
            initPeer();
        }

        // On unmount: notify other people that you left before actually disconnecting
        return () => {
            if (socket) {
                socket.emit('leave', inputState.roomId); // TODO change id for real rooms.
            }

            if (connections) {
                Object.values(connections).forEach(conn => conn.close());
            }
        }
    }, [socket]);


    const handleCreateRoom = (e) => {
        socket.emit('create', {
            // id: 'test-room-id',
            name: 'test room name',
            password: inputState.password,
            maxConnections: 4
        }, (data) => {
            if (data) {
                setInputState({...inputState, roomId: 'dummy-room-id'});
            }
        });
    };

    const handleJoinRoom = (e) => {
        const {roomId, password } = inputState;
        socket.emit('join', { roomId, password, peerId: localPeer.id },
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

    const handleListAllPeers = (e) => {
        localPeer.listAllPeers((peers) => {
            console.log('peers', peers);
        });
    };

    const sendMessage = () => {
        if (localPeer) {
            const message = {textMessage: {author: 'derp', text: inputState.message} };
            Object.values(connections).forEach(connection => {
                console.log('send message to', connection.peer);
                connection.send(JSON.stringify(message));
            });
        }
    };

    const connectWithPeer = async (remotePeerId) => {
        const connection = await localPeer.connect(remotePeerId, {metadata: {
            nickname: 'test-metadata'
            }});
        addConnection(connection);
        initConnectionListeners(connection);
    };

    //////////////////
    //// HANDLERS ////
    //////////////////
    const handleChange = e => setInputState({...inputState, [e.target.name]: e.target.value});

    const handleSendMessage = e => {
        e.preventDefault();
        sendMessage();
    };

    return (
        <>
            <div>
                Hello world
                <button onClick={handleCreateRoom}>create room</button>
                <button onClick={handleJoinRoom}>join room</button>
                <button onClick={handleListAllPeers}>listAllPeers room</button>
                <Link to={'/'}>HOME</Link>
            </div>
            <div>
                <form onSubmit={handleSendMessage}>
                    <fieldset>
                        <legend>Send Message to Peers</legend>
                        <input
                            type='text'
                            aria-label='chat input'
                            name='message'
                            value={inputState.message}
                            onChange={handleChange}
                            placeholder='Hello Peer...'
                        />
                        <button type='submit'>send</button>
                    </fieldset>
                </form>

                <input
                    type='text'
                    aria-label='chat input'
                    name='nickname'
                    value={inputState.nickname}
                    onChange={handleChange}
                    placeholder='Enter your nickname'
                />
            </div>
            <TestStreamManager localPeer={localPeer} />
        </>
    );
};

const mapStateToProps = (state) => ({
    connections: state.connections.data,
});

export default connect(mapStateToProps, {addConnection, removeConnection})(TestRoom);

