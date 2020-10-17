import React from 'react';
import {connect} from 'react-redux';
import GenericMediaCard from '../GenericMediaCard/GenericMediaCard';
import {makeStyles} from '@material-ui/core/styles';
import {Box} from '@material-ui/core';
import RemoteMediaManager from './RemoteMediaManager/RemoteMediaManager';

const useStyles = makeStyles((theme) => ({
  roomMediaManager: {
    padding: '5px',
    backgroundColor: '#f5deb340',
    borderLeft: '1px solid #0000003b'
  }
}));

const RoomMediaManager = ({ localStream, localPeerMetadata }) => {
  const classes = useStyles();

  return (
    <Box bgcolor='lightblue' width={'220px'} minWidth={'150px'} className={classes.roomMediaManager}>
      <GenericMediaCard stream={localStream} muted={true} user={{ nickname: localPeerMetadata.nickname }}/>
      <RemoteMediaManager/>
    </Box>
  );
};

const mapStateToProps = (state) => {
  const socket = state.localUser.socket;
  const localStream = socket ? state.streams.data[socket.id] : null;
  return {
    localPeerMetadata: state.localUser.metadata,
    localStream: localStream
  };
};

export default connect(mapStateToProps, {})(RoomMediaManager);
