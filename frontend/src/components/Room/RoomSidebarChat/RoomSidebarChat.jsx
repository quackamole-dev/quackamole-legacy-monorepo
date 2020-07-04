import React, {useState} from 'react';
import {ThemeProvider} from '@material-ui/core/styles';
import ChatIcon from '@material-ui/icons/Chat';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import theme from '../../../style/theme/MainTheme';
import Chat from './Chat/Chat';

const RoomSidebarChat = () => {
    const [open, setOpen] = useState(false);

    const toggleDrawer = _ => setOpen(!open);

    return (
        <ThemeProvider theme={theme}>
            <Button onClick={toggleDrawer}>
                <ChatIcon color='primary' fontSize='large' />
            </Button>
            <Drawer open={open} onClose={toggleDrawer} anchor={'right'}>
                <Chat/>
            </Drawer>
        </ThemeProvider>
    );
};

export default RoomSidebarChat;
