import React, {useEffect} from 'react';
import {Box} from "@material-ui/core";
import RoomSidebar from "./RoomSidebar/RoomSidebar";
import RoomPluginContent from "./RoomPluginContent/RoomPluginContent";
import RoomMediaManager from "./RoomMediaManager/RoomMediaManager";
import {connect} from "react-redux";
import {addConnection, removeConnection, joinRoom} from "../../store/actions/connections.actions";
import {initLocalUser} from "../../store/actions/localUser.actions";

const Room = ({socket, localPeer, connections, match, initLocalUser, joinRoom}) => {
    useEffect(() => {
        initLocalUser({nickname: 'andiiii'});
    }, []);

    useEffect(() => {
        if (localPeer) {
            const roomId = match.params.roomId;
            joinRoom(roomId, 'dummy123');
        }
    }, [localPeer]);

    useEffect(() => {
        // On unmount: notify other people that you left before actually disconnecting
        return () => {
            const roomId = match.params.roomId;

            if (socket) {
                socket.emit('leave', roomId);
            }

            if (connections) {
                Object.values(connections).forEach(conn => conn.close());
            }
        }
    }, [socket]);

    return (
        <>
            <RoomSidebar />

            <Box display='flex' flexDirection='column' width={1} height={'calc(100% - 60px)'} justifyContent={'space-between'} >
                <Box display='flex' flexDirection='row' width={1} height={'90%'} justifyContent={'space-between'}>
                    <RoomPluginContent/>
                    <RoomMediaManager />
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

export default connect(mapStateToProps, {addConnection, removeConnection, initLocalUser, joinRoom})(Room);
