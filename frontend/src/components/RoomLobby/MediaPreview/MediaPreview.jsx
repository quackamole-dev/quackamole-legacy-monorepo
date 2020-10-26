import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Box, Button, Input, DialogActions, FormControl, InputLabel, Select, Dialog, DialogTitle, DialogContent, MenuItem} from '@material-ui/core';
import {connect} from 'react-redux';
import GenericMediaCard from '../../Room/GenericMediaCard/GenericMediaCard';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import {setMediaStreamConstraints, startLocalStream, stopLocalStream, toggleCameraEnabled, toggleMicrophoneEnabled} from '../../../store/actions/localStream.actions';

const useStyles = makeStyles({
  wrapper: {
    textAlign: 'center'
  },
  containerForm: {
    maxWidth: '95vw'
  },
  formControl: {
    display: 'block'
  },
  select: {
    width: '100%',
    marginBottom: '1rem'
  }
});

const MediaPreview = ({ dispatch, localStreamWrapper, mediaConstraints }) => {
  const classes = useStyles();

  const [microphones, setMicrophones] = useState(null);
  const [cameras, setCameras] = useState(null);

  const [currentMicrophone, setCurrentMicrophone] = useState(null);
  const [currentCamera, setCurrentCamera] = useState(null);

  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    initListOfDevices();
  }, []);

  useEffect(() => {
    handleSaveSettings();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCamera, currentMicrophone]);

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
      if (audioTrack && microphones) {
        const audioDevice = microphones.find(d => d.label === audioTrack.label);
        if (audioDevice) {
          setCurrentMicrophone(audioDevice);
        }
      }
      const videoTrack = localStreamWrapper.stream.getVideoTracks()[0];
      if (videoTrack && cameras) {
        const videoDevice = cameras.find(d => d.label === videoTrack.label);
        if (videoDevice) {
          setCurrentCamera(videoDevice);
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
    setMicrophones(devices.filter((device) => device.kind === 'audioinput'));
    setCameras(devices.filter((device) => device.kind === 'videoinput'));
  };

  const handleChangeCurrentAudioDevice = evt => {
    const selectedLabel = evt.target.value;
    const selectedDevice = microphones.find(d => d.label === selectedLabel);
    setCurrentMicrophone(selectedDevice || null);
  };

  const handleChangeCurrentVideoDevice = evt => {
    const selectedLabel = evt.target.value;
    const selectedDevice = cameras.find(d => d.label === selectedLabel);
    setCurrentCamera(selectedDevice || null);
  };

  const handleClickOpen = async () => {
    setSettingsOpen(true);
  };

  const handleClose = () => {
    setSettingsOpen(false);
  };

  const handleSaveSettings = async () => {
    const newConstraints = { ...mediaConstraints };
    if (currentMicrophone) {
      newConstraints.audio = { ...newConstraints.audio, deviceId: currentMicrophone.deviceId };
    }

    if (currentCamera) {
      newConstraints.video = { ...newConstraints.video, deviceId: currentCamera.deviceId };
    }

    if (currentMicrophone && currentCamera) {
      await dispatch(setMediaStreamConstraints(newConstraints));
    }
  };

  return (
    <Box className={classes.wrapper}>
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
                  value={currentMicrophone ? currentMicrophone.label : ''}
                  onChange={handleChangeCurrentAudioDevice}
                  input={<Input id="select-mic"/>}
                >
                  {microphones && microphones.map((mic, i) => <MenuItem key={mic.groupId + i} value={mic.label}>{mic.label}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="select-cam">Video Input (Camera)</InputLabel>
                <Select
                  className={classes.select}
                  value={currentCamera ? currentCamera.label : ''}
                  onChange={handleChangeCurrentVideoDevice}
                  input={<Input id="select-cam"/>}
                >
                  {cameras && cameras.map((cam, i) => <MenuItem key={cam.groupId + i} value={cam.label}>{cam.label}</MenuItem>)}
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
  return {
    localStreamWrapper: state.localUser.mediaStream,
    mediaConstraints: state.localUser.mediaConstraints
  };
};

export default connect(mapStateToProps)(MediaPreview);
