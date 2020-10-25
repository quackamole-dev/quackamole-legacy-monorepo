import React, {useEffect} from 'react';
import {Box} from '@material-ui/core';
import RoomPluginContent from './RoomPluginContent/RoomPluginContent';
import RoomMediaManager from './RoomMediaManager/RoomMediaManager';
import {connect} from 'react-redux';
import {joinRoom} from '../../store/actions/connections.actions';
import {initLocalUser} from '../../store/actions/localUser.actions';
import RoomActionbar from './RoomActionbar/RoomActionbar';
import {roomExitCleanup} from '../../store/actions/room.actions';

const Room = ({ dispatch, socket, match, history, roomError, currentRoom, localPeerLoading, visitedLobby }) => {

  useEffect(() => {
    if (roomError || !visitedLobby) {
      history.push(`/room-lobby/${match.params.roomId}`);
    } else if (!socket && !localPeerLoading) {
      dispatch(initLocalUser());
    } else if (socket && socket.id && !currentRoom.id) {
      dispatch(joinRoom(match.params.roomId, 'dummy123'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomError, socket]);

  useEffect(() => {
    // unmount
    return () => dispatch(roomExitCleanup());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box display='flex' flexDirection='column' width={1} height={'100%'} justifyContent={'space-between'}>
        <Box display='flex' flexDirection='row' width={1} height={'90%'} justifyContent={'space-between'}>
          <RoomPluginContent/>
          <RoomMediaManager/>
        </Box>
        <RoomActionbar/>
      </Box>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    socket: state.localUser.socket,
    localPeerLoading: state.localUser.loading,
    roomError: state.room.error,
    currentRoom: state.room.data,
    visitedLobby: state.room.visitedLobby
  };
};

export default connect(mapStateToProps)(Room);
