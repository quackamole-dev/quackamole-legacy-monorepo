import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Box, Button, Input, DialogActions, FormControl, InputLabel, Select, Dialog, DialogTitle, DialogContent} from '@material-ui/core';
import {connect} from 'react-redux';
import GenericMediaCard from '../../Room/GenericMediaCard/GenericMediaCard';
import {startLocalStream, stopLocalStream} from '../../../store/actions/streams.actions';
import {setMediaStreamConstraints, toggleCameraEnabled, toggleMicrophoneEnabled} from '../../../store/actions/localUser.actions';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';

const useStyles = makeStyles({
  containerForm: {
    width: '400px',
    maxWidth: '90vw'
  },
  formControl: {
    display: 'block'
  },
  select: {
    width: '100%',
    marginBottom: '1rem'
  }
});

const MediaPreview = ({ dispatch, socket, localStreamWrapper, mediaConstraints }) => {
  const classes = useStyles();

  const [audioInputDevices, setAudioInputDevices] = useState(null);
  const [videoInputDevices, setVideoInputDevices] = useState(null);

  const [currentAudioDevice, setCurrentAudioDevice] = useState(null);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);

  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    initListOfDevices();
  }, []);

  useEffect(() => {
    handleSaveSettings();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideoDevice, currentAudioDevice]);

  useEffect(() => {
    if (settingsOpen) {
      dispatch(startLocalStream());
    } else {
      dispatch(stopLocalStream());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsOpen]);

  useEffect(() => {
    if (localStreamWrapper) {
      const audioTrack = localStreamWrapper.stream.getAudioTracks()[0];
      if (audioTrack && audioInputDevices) {
        const audioDevice = audioInputDevices.find(d => d.label === audioTrack.label);
        if (audioDevice) {
          setCurrentAudioDevice(audioDevice);
        }
      }
      const videoTrack = localStreamWrapper.stream.getVideoTracks()[0];
      if (videoTrack && videoInputDevices) {
        const videoDevice = videoInputDevices.find(d => d.label === videoTrack.label);
        if (videoDevice) {
          setCurrentVideoDevice(videoDevice);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStreamWrapper]);

  const setAudioIcon = () => {
    if (localStreamWrapper) {
      const audioTrack = localStreamWrapper.stream.getAudioTracks()[0];
      if (audioTrack && audioTrack.enabled) {
        return <MicIcon color='primary' fontSize='large'/>;
      }
    }
    return <MicOffIcon color='primary' fontSize='large'/>;
  };

  const setVideoIcon = () => { // TODO deduplicate toggle buttons for audio/video
    if (localStreamWrapper) {
      const videoTrack = localStreamWrapper.stream.getVideoTracks()[0];
      if (videoTrack && videoTrack.enabled) {
        return <VideocamIcon color='primary' fontSize='large'/>;
      }
    }
    return <VideocamOffIcon color='primary' fontSize='large'/>;
  };

  const initListOfDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    setAudioInputDevices(devices.filter((device) => device.kind === 'audioinput'));
    setVideoInputDevices(devices.filter((device) => device.kind === 'videoinput'));
  };

  const handleChangeCurrentAudioDevice = evt => {
    const selectedLabel = evt.target.value;
    const selectedDevice = audioInputDevices.find(d => d.label === selectedLabel);
    setCurrentAudioDevice(selectedDevice || null);
  };

  const handleChangeCurrentVideoDevice = evt => {
    const selectedLabel = evt.target.value;
    const selectedDevice = videoInputDevices.find(d => d.label === selectedLabel);
    setCurrentVideoDevice(selectedDevice || null);
  };

  const handleClickOpen = async () => {
    setSettingsOpen(true);
  };

  const handleClose = () => {
    setSettingsOpen(false);
  };

  const handleSaveSettings = async () => {
    const newConstraints = { ...mediaConstraints };
    if (currentAudioDevice) {
      newConstraints.audio = { ...newConstraints.audio, deviceId: currentAudioDevice.deviceId };
    }

    if (currentVideoDevice) {
      newConstraints.video = { ...newConstraints.video, deviceId: currentVideoDevice.deviceId };
    }

    if (currentAudioDevice && currentVideoDevice) {
      await dispatch(setMediaStreamConstraints(newConstraints));
    }
  };

  return (
    <Box>
      <Button onClick={handleClickOpen}>Preview Audio & Video Settings</Button>

      <div>
        <Dialog disableBackdropClick disableEscapeKeyDown open={settingsOpen} onClose={(handleClose)}>
          <DialogTitle>Audio & Video Settings</DialogTitle>
          <DialogContent>

            <GenericMediaCard stream={localStreamWrapper ? localStreamWrapper.stream : null} muted={false}/>
            {/* toggle Camera enabled */}
            <Button style={{ height: '100%' }} onClick={() => dispatch(toggleCameraEnabled())}>
              {setVideoIcon()}
            </Button>
            {/* toggle Microphone enabled */}
            <Button style={{ height: '100%' }} onClick={() => dispatch(toggleMicrophoneEnabled())}>
              {setAudioIcon()}
            </Button>

            <form className={classes.containerForm}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="select-mic">Audio Input (Microphone)</InputLabel>
                <Select
                  className={classes.select}
                  native
                  value={currentAudioDevice ? currentAudioDevice.label : ''}
                  onChange={handleChangeCurrentAudioDevice}
                  input={<Input id="select-mic"/>}
                >
                  {audioInputDevices && audioInputDevices.map((device, i) => <option key={device.groupId + i}>{device.label}</option>)}
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="select-cam">Video Input (Camera)</InputLabel>
                <Select
                  className={classes.select}
                  native
                  value={currentVideoDevice ? currentVideoDevice.label : ''}
                  onChange={handleChangeCurrentVideoDevice}
                  input={<Input id="select-cam"/>}
                >
                  {videoInputDevices && videoInputDevices.map((device, i) => <option key={device.groupId + i}>{device.label}</option>)}
                </Select>
              </FormControl>
            </form>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="primary">Close</Button>
            {/*<Button onClick={handleSaveSettings} color="primary">Save</Button>*/}
          </DialogActions>
        </Dialog>
      </div>


    </Box>
  );
};

const mapStateToProps = (state) => {
  const socket = state.localUser.socket;
  return {
    socket: socket,
    localStreamWrapper: state.localUser.mediaStream,
    mediaConstraints: state.localUser.mediaConstraints
  };
};

export default connect(mapStateToProps)(MediaPreview);
