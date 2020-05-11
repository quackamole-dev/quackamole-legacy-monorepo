import React, {useEffect, useState} from 'react';
import {Box} from "@material-ui/core";
import RoomSidebar from "./RoomSidebar/RoomSidebar";
import RoomPluginContent from "./RoomPluginContent/RoomPluginContent";
import RoomMediaManager from "./RoomMediaManager/RoomMediaManager";
import {connect} from "react-redux";
import {addConnection, removeConnection} from "../../store/actions/connections.actions";
import {initLocalUser} from "../../store/actions/localUser.actions";

const Room = ({socket, localPeer, connections, addConnection, removeConnection, match, initLocalUser}) => {
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
        // initSocket({nickname: 'andi'});
        initLocalUser({nickname: 'andiiii'});
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
            // initLocalUserPeer(socket.id);
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


    return (
        <>
            <RoomSidebar />

            <Box display='flex' flexDirection='column' width={1} height={'calc(100% - 60px)'} justifyContent={'space-between'} >
                <Box display='flex' flexDirection='row' width={1} height={'90%'} justifyContent={'space-between'}>
                    <RoomPluginContent/>
                    <RoomMediaManager localPeer={localPeer}/>
                </Box>

                {/* space for some easy access actions like mute, enable camera, chat etc*/}
                <Box bgcolor={'wheat'} height={'10%'}> </Box>

            </Box>

        </>
    );
};

const mapStateToProps = (state) => ({
    socket: state.localUser.socket,
    localPeer: state.localUser.peer,
    connections: state.connections.data,
});

export default connect(mapStateToProps, {addConnection, removeConnection, initLocalUser})(Room);
