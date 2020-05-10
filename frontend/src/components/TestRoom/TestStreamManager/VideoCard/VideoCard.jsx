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
            console.log('-----------------ONCALL', call);
            if (call.peer === connection.peer) {
                call.answer(localStream);
                handleOnStream(call);
            } else {
                console.log('call doesnt match connectionId, call:', call,'connection:', connection)
            }
        });
    };

    useEffect(() => {
        if (localPeer && localPeer.id) {
            initCallListeners();
            handleStartCall();
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
            {console.log('videoCard rerender, connection', connection)}
            <video ref={videoRef}/>
        </div>
    );
};

export default VideoCard;
