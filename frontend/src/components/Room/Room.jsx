import React, {useEffect} from 'react';
import {Box} from "@material-ui/core";
import RoomPluginContent from "./RoomPluginContent/RoomPluginContent";
import RoomMediaManager from "./RoomMediaManager/RoomMediaManager";
import {connect} from "react-redux";
import {addConnection, removeConnection, tryJoinRoom} from "../../store/actions/connections.actions";
import {initLocalUser} from "../../store/actions/localUser.actions";
import {startLocalStream, clearAllStreams} from "../../store/actions/streams.actions";
import RoomActionbar from "./RoomActionbar/RoomActionbar";
import {getPersistedData} from "../../utils";

const Room = ({socket, localPeer, localNickname, connections, match, history, initLocalUser, tryJoinRoom, startLocalStream, clearAllStreams, roomError}) => {
    // TODO refactor these messy useEffects. Start using useCallback and add all dependencies
    useEffect(() => {
        if (getPersistedData('metadata').nickname && !roomError) {
            initLocalUser();
        } else {
            history.push(`/room-lobby/${match.params.roomId}`);
        }
    }, []);

    useEffect(() => {
        if (roomError) {
            history.push(`/room-lobby/${match.params.roomId}`);
        }
    }, [roomError]);

    useEffect(() => {
        if (localPeer && localNickname && !roomError) {
            startLocalStream();
            tryJoinRoom(match.params.roomId, 'dummy123');
        }
    }, [localPeer]);

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

const mapStateToProps = (state) => ({
    socket: state.localUser.socket,
    localPeer: state.localUser.peer,
    localNickname: state.localUser.metadata.nickname,
    connections: state.connections.data,
    roomError: state.room.error
});

export default connect(mapStateToProps, {addConnection, removeConnection, initLocalUser, tryJoinRoom, startLocalStream, clearAllStreams})(Room);
