import React from 'react';
import {Link} from "react-router-dom";

const Home = () => {
    return <div>Home
        <Link to={'test-room'} >TestRoom</Link>
    </div>;
};

export default Home;
