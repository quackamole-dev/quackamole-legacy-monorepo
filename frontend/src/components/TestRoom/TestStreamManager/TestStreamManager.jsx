import React, {useEffect, useRef, useState} from 'react';
import {connect} from "react-redux";

const TestStreamManager = ({localPeer, connections}) => {
    const [streams, setStreams] = useState([]);

    let videoRef1 = useRef(null);
    let videoRef2 = useRef(null);
    let videoRef3 = useRef(null);
    let videoRef4 = useRef(null);

    const startLocalStream = async () => {
        try {
            let mediaStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            // TODO replace with method in link:  https://stackoverflow.com/questions/54940399/how-target-dom-with-react-useref-in-map
            setStreams(streams.concat(mediaStream));

            console.log('local stream started', streams);
        } catch (error) {
            console.error('stream couldnt be started via "startStream()"', error);
        }
    };

    const initCallListeners = () => {
        if (localPeer) {
            localPeer.on('call', remoteCall => {
                console.log('incoming call. Answering automatically');
                remoteCall.on('stream', remoteMediaStream => {
                    // setStre
                });
            });
        }
    };

    useEffect(() => {
        if (localPeer && localPeer.id) {
            initCallListeners();
            startLocalStream();
        }
    }, [localPeer]);

    // set src of <video> to remote stream when available
    useEffect(() => {
        console.log('useEffect streams', streams, videoRef1);
        const refs = [videoRef1, videoRef2, videoRef3, videoRef4];


        streams.forEach((stream, i) => {
            const video = refs[i];
            if (video.current && stream) {
                video.current.srcObject = stream;
                video.current.oncanplay = () => {
                    video.current.play();
                    video.current.muted = true; // set to false to hear/test your own audio
                };
            }
        });


    }, [streams]);

    return (
        <div>
            <video ref={videoRef1} />
            <video ref={videoRef2} />
            <video ref={videoRef3} />
            <video ref={videoRef4} />
        </div>
    );
};


const mapStateToProps = (state) => ({
    connections: Object.values(state.connections.data)
});

export default  connect(mapStateToProps)(TestStreamManager);
