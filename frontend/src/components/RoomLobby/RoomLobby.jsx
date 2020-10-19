import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {Box, Button, Grid, TextField, Typography} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import theme from '../../style/theme/MainTheme';
import {resetLocalUser, setMetadata} from '../../store/actions/localUser.actions';
import {connect} from 'react-redux';
import {setCurrentRoomError} from '../../store/actions/room.actions';

const useStyles = makeStyles({
  containerStyle: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '128px'
  },
  titleStyle: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    padding: '16px',
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#388E3C'
  },
  nicknameStyle: {
    width: '90%',
    margin: '16px'
  },
  textfieldLink: {
    width: '90%',
    marginRight: '16px',
    marginLeft: '16px'
  },
  nextButton: {
    color: 'white',
    boxShadow: 'none',
    width: '100%'

  },
  alignbutton: {
    display: 'flex',
    justifyContent: 'center',
    width: '80%',
    marginTop: '24px',
    marginBottom: '24px'
  }
});

const RoomLobby = ({ history, match, setMetadata, nickname, roomError, setCurrentRoomError, resetLocalUser }) => {
  const [newNickname, setNewNickname] = useState(nickname);
  const [link, setLink] = useState(match.params.roomId);
  const classes = useStyles();

  const handleChangeName = (e) => {
    setNewNickname(e.target.value);
  };

  const handleChangeLink = (e) => {
    setLink(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJoin();
    }
  };

  const handleJoin = (e) => {
    setMetadata({ nickname: newNickname });
    setCurrentRoomError(null);
    resetLocalUser();
    history.push(`/rooms/${match.params.roomId}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box display='flex' height={63} bgcolor='#2E7D32' alignItems='center' paddingLeft='36px'>
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}><ArrowBackIosIcon/></Link>
      </Box>
      <Grid container className={classes.containerStyle}>
        <Grid item xs={11} md={6} lg={5}>
          <Box display='flex' flexDirection='column' alignItems='center' width={'100%'} borderRadius='5px' bgcolor='white'>
            <Typography variant='h4' className={classes.titleStyle}>Enter the room</Typography>
            <TextField
              required
              label="Nickname"
              variant="outlined"
              value={newNickname}
              className={classes.nicknameStyle}
              onChange={handleChangeName}
              onKeyPress={handleKeyPress}
              autoFocus
            />
            <TextField
              required
              label="Room ID"
              variant="outlined"
              value={link}
              className={classes.textfieldLink}
              onChange={handleChangeLink}
            />
            <div className={classes.alignbutton}>
              <Button onClick={handleJoin} size="large" color="secondary" variant="contained" className={classes.nextButton}>
                join
              </Button>
            </div>
            {roomError && <Box color={'red'} textAlign={'center'}>{roomError.error.message}</Box>}
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => ({
  nickname: state.localUser.metadata.nickname || '',
  roomError: state.room.error
});

export default connect(mapStateToProps, { setMetadata, setCurrentRoomError, resetLocalUser })(RoomLobby);
