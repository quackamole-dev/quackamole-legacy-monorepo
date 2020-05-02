import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux'
import Peer from "peerjs";
import io from 'socket.io-client';
import {serializeQueryString} from "../../utils";
import {API_BASE_URL, PORT_SIGNALING, PORT_SOCKET} from "../../constants";
import {addConnection} from "../../store/actions/connections.actions";
import {Link} from "react-router-dom";
import TestStreamManager from "./TestStreamManager/TestStreamManager";


const calls = [];
const TestRoom = ({connections, addConnection}) => {
    const [socket, setSocket] = useState(null);
    const [localPeer, setLocalPeer] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState([]);

    const [inputState, setInputState] = useState({
        message: '',
        roomId: 'dummy-room-id',
        password: 'dummy123'
    });

    const initPeer = () => {
        if (socket) {
            const customPeerId = socket.id;
            console.log('init peer. peerId:', customPeerId);
            const peer = new Peer(customPeerId, {
                host: API_BASE_URL,
                port: PORT_SIGNALING,
                path: '/peer/signal',
                config: {iceServers: [{url: 'stun:stun.l.google.com:19302'}]}
            });

            console.log('peer', peer);
            setLocalPeer(peer);
        } else {
            console.log('could not create new Peer because the socket.io connection is not established yet');
        }
    };

    const initSocket = () => {
        const socket = io(`${API_BASE_URL}:${PORT_SOCKET}`, {
            // transports: ['websocket'],
            query: serializeQueryString({
                nickname: 'andi'
            })
        });

        socket.on('ready', (socketId) => {
            console.log('socket is ready', socketId);
        })

        setSocket(socket);



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
        console.log('connection listeners', connection);
        connection.on('data', data => {
            const parsedData = JSON.parse(data);
            console.log('parsed', parsedData);

            if (parsedData.textMessage) {
                console.log(
                    `%c MESSAGE - ${parsedData.textMessage.author}: "${parsedData.textMessage.text}"`,
                    'background: black; color: white; padding: 1rem'
                );
            }
        });
    };

    useEffect(() => {
        initSocket();
    }, []);

    useEffect(() => {
        if (localPeer) {
            console.log('peer initialized: ', localPeer);

            localPeer.on('open', id => {
                console.log('My peer ID is: ' + localPeer.id, localPeer);
                // initSocket();
            });

            localPeer.on('connection', connection => {
                console.log('on connection with', connection);
                addConnection(connection);
                initConnectionListeners(connection);
            });

            // localPeer.on('call', remoteCall => {
            //     console.log('incoming call. Answering automatically');
            //     remoteCall.on('stream', remoteMediaStream => {
            //         setRemoteStreams(remoteMediaStream);
            //     });
            // });
        }
    }, [localPeer]);

    useEffect(() => {
        if (socket && socket.id) {
            initPeer();
        }

        // On unmount: notify other people that you left before actually disconnecting
        return () => {
            console.log('unmount', socket);
            if (socket) {
                socket.emit('leave', inputState.roomId); // TODO change id for real rooms.
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
                console.log('room created', data);
                setInputState({...inputState, roomId: 'dummy-room-id'});
            }
        });
    };

    const handleJoinRoom = (e) => {
        console.log('join room handler');
        const {roomId, password } = inputState;
        socket.emit('join', { roomId, password, peerId: localPeer.id },
            // callback: the joining user himself is responsible to establish connections with other users
            (data) => {
            if (data) {
                console.log('roomRef CB', data);
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
            console.log('send message try');
            const message = {textMessage: {author: 'derp', text: inputState.message} };
            Object.values(connections).forEach(connection => {
                console.log('connection');
                connection.send(JSON.stringify(message));
            });
        }
    };

    const connectWithPeer = async (remotePeerId) => {
        console.log('connect with peer called', remotePeerId);
        const connection = await localPeer.connect(remotePeerId);
        addConnection(connection);
        initConnectionListeners(connection);
    };

    const startCallWithPeer = (remotePeerId, localStream) => {
        localPeer.call(remotePeerId, localStream);
    };

    // const startCall = destinationPeerId => {
    //     if (peer && connection && stream) {
    //         setCall(peer.call(destinationPeerId, stream));
    //     }
    // };

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
            </div>
            <TestStreamManager localPeer={localPeer} />
        </>
    );
};

const mapStateToProps = (state) => ({
    connections: state.connections.data,
});

export default connect(mapStateToProps, {addConnection})(TestRoom);

