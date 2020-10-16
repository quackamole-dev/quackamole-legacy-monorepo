import React, {useEffect} from 'react';
import {Box} from "@material-ui/core";
import RoomPluginContent from "./RoomPluginContent/RoomPluginContent";
import RoomMediaManager from "./RoomMediaManager/RoomMediaManager";
import {connect} from "react-redux";
import {joinRoom} from "../../store/actions/connections.actions";
import {initLocalUser} from "../../store/actions/localUser.actions";
import RoomActionbar from "./RoomActionbar/RoomActionbar";
import {roomExitCleanup} from '../../store/actions/room.actions';
import {startLocalStream} from '../../store/actions/streams.actions';

const Room = ({socket, match, history, initLocalUser, joinRoom, roomError, currentRoom, localPeerLoading, roomExitCleanup, startLocalStream}) => {

    useEffect(() => {
        if (roomError) {
            history.push(`/room-lobby/${match.params.roomId}`);
        } else if (!socket && !localPeerLoading) {
            console.log('Room#useEffect before initLocalUser');
            initLocalUser();
        } else if (socket && socket.id && !currentRoom.id) {
            console.log('Room#useEffect before joinRoom');
            startLocalStream();
            joinRoom(match.params.roomId, 'dummy123');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomError, socket]);

    useEffect(() => {
        // unmount
        return () => roomExitCleanup();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
    return {
        socket: state.localUser.socket,
        localPeerLoading: state.localUser.loading,
        roomError: state.room.error,
        currentRoom: state.room.data
    };
};

export default connect(mapStateToProps, {initLocalUser, joinRoom, roomExitCleanup, startLocalStream})(Room);
