import React from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import {CssBaseline} from '@material-ui/core';
import RoomLobby from '../RoomLobby/RoomLobby';
import Room from '../Room/Room';
import Home from '../Home/Home';
import RoomCreateForm from '../RoomCreateForm/RoomCreateForm';
import {ThemeProvider} from '@material-ui/core/styles';
import theme from '../../style/theme/MainTheme';

const App = () => {
  return (
    <CssBaseline>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/create-room' component={RoomCreateForm}/>
            <Route exact path='/room-lobby/:roomId' component={RoomLobby}/>
            <Route path='/rooms/:roomId' component={Room}/>
          </Switch>
        </Router>
      </ThemeProvider>
    </CssBaseline>
  );
};

export default App;
