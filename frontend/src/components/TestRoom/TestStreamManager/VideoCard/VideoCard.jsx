import React, {useEffect, useRef, useState} from 'react';
import {setVideoSrc} from "../../../../utils";

const VideoCard = ({localPeer, localStream, connection}) => {
    const [remoteStream, setRemoteStream] = useState(null);
    const videoRef = useRef(null);

    const handleOnStream = (call) => {
        call.on('stream', remoteMediaStream => {
            console.log('ONSTREAM', remoteMediaStream);
            setRemoteStream(remoteMediaStream);
        });
    };

    const initCallListeners = () => {
        localPeer.on('call', call => {
            call.answer(localStream);
            handleOnStream(call);
        });
    };

    useEffect(() => {
        if (localPeer && localPeer.id) {
            initCallListeners();
        }
    }, [localPeer]);

    // set src of <video> to remote stream when available
    useEffect(() => {
        setVideoSrc(videoRef, remoteStream, false);
    }, [remoteStream]);

    const handleStartCall = () => {
        if (localPeer) {
            const call = localPeer.call(connection.peer, localStream);
            handleOnStream(call);
        }
    };

    return (
        <div>
            <button onClick={handleStartCall}>CALL this connection {connection.peer}</button>
            <video ref={videoRef}/>
        </div>
    );
};

export default VideoCard;
