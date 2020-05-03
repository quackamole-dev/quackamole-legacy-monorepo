import React, {useEffect, useRef, useState} from 'react';
import {connect} from "react-redux";

const TestStreamManager = ({localPeer, connections}) => {
    const [streams, setStreams] = useState([]);

    // TODO replace individual refs with method in link:  https://stackoverflow.com/questions/54940399/how-target-dom-with-react-useref-in-map
    //  This is stupid but react makes it kinda hard to use refs dynamically, so this has to do for now... (╯°□°)╯︵ ┻━┻
    let videoRef1 = useRef(null);
    let videoRef2 = useRef(null);
    let videoRef3 = useRef(null);
    let videoRef4 = useRef(null);

    const startLocalStream = async () => {
        try {
            let mediaStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
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
                    setStreams(streams.concat(remoteMediaStream));
                    console.log('-------------------remote stream after call available', remoteMediaStream, 'streams', streams);

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
                    video.current.muted = false; // set to false to hear/test your own audio
                };
            }
        });


    }, [streams]);

    const startCall = () => {
        if (localPeer && streams[0]) {
            connections.forEach(connection => {
                console.log('calling', connection.peer, 'stream', streams[0]);
                localPeer.call(connection.peer, streams[0]);
            })
        }
    };

    const handleStartCall = e => {
        startCall();
    };

    return (
        <div>
            <button onClick={handleStartCall}>CALL all connections</button>
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
