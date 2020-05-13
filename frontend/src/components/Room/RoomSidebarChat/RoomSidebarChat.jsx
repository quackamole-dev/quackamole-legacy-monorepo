import React, {useState} from 'react';
import {ThemeProvider, makeStyles} from '@material-ui/core/styles';
import ChatIcon from '@material-ui/icons/Chat';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import theme from '../../../style/theme/MainTheme';

const useStyles = makeStyles({
    list: {
        width: 350,
    },
    chatIcon: {
        margin: '8px'
    }
});

const RoomSidebarChat = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const toggleDrawer = (event) => {
        if (event.type === 'keydown') {
            return;
        }
        setOpen(!open);
    };

    const list = () => (
        <div className={classes.list} role="presentation" onClick={toggleDrawer}>
            {/* TODO create a chat component, that gets it's data from redux, render it here */}
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
