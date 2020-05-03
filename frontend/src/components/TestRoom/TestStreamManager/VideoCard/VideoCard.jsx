import React, {useEffect, useRef, useState} from 'react';

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
        if (videoRef.current && remoteStream) {
            console.log('useEFECT srcset, remote stream', remoteStream);
            videoRef.current.srcObject = remoteStream;
            videoRef.current.oncanplay = () => {
                videoRef.current.play();
                videoRef.current.muted = false; // set to false to hear/test your own audio
            };
        }
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
