import React from 'react';
import {Box} from "@material-ui/core";
import RoomSidebarMenu from "../RoomSidebarMenu/RoomSidebarMenu";
import RoomSidebarChat from "../RoomSidebarChat/RoomSidebarChat";
import {Link} from "react-router-dom";

const RoomActionbar = () => {
    return (
        <>
            <Box bgcolor={'#f5deb3eb'} height={'10%'} display='flex' flexDirection='row' width={1} justifyContent={'center'} borderTop={'1px solid #0000003b'}>
                {/* space for some easy access actions like mute, enable camera, chat etc. */}
                <RoomSidebarMenu />
                <RoomSidebarChat />
                <Link to={'/'}>Home</Link>
            </Box>
        </>
    );
};

export default RoomActionbar;
