import React, {useCallback, useEffect, useState} from 'react';
import {connect} from "react-redux";
import VideoCard from "./VideoCard/VideoCard";

const TestStreamManager = ({localPeer, connections}) => {
    const [localStream, setLocalStream] = useState(null);

    const startLocalStream = async () => {
        try {
            let mediaStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            setLocalStream(mediaStream);
        } catch (error) {
            console.error('local stream couldnt be started via "startStream()"', error);
        }
    };

    useEffect(() => {
        if (localPeer && localPeer.id) {
            startLocalStream();
        }
    }, [localPeer]);

    return (
        <div>
            {localStream && connections && connections.map(connection => <VideoCard localPeer={localPeer} localStream={localStream} connection={connection}/>)}
        </div>
    );
};


const mapStateToProps = (state) => ({
    connections: Object.values(state.connections.data)
});

export default  connect(mapStateToProps)(TestStreamManager);
