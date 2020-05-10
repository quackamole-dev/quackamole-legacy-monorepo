import React, {useEffect, useRef, useState} from 'react';
import {connect} from "react-redux";
import RemoteMediaCard from "../RemoteMediaCard/RemoteMediaCard";

const RemoteMediaManager = ({localPeer, localStream, connections}) => {
    return (
        <>
            {localPeer && localStream && connections && connections.map(connection => {
                return <RemoteMediaCard key={connection.connectionId} localPeer={localPeer} localStream={localStream} connection={connection} />
            })
            }
        </>
    );
};


const mapStateToProps = (state) => ({
    connections: Object.values(state.connections.data)
});

export default connect(mapStateToProps)(RemoteMediaManager);
