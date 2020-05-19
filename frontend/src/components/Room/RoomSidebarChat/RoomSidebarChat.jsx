import React, {useState} from 'react';
import {ThemeProvider, makeStyles} from '@material-ui/core/styles';
import ChatIcon from '@material-ui/icons/Chat';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import theme from '../../../style/theme/MainTheme';
import Chat from './Chat/Chat'

const useStyles = makeStyles({
    list: {
        width: 300,
        padding: 10,
    },
    chatIcon: {
        margin: '8px'
    }
});

const RoomSidebarChat = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(true);

    const toggleDrawer = (event) => {
        if (event.type === 'keydown') {
            return;
        }
    };

    const list = () => (
        <div className={classes.list} role="presentation" onClick={toggleDrawer}>
            <Chat/>
        </div>
    );

    return (
        <ThemeProvider theme={theme}>
            <Button>
                <ChatIcon onClick={toggleDrawer} color='primary' fontSize='large' className={classes.chatIcon}/>
                <Drawer open={open} onClose={toggleDrawer} anchor={'right'}>
                    {list()}
                </Drawer>
            </Button>
        </ThemeProvider>
    );
};

export default RoomSidebarChat;
