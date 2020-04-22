import React from 'react';
import Header from '../../components/Header';
import {withRouter} from 'react-router-dom';
import './index.scss'

const Home = (props) => {

    const roomCreateForm = () => {
        props.history.push('/create-room')
    }

    const roomLobby = () => {
        props.history.push('/room-lobby')
    }

    return (
        <div>
            <Header></Header>
            <div className="Main">
                <div className="content left">
                    <button 
                        onClick={roomCreateForm}
                        >
                        Create
                    </button>
                </div>
                <div className="content right"
                    onClick={roomLobby}
                    >
                    <button>
                        Join
                    </button>
                </div>
            </div>
        </div>
    )
};

export default withRouter(Home);
