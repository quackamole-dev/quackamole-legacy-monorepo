import React from 'react';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import theme from '../../style/theme/MainTheme';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  menuIcon: {
      margin: '8px'
  }
});

const Room = () => {
    const classes = useStyles();
    const [state, setState] = React.useState(false)  

    const toggleDrawer = (event) => {    
        if (event.type === 'keydown') {
            return;
          }

        setState(!state);
      };

    const list = () => (
        <div
        className={classes.list}
        role="presentation"
        onClick={toggleDrawer}
        onKeyDown={toggleDrawer}
      >
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    );

    return (
        <ThemeProvider theme={theme}>
        <div>
            <MenuIcon 
                onClick={toggleDrawer} 
                color='primary'
                fontSize='large'
                className={classes.menuIcon}
                />
            <Drawer 
                open={state}  
                onClose={toggleDrawer}
                >
                {list()}
            </Drawer>
        </div>
        </ThemeProvider>
    );
};

export default Room;

