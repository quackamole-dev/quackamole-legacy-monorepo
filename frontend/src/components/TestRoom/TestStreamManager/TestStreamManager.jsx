import React, {useCallback, useEffect, useRef, useState} from 'react';
import {connect} from "react-redux";
import VideoCard from "./VideoCard/VideoCard";
import {setVideoSrc} from "../../../utils";

const TestStreamManager = ({localPeer, connections}) => {
    const [localStream, setLocalStream] = useState(null);
    const localVideoRef = useRef(null);

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

    // set src of <video> to remote stream when available
    useEffect(() => {
        if (localStream) {
            setVideoSrc(localVideoRef, localStream, true);
        }
    }, [localStream]);

    return (
        <div>
            <video ref={localVideoRef}/>
            {localStream && connections && connections.map(connection => <VideoCard localPeer={localPeer} localStream={localStream} connection={connection}/>)}
        </div>
    );
};


const mapStateToProps = (state) => ({
    connections: Object.values(state.connections.data)
});

export default  connect(mapStateToProps)(TestStreamManager);
