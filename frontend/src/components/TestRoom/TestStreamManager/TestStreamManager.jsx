import React, {useEffect, useRef, useState} from 'react';
import {connect} from "react-redux";

const streamsTest = [];
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
            streamsTest.push(mediaStream);
        } catch (error) {
            console.error('local stream couldnt be started via "startStream()"', error);
        }
    };

    const initCallListeners = () => {
        if (localPeer) {
            localPeer.on('call', remoteCall => {
                remoteCall.answer(streams[0]);

                remoteCall.on('remote-----------------------------stream', remoteMediaStream => {
                    const newStreams = [...streams, remoteMediaStream];
                    setStreams(newStreams);
                    streamsTest.push(remoteMediaStream);
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
        const refs = [videoRef1, videoRef2, videoRef3, videoRef4];

        streamsTest.forEach((stream, i) => {
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
                const call = localPeer.call(connection.peer, streams[0]);
                call.on('stream', remoteMediaStream => {
                    const newStreams = [...streams, remoteMediaStream];
                    setStreams(newStreams);
                    streamsTest.push(remoteMediaStream);
                });
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
