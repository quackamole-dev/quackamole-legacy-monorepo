import React, {useEffect} from 'react';
import {Box} from "@material-ui/core";
import RoomPluginContent from "./RoomPluginContent/RoomPluginContent";
import RoomMediaManager from "./RoomMediaManager/RoomMediaManager";
import {connect} from "react-redux";
import {joinRoom} from "../../store/actions/connections.actions";
import {initLocalUser} from "../../store/actions/localUser.actions";
import RoomActionbar from "./RoomActionbar/RoomActionbar";
import {roomExitCleanup} from '../../store/actions/room.actions';

const Room = ({socket, localPeer, match, history, initLocalUser, joinRoom, roomError, currentRoom, localPeerLoading, roomExitCleanup}) => {

    useEffect(() => {
        if (roomError) {
            history.push(`/room-lobby/${match.params.roomId}`);
        } else if (!localPeer && !localPeerLoading) {
            initLocalUser();
        } else if (localPeer && socket && !currentRoom.id) {
            joinRoom(match.params.roomId, 'dummy123');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localPeer, roomError, socket]);

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
    const localPeer = state.localUser.peer;
    return {
        socket: state.localUser.socket,
        localPeer: localPeer,
        localPeerLoading: state.localUser.loading,
        roomError: state.room.error,
        currentRoom: state.room.data
    };
};

export default connect(mapStateToProps, {initLocalUser, joinRoom, roomExitCleanup})(Room);
