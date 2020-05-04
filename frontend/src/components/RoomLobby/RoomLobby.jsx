import React from 'react';
import {Link} from "react-router-dom";
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import theme from '../../style/theme/MainTheme';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

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

const RoomLobby = () => {
    const [name, setName] = React.useState('');
    const [link, setLink] = React.useState('');
    const classes = useStyles();

    const handleChangeName = (e) => {
        setName(e.target.value)
    };

    const handleChangeLink = (e) => {
        setLink(e.target.value)
    };

    return (
        <ThemeProvider theme={theme}>
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
            <Container
                className={classes.containerStyle}
            >
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
                >Enter the rooom
                </Typography>
                
                <TextField
                    required
                    id="outlined-required"
                    label="Nickname"
                    variant="outlined"
                    value={name}
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
                    <Button
                        size="large"
                        color="secondary"
                        variant="contained"
                        className={classes.nextButton}                     
                    >
                            join
                    </Button>
                </div>
                </Box>
            </Container>
        </ThemeProvider>
    )
};

export default RoomLobby;
