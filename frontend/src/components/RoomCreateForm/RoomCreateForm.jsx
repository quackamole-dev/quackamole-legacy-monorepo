import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {Box, Button, Grid, TextField, Typography} from '@material-ui/core';
import theme from '../../style/theme/MainTheme';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  containerStyle: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '128px'
  },
  titleStyle: {
    display: 'flex',
    justifyContent: 'center',
    padding: '16px',
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#388E3C',
    width: '100%'
  },
  formControl: {
    width: '20%',
    margin: '16px'
  },
  select: {
    borderColor: '#FB8C00',
    '&:before': {
      borderColor: '#FB8C00'
    },
    '&:after': {
      borderColor: '#f57c00'
    }
  },
  textfield: {
    width: '90%',
    marginTop: '48px'
  },
  textfieldLink: {
    width: '90%',
    marginRight: '16px',
    marginLeft: '16px'
  },
  alignButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    padding: '16px'
  },
  btnCreateWrapper: {
    position: 'relative'
  },
  btnCreate: {
    color: 'white',
    boxShadow: 'none',
  },
  fabProgress: {
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  btnCreateProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  copyLink: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '16px',
    width: '90%'
  },
  nextButton: {
    color: 'white',
    boxShadow: 'none',
    marginBottom: '16px',
    width: '100%'
  },
  subtitle: {
    display: 'flex',
    justifyContent: 'center',
    margin: '16px'
  }
});

const RoomCreateForm = () => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const classes = useStyles();
  const history = useHistory();

  const handleChangeTexfield = (event) => {
    setName(event.target.value);
  };

  const handleKeyPress = async (evt) => {
    if (!loading && evt.key === 'Enter') {
        if (!roomId) {
          const room = await createRoom();

          if (room) {
            setError(null);
            setRoomId(room.id);
            setLink(`${window.location.origin}/#/room-lobby/${room.id}`);
          }
      } else if (!error && roomId) {
        history.push(`/room-lobby/${roomId}`);
      }


    }
  };

  const createRoom = async () => {
    try {
      let data = {
        name: name,
        password: 'Test123.',
        maxUsers: 4
      };

      if (data.name.length === 0) {
        setError(new Error('The room needs a name'));
        return;
      }

      setLoading(true);
      const res = await fetch(`/api/rooms`, {
        method: 'post',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      setLoading(false);

      if (res.status >= 400) {
        setError(new Error(`Something went wrong. Try again`));
        return;
      }

      return await res.json();
    } catch (err) {
      setError(err);
    }
  };

  const createRoomJSX =
    <Box display='flex' flexDirection='column' alignItems='center' width={'100%'} borderRadius='5px' bgcolor='white'>
      <Typography variant='h4' className={classes.titleStyle}>Create a new room</Typography>
      <TextField
        required
        label='Room name'
        variant='outlined'
        value={name}
        onChange={handleChangeTexfield}
        className={classes.textfield}
        onKeyPress={handleKeyPress}
        autoFocus
      />
      <div className={classes.alignButton}>
        <div className={classes.btnCreateWrapper}>
          <Button
            size='large'
            color='secondary'
            variant='contained'
            disabled={loading}
            className={classes.btnCreate}
            onClick={createRoom}
          >
            Create
          </Button>
            {loading && <CircularProgress size={24} className={classes.btnCreateProgress}/>}
        </div>
      </div>
    </Box>;

  const shareRoomJSX =
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      width={'100%'}
      borderRadius='5px'
      bgcolor='white'
      onKeyPress={handleKeyPress}
    >
      <Typography variant='h4' className={classes.titleStyle}>Room was created</Typography>
      <div className={classes.copyLink}>
        <TextField variant='outlined' value={link} onChange={handleChangeTexfield} className={classes.textfieldLink} minWidth={300} autoFocus/>
        <Button size='large' color='secondary' variant='contained' className={classes.myButton} onClick={() => {
          navigator.clipboard.writeText(link);
        }}>
          copy
        </Button>
      </div>
      <Typography variant='h6' align='center' className={classes.subtitle}>
        Share the link to invite someones to your room
      </Typography>

      <Link to={`/room-lobby/${roomId}`} style={{ textDecoration: 'none', width: '80%' }}>
        <Button
          size='large'
          color='secondary'
          variant='contained'
          className={classes.nextButton}
          to={`/room-lobby/${roomId}`}
        >
          next
        </Button>
      </Link>
    </Box>;

  return (
    <ThemeProvider theme={theme}>
      {/* Header */}
      <Box
        display='flex'
        height={63}
        bgcolor='#2E7D32'
        alignItems='center'
        paddingLeft='36px'
      >
        <Link to='/' style={{ textDecoration: 'none', color: 'white' }}>
          <ArrowBackIosIcon/>
        </Link>
      </Box>

      {/* Body */}
      <Grid container className={classes.containerStyle}>
        <Grid item xs={11} md={6} lg={6}>
        {roomId ? shareRoomJSX : createRoomJSX}
          {error && <Box color={'red'} textAlign={'center'}>{error.message}</Box>}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default RoomCreateForm;
