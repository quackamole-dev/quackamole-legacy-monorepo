import React, {useEffect} from 'react';
import {Box} from "@material-ui/core";
import RoomPluginContent from "./RoomPluginContent/RoomPluginContent";
import RoomMediaManager from "./RoomMediaManager/RoomMediaManager";
import {connect} from "react-redux";
import {addConnection, removeConnection, joinRoom} from "../../store/actions/connections.actions";
import {initLocalUser} from "../../store/actions/localUser.actions";
import {startLocalStream, clearAllStreams} from "../../store/actions/streams.actions";
import RoomActionbar from "./RoomActionbar/RoomActionbar";

const Room = ({socket, localPeer, connections, match, initLocalUser, joinRoom, startLocalStream, clearAllStreams}) => {
    useEffect(() => {
        initLocalUser({nickname: 'andiiii'});
    }, []);

    useEffect(() => {
        if (localPeer) {
            startLocalStream();
            joinRoom(match.params.roomId, 'dummy123');
        }
    }, [localPeer]);

    useEffect(() => {
        // unmount
        return () => {
            if (socket) {
                console.log('EMIT LEAVEEEEEEEEEEEE', socket);
                socket.emit('leave', match.params.roomId);
                socket.disconnect();
            }

            if (connections) {
                Object.values(connections).forEach(conn => conn.close());
            }

            if (window.localStream) {
                console.log('clear tracks local');
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
    connections: state.connections.data,
});

export default connect(mapStateToProps, {addConnection, removeConnection, initLocalUser, joinRoom, startLocalStream, clearAllStreams})(Room);
