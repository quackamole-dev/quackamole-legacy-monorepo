import React, {useState} from 'react';
import {ThemeProvider} from '@material-ui/core/styles';
import {Button, Drawer} from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import theme from '../../../style/theme/MainTheme';
import Chat from './Chat/Chat';

const RoomSidebarChat = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = _ => setOpen(!open);

  return (
    <ThemeProvider theme={theme}>
      <Button onClick={toggleDrawer}>
        <ChatIcon color='primary' fontSize='large'/>
      </Button>
      <Drawer open={open} onClose={toggleDrawer} anchor={'right'}>
        <Chat/>
      </Drawer>
    </ThemeProvider>
  );
};

export default RoomSidebarChat;
