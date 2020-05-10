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
            // monkey patching reference to localStream to be able to disable camera use on unmount, as the reference in the localstate is already gone
            window.localStream = mediaStream;
        } catch (error) {
            console.error('local stream couldnt be started via "startStream()"', error);
        }
    };

    useEffect(() => {
        // unmount
        console.log('mount TestStreamManager');
        return () => {
            // stop browser from using the users camera & microphone
            console.log('unmount TestStreamManager, disable localStream:', localStream, window.localStream);
            if (window.localStream) {
                window.localStream.getTracks().forEach((track) => track.stop());
            }
        }
    }, []);

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
            {localStream && connections && connections.map(connection => <VideoCard key={connection.connectionId} localPeer={localPeer} localStream={localStream} connection={connection}/>)}
        </div>
    );
};


const mapStateToProps = (state) => ({
    connections: Object.values(state.connections.data)
});

export default  connect(mapStateToProps)(TestStreamManager);
