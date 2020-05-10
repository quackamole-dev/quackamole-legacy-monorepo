import React, {useEffect, useRef, useState} from 'react';
import {connect} from "react-redux";
import GenericMediaCard from "../GenericMediaCard/GenericMediaCard";
import {setVideoSrc} from "../../../../utils";

const RemoteMediaCard = ({localPeer, localStream, connection}) => {
    const [remoteStream, setRemoteStream] = useState(null);
    const videoRef = useRef(null);

    const handleOnStream = (call) => {
        call.on('stream', remoteMediaStream => {
            console.log('ONSTREAM', remoteMediaStream);
            setRemoteStream(remoteMediaStream);
        });
    };

    const initCallListeners = () => {
        // FIXME add localPeer and calls to redux to prevent prop drilling
        localPeer.on('call', call => {
            console.log('-----------------ONCALL', call);
            if (call.peer === connection.peer) {
                call.answer(localStream);
                handleOnStream(call);
            } else {
                console.log('call doesnt match connectionId, call:', call, 'connection:', connection)
            }
        });
    };

    useEffect(() => {
        if (localPeer && localPeer.id) {
            initCallListeners();
            handleStartCall();
            console.log('UE handlestartcall');
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
        <GenericMediaCard stream={remoteStream} user={{nickname: 'remote'}} />
    );
};

export default RemoteMediaCard;
