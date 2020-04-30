import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import RoomLobby from "../RoomLobby/RoomLobby";
import Room from "../Room/Room";
import Home from "../Home/Home";
import RoomCreateForm from "../RoomCreateForm/RoomCreateForm";
import CssBaseline from "@material-ui/core/CssBaseline";
import TestRoom from "../TestRoom/TestRoom";

const App = () => {
    return (
        <CssBaseline>
            <Router>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/create-roomReducer' component={RoomCreateForm} />
                    <Route exact path='/roomReducer-lobby/:roomId' component={RoomLobby} />
                    <Route path='/rooms/:roomId' component={Room} />
                    <Route path='/test-roomReducer' component={TestRoom} />
                </Switch>
            </Router>
        </CssBaseline>
    );
};

export default App;
