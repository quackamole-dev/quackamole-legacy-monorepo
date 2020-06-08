import React from 'react';
import {Link} from "react-router-dom";
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import theme from '../../style/theme/MainTheme';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {API_BASE_URL, SSL_ENABLED, FRONTEND_URL, PORT_SOCKET } from '../../constants';
import {isIpAddress} from "../../utils";

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
        backgroundColor: '#FB8C00',
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
        width: '616px',
        marginLeft: '16px',
        marginTop: 50,
    },
    textfieldLink: {
        width: '506px',
        marginRight: '16px',
        marginLeft: '16px',
    },
    alignButton: {
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '16px'
    },
    myButton: {
        color: 'white',
        boxShadow: 'none'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      },
    copyLink: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '16px'
    },
    nextButton: {
        color: 'white',
        boxShadow: 'none',
        margin: '32px',
        width: '576px'
    },
    subtitle: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '16px'
    }
});

const RoomCreateForm = () => {
    const [status, setStatus] = React.useState('');
    const [name, setName] = React.useState('');
    const [link, setLink] = React.useState('');
    const [roomId, setRoomId] = React.useState('');
    const [active, setActive ] = React.useState(true);
    const classes = useStyles();

    const handleChange = (event) => {
        setStatus(event.target.value);
    };

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

    const copyToClipboard = () =>{
        let mylink = link;
        mylink.select();
        document.execCommand('copy');
    };

    return (
        <ThemeProvider theme={theme}>
            {/* Header */}
            <Box
                display='flex'
                height={63}
                bgcolor='#E53935'
                alignItems='center'
                paddingLeft='36px'
            >
               <Link to="/" style={{ textDecoration: 'none', color: 'white'}}>
                    <ArrowBackIosIcon/>
               </Link>
            </Box>

            {/* Body */}
            <Container
                className={classes.containerStyle}
            >
                {/* create a new room */}
                {active ?  // TODO ternary is too long, making it hard too read, create subcomponents for create and share markup
                <Box
                    display='flex'
                    flexDirection='column'
                    width={648}
                    height={307}
                    borderRadius='5px'
                    bgcolor='white'
                >
                    <Typography
                        variant='h4'
                        className={classes.titleStyle}
                    >Create a new room
                    </Typography>

                    {/* Add status plublic or privat */}
{/*
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
                        <Select

                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={status}
                        onChange={handleChange}
                        label="Status"
                        className={classes.select}
                        >
                        <MenuItem value={'Privat'}>Privat</MenuItem>
                        <MenuItem value={'Public'}>Public</MenuItem>
                        </Select>
                    </FormControl> */}

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
                </Box> :

                // share your room
                <Box
                display='flex'
                flexDirection='column'
                width={648}
                height={307}
                borderRadius='5px'
                bgcolor='white'
                >
                <Typography
                    variant='h4'
                    className={classes.titleStyle}
                >Room was created
                </Typography>

                <div className={classes.copyLink}>
                    <TextField
                        variant="outlined"
                        value={link}
                        onChange={handleChangeTexfield}
                        className={classes.textfieldLink}
                    />
                    <Button
                        size="large"
                        color="secondary"
                        variant="contained"
                        className={classes.myButton}
                        onClick={() => {navigator.clipboard.writeText(link)}}
                    >
                        copy
                    </Button>
                </div>
                <Typography
                        variant='h6'
                        className={classes.subtitle}
                    > Share your link and invite someone to your room
                </Typography>

                <Link to={`/room-lobby/${roomId}`} style={{ textDecoration: 'none',}}>
                 <Button
                    size="large"
                    color="secondary"
                    variant="contained"
                    className={classes.nextButton}
                   >
                        next
                </Button>
                </Link>
               </Box>
            }
            </Container>
        </ThemeProvider>
    )
};

export default RoomCreateForm;
