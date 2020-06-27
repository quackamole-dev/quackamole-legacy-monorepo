import React, {useEffect} from 'react';
import {Box} from "@material-ui/core";
import RoomPluginContent from "./RoomPluginContent/RoomPluginContent";
import RoomMediaManager from "./RoomMediaManager/RoomMediaManager";
import {connect} from "react-redux";
import {addConnection, removeConnection, joinRoom} from "../../store/actions/connections.actions";
import {initLocalUser} from "../../store/actions/localUser.actions";
import {startLocalStream, clearAllStreams} from "../../store/actions/streams.actions";
import RoomActionbar from "./RoomActionbar/RoomActionbar";
import {getPersistedData} from "../../utils";
import {setCurrentRoomError} from '../../store/actions/room.actions';

const Room = ({socket, localPeer, localMetadata, connections, match, history, initLocalUser, joinRoom, startLocalStream, clearAllStreams, roomError, currentRoom, localPeerLoading, setCurrentRoomError}) => {
    // // TODO too much going on in this component itself, hide unmount logic and think about restructuring

    useEffect(() => {
        if (roomError) {
            history.push(`/room-lobby/${match.params.roomId}`);
        } else if (!localPeer && !localPeerLoading && localMetadata.nickname) {
            const metadata = getPersistedData('metadata');
            initLocalUser(metadata);
        } else if (localPeer && !currentRoom.id) {
            startLocalStream();
            joinRoom(match.params.roomId, 'dummy123');
        } else if (!localMetadata.nickname || !localMetadata.nickname.length) {
            setCurrentRoomError({error: {name: 'RoomError', message: 'Please enter a nickname before joining the room.'}});
            history.push(`/room-lobby/${match.params.roomId}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localPeer, roomError, socket]);

    useEffect(() => {
        // unmount
        return () => {
            if (socket) {
                socket.emit('leave', match.params.roomId);
                socket.disconnect();
            }

            if (connections) {
                Object.values(connections).forEach(conn => conn.close());
            }

            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
            }
            clearAllStreams();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    return (
        <>
            <Box display='flex' flexDirection='column' width={1} height={'100%'} justifyContent={'space-between'} >
                <Box display='flex' flexDirection='row' width={1} height={'90%'} justifyContent={'space-between'}>
                    <RoomPluginContent/>
                    <RoomMediaManager />
                </Box>
                <RoomActionbar />
            </Box>
        </>
    );
};

const mapStateToProps = (state) => {
    const localPeer = state.localUser.peer;
    return {
        socket: state.localUser.socket,
        localPeer: localPeer,
        localPeerLoading: state.localUser.loading,
        localMetadata: state.localUser.metadata,
        localStream: localPeer ? state.streams.data[localPeer] : null,
        connections: state.connections.data,
        roomError: state.room.error,
        currentRoom: state.room.data
    };
};

export default connect(mapStateToProps, {addConnection, removeConnection, initLocalUser, joinRoom, startLocalStream, clearAllStreams, setCurrentRoomError})(Room);
