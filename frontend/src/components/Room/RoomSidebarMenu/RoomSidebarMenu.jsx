import React, {useState} from 'react';
import {ThemeProvider, makeStyles} from '@material-ui/core/styles';
import LabelIcon from '@material-ui/icons/Label';
import WidgetsOutlinedIcon from '@material-ui/icons/WidgetsOutlined';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import theme from '../../../style/theme/MainTheme';

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    menuIcon: {
        margin: '8px'
    }
});

const RoomSidebarMenu = () => {
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
            <List>
                {['Plugin 1', 'Plugin 2', 'Plugin 3', 'Plugin 4'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon><LabelIcon/></ListItemIcon>
                        <ListItemText primary={text}/>
                    </ListItem>
                ))}
            </List>
            <Divider/>
            <List>
                <ListItem button>
                    <ListItemIcon><WidgetsOutlinedIcon/></ListItemIcon>
                    <ListItemText primary={'Browse Plugins'}/>
                </ListItem>
            </List>
        </div>
    );

    return (
        <ThemeProvider theme={theme}>
            <Button>
                <MenuIcon onClick={toggleDrawer} color='primary' fontSize='large' className={classes.menuIcon}/>
                <Drawer open={open} onClose={toggleDrawer} anchor={'left'}>
                    {list()}
                </Drawer>
            </Button>
        </ThemeProvider>
    );
};

export default RoomSidebarMenu;
