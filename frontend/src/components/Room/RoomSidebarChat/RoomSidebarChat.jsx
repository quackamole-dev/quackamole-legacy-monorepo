import React, {useState} from 'react';
import {Button, Drawer} from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import Chat from './Chat/Chat';

const RoomSidebarChat = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = _ => setOpen(!open);

  return (
    <div>
      <Button onClick={toggleDrawer}>
        <ChatIcon color='primary' fontSize='large'/>
      </Button>
      <Drawer open={open} onClose={toggleDrawer} anchor={'right'}>
        <Chat/>
      </Drawer>
    </div>
  );
};

export default RoomSidebarChat;
