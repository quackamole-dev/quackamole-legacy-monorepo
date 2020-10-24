import React, {useState} from 'react';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {List, ListItem, ListItemIcon, ListItemText, Divider, Button, Drawer} from '@material-ui/core';
import LabelIcon from '@material-ui/icons/Label';
import WidgetsOutlinedIcon from '@material-ui/icons/WidgetsOutlined';
import MenuIcon from '@material-ui/icons/Menu';
import theme from '../../../style/theme/MainTheme';
import {setPlugin} from '../../../store/actions/plugin.actions';
import {connect} from 'react-redux';

const useStyles = makeStyles({
  list: {
    width: 250
  },
  menuIcon: {
    margin: '8px'
  }
});

// TODO this data will be served by the backend in future releases. Not real plugins except first one in the list
const plugins = [
  { name: 'Random number', url: 'https://andreas-schoch.github.io/p2p-test-plugin/' },
  { name: 'Paint', url: 'https://andreas-schoch.github.io/quackamole-plugin-paint/' },
  { name: 'Gomoku', url: 'https://quackamole-dev.github.io/quackamole-plugin-gomoku/' },
  { name: '2d Shooter (WIP)', url: 'https://andreas-schoch.github.io/quackamole-plugin-2d-topdown-shooter/' },
  { name: 'Breakout game', url: 'https://andreas-schoch.github.io/breakout-game/' }
];

const RoomSidebarMenu = ({ plugin, setPlugin }) => {
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
    setPlugin(plugin ? { ...plugin, ...plugins[index] } : plugins[index]);
  };

  const list = () => (
    <div className={classes.list} role="presentation" onClick={toggleDrawer}>
      <List>
        {plugins.map(({ name }, i) => (
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

export default connect(mapStateToProps, { setPlugin })(RoomSidebarMenu);
