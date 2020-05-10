import React, {useEffect, useRef, useState} from 'react';
import {connect} from "react-redux";
import GenericMediaCard from "./GenericMediaCard/GenericMediaCard";
import {Box, Card, makeStyles} from "@material-ui/core";
import {setVideoSrc} from "../../../utils";
import RemoteMediaManager from "./RemoteMediaManager/RemoteMediaManager";


const RoomMediaManager = ({localPeer}) => {
    const [localStream, setLocalStream] = useState(null);
    const localVideoRef = useRef(null);

    const startLocalStream = async () => {
        try {
            let mediaStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            setLocalStream(mediaStream);
            window.localStream = mediaStream;
        } catch (error) {
            console.error('local stream couldnt be started via "startStream()"', error);
        }
    };

    useEffect(() => {
        // unmount
        return () => {
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
        <Box bgcolor='lightblue' width={'20%'} minWidth={'150px'}>
            <GenericMediaCard stream={localStream} muted={true} user={{nickname: 'local'}}/>
            <RemoteMediaManager localPeer={localPeer} localStream={localStream} />
        </Box>
    );
};


export default RoomMediaManager;
