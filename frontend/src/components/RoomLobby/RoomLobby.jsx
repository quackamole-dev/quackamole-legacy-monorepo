import React, {useState} from 'react';
import {Link} from "react-router-dom";
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import theme from '../../style/theme/MainTheme';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {setMetadata} from "../../store/actions/localUser.actions";
import {connect} from "react-redux";

const useStyles = makeStyles ({
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
    nicknameStyle: {
        width: '616px',
        margin: '16px',
    },
    textfieldLink: {
        width: '616px',
        marginRight: '16px',
        marginLeft: '16px',
    },
    nextButton: {
        color: 'white',
        boxShadow: 'none',
        width: '422px',

    },
    alignbutton: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '24px',
    }
});

const RoomLobby = ({history, match, setMetadata, nickname, roomError}) => {
    const [newNickname, setNewNickname] = useState(nickname);
    const [link, setLink] = useState(match.params.roomId);
    const classes = useStyles();

    const handleChangeName = (e) => {
        setNewNickname(e.target.value)
    };

    const handleChangeLink = (e) => {
        setLink(e.target.value)
    };

    const handleJoin = (e) => {
        setMetadata({nickname: newNickname});
        history.push(`/rooms/${match.params.roomId}`);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box display='flex' height={63} bgcolor='#E53935' alignItems='center' paddingLeft='36px'>
                <Link to="/" style={{ textDecoration: 'none', color: 'white'}}>
                    <ArrowBackIosIcon/>
                </Link>
            </Box>
            <Container className={classes.containerStyle}>
                <Box display='flex' flexDirection='column' width={648} height={307} borderRadius='5px' bgcolor='white'>
                    <Typography variant='h4' className={classes.titleStyle}>Enter the room</Typography>
                    <TextField
                        required
                        id="outlined-required"
                        label="Nickname"
                        variant="outlined"
                        value={newNickname}
                        className={classes.nicknameStyle}
                        onChange={handleChangeName}
                     />
                    <TextField
                        required
                        id="outlined-required"
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
            </Container>
        </ThemeProvider>
    )
};

const mapStateToProps = (state, props) => ({
    nickname: state.localUser.metadata.nickname || '',
    roomError: state.room.error
});

export default connect(mapStateToProps, {setMetadata})(RoomLobby);
