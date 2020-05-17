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
import {setPlugin} from "../../../store/actions/plugin.actions";
import {connect} from "react-redux";

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    menuIcon: {
        margin: '8px'
    }
});

// TODO this data will be served by the backend in future releases. Not real plugins except first one in the list
const plugins = [
    {name: 'Random number', url: 'https://andreas-schoch.github.io/p2p-test-plugin/'},
    {name: 'Breakout game', url: 'https://andreas-schoch.github.io/breakout-game/'},
    {name: 'Todo list', url: 'https://andreas-schoch.github.io/react-todo-app/'},
    {name: 'Karaoke', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'},
];

const RoomSidebarMenu = ({plugin, setPlugin}) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const toggleDrawer = (event) => {
        if (event.type === 'keydown') {
            return;
        }
        setOpen(!open);
    };

    const handleSelectPlugin = (evt) => {
        const index = evt.currentTarget.dataset.index;
        setPlugin(plugin ? {...plugin, ...plugins[index]} : plugins[index]);
    };

    const list = () => (
        <div className={classes.list} role="presentation" onClick={toggleDrawer}>
            <List>
                {plugins.map(({name}, i) => (
                    <ListItem button key={name} onClick={handleSelectPlugin} data-index={i}>
                        <ListItemIcon><LabelIcon/></ListItemIcon>
                        <ListItemText primary={name}/>
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

const mapStateToProps = (state) => ({
    plugin: state.plugin
});

export default connect(mapStateToProps, {setPlugin})(RoomSidebarMenu);
