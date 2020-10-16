import React from 'react';
import {Link} from "react-router-dom";
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import theme from '../../style/theme/MainTheme';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {API_BASE_URL, HTTPS_ENABLED, FRONTEND_URL, PORT_SOCKET, IS_LOCALHOST} from '../../constants';
import {isIpAddress} from "../../utils";
import Grid from '@material-ui/core/Grid';
import {useHistory} from 'react-router-dom';


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
    const [name, setName] = React.useState('');
    const [link, setLink] = React.useState('');
    const [roomId, setRoomId] = React.useState('');
    const [active, setActive] = React.useState(true);
    const classes = useStyles();
    const history = useHistory();

    const handleChangeTexfield = (event) => {
        setName(event.target.value)
    };

    const handleKeyPress = (event) => {
        if (active) {
            if (event.key === 'Enter') {
                createRoom()
            }
        } else {
            history.push(`/room-lobby/${roomId}`)
        }
    };

    const createRoom = () => {
        let data = {
            name: name,
            password: 'Test123.',
            maxUsers: 4
        };

        if(name.length > 0) {
            const protocol = HTTPS_ENABLED ? 'https':'http';
            fetch(`${protocol}://${API_BASE_URL}:${PORT_SOCKET}/api/rooms`, {
                method: 'post',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                  },
            }).then(response => response.json()
            ).then( data => {
                const port = isIpAddress(FRONTEND_URL) || IS_LOCALHOST ? ':3000' : '';
                setLink(`${protocol}://${FRONTEND_URL}${port}/#/room-lobby/${data}`);
                setRoomId(data);
                setActive(false);
            });
        } else {
            console.log('please enter your name')
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
                onKeyPress={handleKeyPress}
                autoFocus
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
                onKeyPress={handleKeyPress}
            >
                <Typography variant='h4' className={classes.titleStyle}>Room was created</Typography>
                <div className={classes.copyLink}>
                    <TextField variant="outlined" value={link} onChange={handleChangeTexfield} className={classes.textfieldLink} minWidth={300} autoFocus/>
                    <Button size="large" color="secondary" variant="contained" className={classes.myButton} onClick={() => {navigator.clipboard.writeText(link)}}>
                        copy
                    </Button>
                </div>
                <Typography variant='h6' align='center' className={classes.subtitle}>
                    Share the link to invite someones to your room
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
