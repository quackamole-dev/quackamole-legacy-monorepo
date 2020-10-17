import React from 'react';
import {Box, Button} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import RoomSidebarMenu from '../RoomSidebarMenu/RoomSidebarMenu';
import RoomSidebarChat from '../RoomSidebarChat/RoomSidebarChat';
import {Link} from 'react-router-dom';

// TODO actionbar needs some rework.
const RoomActionbar = () => {
  return (
    <Box
      bgcolor={'#f5deb3eb'}
      height={'10%'}
      display='flex'
      justifyContent={'center'}
      borderTop={'1px solid #0000003b'}
      alignItems={'center'}
    >
      <RoomSidebarMenu/>
      <Link to={'/'} style={{ height: '100%' }}>
        <Button style={{ height: '100%' }}>
          <HomeIcon color='primary' fontSize='large'/>
        </Button>
      </Link>
      <RoomSidebarChat/>
    </Box>
  );
};

export default RoomActionbar;
