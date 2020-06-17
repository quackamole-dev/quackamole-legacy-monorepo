import React from 'react';
import {Link} from "react-router-dom";
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import theme from '../../style/theme/MainTheme';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {API_BASE_URL, SSL_ENABLED, FRONTEND_URL, PORT_SOCKET } from '../../constants';
import {isIpAddress} from "../../utils";
import Grid from '@material-ui/core/Grid';

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
            borderColor: '#FB8C00',
        },
        '&:after': {
            borderColor: '#f57c00',
        }
    },
    textfield: {
        width: '90%',
        marginTop: '48px',
    },
    textfieldLink: {
        width: '90%',
        marginRight: '16px',
        marginLeft: '16px',
    },
    alignButton: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        margin: '16px',
    },
    myButton: {
        color: 'white',
        boxShadow: 'none',
        margin: '16px',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
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
    const [status, setStatus] = React.useState('');
    const [name, setName] = React.useState('');
    const [link, setLink] = React.useState('');
    const [roomId, setRoomId] = React.useState('');
    const [active, setActive ] = React.useState(true);
    const classes = useStyles();

    const handleChangeTexfield = (event) => {
        setName(event.target.value)
    };

    const createRoom = () => {
        let data = {
            name: name,
            password: 'Test123.',
            maxUsers: 4,
            status: status
        };

        if(name.length > 0) {
            const protocol = SSL_ENABLED ? 'https':'http';
            fetch(`${protocol}://${API_BASE_URL}:${PORT_SOCKET}/api/rooms`, {
                method: 'post',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                  },
            }).then(response => response.json()
            ).then( data => {
                const port = isIpAddress(FRONTEND_URL) ? '3000' : ''; // TODO temp fix for gh-pages. remove once frontend is served via proxy by real domain
                setLink(`${protocol}://${FRONTEND_URL}:${port}/#/room-lobby/${data}`);
                setRoomId(data);
                setActive(false);
            });
        } else {
            console.log('error')
        }
    };

    const createRoomComponent =
        <Box display='flex' flexDirection='column' alignItems='center' width={'100%'} borderRadius='5px' bgcolor='white'>
            <Typography variant='h4' className={classes.titleStyle}>Create a new room</Typography>
            <TextField
                required
                id="outlined-required"
                label="Room name"
                variant="outlined"
                value={name}
                onChange={handleChangeTexfield}
                className={classes.textfield}
            />
            <div className={classes.alignButton}>
                <Button
                    size="large"
                    color="secondary"
                    variant="contained"
                    className={classes.myButton}
                    onClick={createRoom}
                >
                    create
                </Button>
            </div>
        </Box>;


    const shareRoomComponent =
            <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                width={'100%'}
                borderRadius='5px'
                bgcolor='white'
            >
                <Typography variant='h4' className={classes.titleStyle}>Room was created</Typography>
                <div className={classes.copyLink}>
                    <TextField variant="outlined" value={link} onChange={handleChangeTexfield} className={classes.textfieldLink}/>
                    <Button size="large" color="secondary" variant="contained" className={classes.myButton} onClick={() => {navigator.clipboard.writeText(link)}}>
                        copy
                    </Button>
                </div>
                <Typography variant='h6' align='center' className={classes.subtitle}>
                    Share your link and invite someone to your room
                </Typography>

                <Link to={`/room-lobby/${roomId}`} style={{ textDecoration: 'none', width: '80%'}}>
                <Button
                    size="large"
                    color="secondary"
                    variant="contained"
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
               <Link to="/" style={{ textDecoration: 'none', color: 'white'}}>
                    <ArrowBackIosIcon/>
               </Link>
            </Box>

            {/* Body */}
            <Grid container className={classes.containerStyle}>
                <Grid item xs={11} md={6} lg={5}>
                   {active ? createRoomComponent : shareRoomComponent}
                </Grid>
            </Grid>
        </ThemeProvider>
    )
};

export default RoomCreateForm;
