import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux'
import Peer from "peerjs";
import io from 'socket.io-client';
import {serializeQueryString} from "../../utils";
import {API_BASE_URL, PORT_SIGNALING, PORT_SOCKET} from "../../constants";
import {joinRoom, setCurrentRoom} from "../../store/actions/room.actions";


// const connTest = [];
const TestRoom = ({currentConnections, joinRoom}) => {
    const [socket, setSocket] = useState(null);
    const [localPeer, setLocalPeer] = useState(null);
    const [inputState, setInputState] = useState({
        RemotePeerId: '',
        message: '',
        currentRoomId: 'dummy-room-id',
        currentRoomPassword: 'dummy123'
    });

    const initPeer = () => {
        // const peer = new Peer({ debug: true, config: { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] } });

        const peer = new Peer({
            host: API_BASE_URL,
            port: PORT_SIGNALING,
            path: '/peer/signal',
            config: {iceServers: [{url: 'stun:stun.l.google.com:19302'}]}
        });
        setLocalPeer(peer);
    };

    const initSocket = () => {
        const socket = io(`${API_BASE_URL}:${PORT_SOCKET}`, {
            // transports: ['websocket'],
            query: serializeQueryString({
                nickname: 'andi',
                peerId: 'cwscwc',
                // peerId: localPeer.id,
            })
        });

        // if (socket.connected) {
        console.log('socket --------', socket);
        setSocket(socket);
        // }
    };

    const initConnectionListeners = (connection) => {
        connection.on('data', data => {
            const parsedData = JSON.parse(data);
            console.log('parsed', parsedData);

            if (parsedData.message) {
                console.log(
                    `%c MESSAGE - ${parsedData.message.author}: "${parsedData.message.text}"`,
                    'background: black; color: white; padding: 1rem'
                );
            }
        });
    };

    useEffect(() => {
        initPeer();
        // initSocket()

    }, []);

    // useEffect(() => {
    //     console.log("connections ---------------------------", connections);
    // }, [connections]);

    useEffect(() => {
        if (localPeer) {
            console.log('peer initialized: ', localPeer.id);

            localPeer.on('open', id => {
                console.log('My peer ID is: ' + localPeer.id, localPeer);
                initSocket();
            });

            localPeer.on('connection', connection => {
                console.log('on connection with', connection);
                // setCurrentRoom({connections: currentConnections.concat(connection)});
                initConnectionListeners(connection);
            });
        }
    }, [localPeer]);

    useEffect(() => {
        if (socket) {
            console.log('socket initialized');

            socket.on('user-join', (room) => {
                console.log('new user joined room', room);
            });
        }
    }, [socket]);


    const handleCreateRoom = (e) => {
        socket.emit('create', {
            // id: 'test-room-id',
            name: 'test room name',
            password: '123',
            maxConnections: 4
        }, (data) => {
            if (data) {
                console.log('room created', data);
                setInputState({...inputState, currentRoomId: 'dummy-room-id'});
            }
        });
    };

    const handleJoinRoom = (e) => {
        console.log('join room handler');
        socket.emit('join', {
            room: {
                id: 'dummy-room-id',
                name: 'test room name',
                password: 'dummy123',
                // maxConnections: 4
            },
            peerId: localPeer.id
            // callback
        }, (data) => {
            console.log('data', data);
            if (data) {
                data.room.joinedUsers.forEach((user) => {
                    if (user.peerId !== localPeer.id) {
                        console.log('connecting to', user.peerId);
                        connectWithPeer(user.peerId);
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
            const message = {author: 'derp', text: inputState.message};

            currentConnections.forEach(connection => {
                connection.send(JSON.stringify(message));
                console.log('sending message to: ', connection.peer);
            });
        }
    };

    const connectWithPeer = async (remotePeerId) => {
        const connection = await localPeer.connect(remotePeerId);
        // setConnections([...connections, connection]);
        // connTest.push(connection);
        // setCurrentRoom({connections: currentConnections.concat(connection)});

        initConnectionListeners(connection);
    };

    const startCallWithPeer = (remotePeerId, localStream) => {
        localPeer.call(remotePeerId, localStream);
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
                {/*<button onClick={handleCreateRoom}>create room</button>*/}
                <button onClick={handleJoinRoom}>join room</button>
                <button onClick={handleListAllPeers}>listAllPeers room</button>
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
        </>
    );
};

const mapStateToProps = (state) => ({
   currentConnections: state.current.connections
});

export default connect(mapStateToProps, {joinRoom, setCurrentRoom})(TestRoom);

