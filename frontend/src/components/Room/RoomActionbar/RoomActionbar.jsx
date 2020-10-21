import React from 'react';
import {Box, Button} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import MicNoneIcon from '@material-ui/icons/MicNone';
import MicOffIcon from '@material-ui/icons/MicOff';
import RoomSidebarMenu from '../RoomSidebarMenu/RoomSidebarMenu';
import MicIcon from '@material-ui/icons/Mic';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import RoomSidebarChat from '../RoomSidebarChat/RoomSidebarChat';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {toggleLocalAudio, toggleLocalVideo} from '../../../store/actions/streams.actions';

// TODO actionbar needs some rework.
const RoomActionbar = ({ localStreamWrapper, dispatch }) => {

  const setAudioIcon = () => {
    if (localStreamWrapper) {
      const audioTrack = localStreamWrapper.stream.getAudioTracks()[0];
      if (audioTrack) {
        return audioTrack.enabled
          ? <MicIcon color='primary' fontSize='large'/>
          : <MicOffIcon color='primary' fontSize='large'/>;
      }
    }
    return <MicNoneIcon color='primary' fontSize='large'/>;
  };

  const setVideoIcon = () => {
    if (localStreamWrapper) {
      const videoTrack = localStreamWrapper.stream.getVideoTracks()[0];
      if (videoTrack && videoTrack.enabled) {
        return <VideocamIcon color='primary' fontSize='large'/>;
      }
    }
    return <VideocamOffIcon color='primary' fontSize='large'/>;
  };

  return (
    <Box
      bgcolor={'#f5deb3eb'}
      height={'10%'}
      display='flex'
      justifyContent={'center'}
      borderTop={'1px solid #0000003b'}
      alignItems={'center'}
    >
      {/* toggle room menu settings */}
      <RoomSidebarMenu/>

      {/* Navigate to landing page */}
      <Link to={'/'} style={{ height: '100%' }}>
        <Button style={{ height: '100%' }}>
          <HomeIcon color='primary' fontSize='large'/>
        </Button>
      </Link>

      {/* toggle Microphone audio track */}
      <Button style={{ height: '100%' }} onClick={() => dispatch(toggleLocalAudio())}>
        {setAudioIcon()}
      </Button>

      {/* toggle camera video track */}
      <Button style={{ height: '100%' }} onClick={() => dispatch(toggleLocalVideo())}>
        {setVideoIcon()}
      </Button>

      {/* toggle chat */}
      <RoomSidebarChat/>
    </Box>
  );
};

const mapStateToProps = (state) => {
  const socket = state.localUser.socket;
  const localStreamWrapper = socket ? state.streams.data[socket.id] : null;
  return {
    localStreamWrapper: localStreamWrapper
  };
};

export default connect(mapStateToProps)(RoomActionbar);
