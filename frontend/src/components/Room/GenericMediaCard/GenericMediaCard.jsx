import React, {useEffect, useRef} from 'react';
import {setVideoSrc} from '../../../utils';
import {makeStyles} from '@material-ui/core/styles';
import {Card, CircularProgress, Box} from '@material-ui/core';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  cardWrapper: {
    position: 'relative',
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '5px',
    width: '100%',
    height: '130px'
  },
  videoOffIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  media: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  displayName: {
    color: 'white',
    opacity: '0.8',
    position: 'absolute',
    bottom: '5px',
    left: '5px',
    fontSize: '0.9rem',
    userSelect: 'none'
  }
}));

const GenericMediaCard = ({ stream, muted = false, user }) => {
  const classes = useStyles();
  const videoRef = useRef(null);
  const { nickname } = user;

  useEffect(() => {
    setVideoSrc(videoRef, stream, muted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);

  return (
    <Card className={classes.cardWrapper}>
      {stream
        ? <video ref={videoRef} className={classes.media}/>
        : <CircularProgress color="inherit"/>
      }

      {stream && !stream.getVideoTracks()[0] && <VideocamOffIcon className={classes.videoOffIcon} color='primary' fontSize='large'/>}
      <Box className={classes.displayName}>{nickname}</Box>
    </Card>
  );
};

export default GenericMediaCard;
