import React from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import RoomLobby from '../RoomLobby/RoomLobby';
import Room from '../Room/Room';
import Home from '../Home/Home';
import RoomCreateForm from '../RoomCreateForm/RoomCreateForm';
import CssBaseline from '@material-ui/core/CssBaseline';

const App = () => {
  return (
    <CssBaseline>
      <Router>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/create-room' component={RoomCreateForm}/>
          <Route exact path='/room-lobby/:roomId' component={RoomLobby}/>
          <Route path='/rooms/:roomId' component={Room}/>
        </Switch>
      </Router>
    </CssBaseline>
  );
};

export default App;
