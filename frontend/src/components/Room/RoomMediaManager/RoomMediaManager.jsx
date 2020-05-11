import React, {useEffect, useRef, useState} from 'react';
import {connect} from "react-redux";
import GenericMediaCard from "./GenericMediaCard/GenericMediaCard";
import {Box, Card, makeStyles} from "@material-ui/core";
import {setVideoSrc} from "../../../utils";
import RemoteMediaManager from "./RemoteMediaManager/RemoteMediaManager";
import streamStore from "../../../store/streamStore";
import {startLocalStream} from "../../../store/actions/streams.actions";

const useStyles = makeStyles((theme) => ({
    roomMediaManager: {
        padding: '5px',
    },
}));

const RoomMediaManager = ({localPeer, localStream, startLocalStream}) => {
    const classes = useStyles();
    const localVideoRef = useRef(null);

    useEffect(() => {
        return () => {
            // unmount
            streamStore.clearAllStreams();
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
        <Box bgcolor='lightblue' width={'200px'} minWidth={'150px'} className={classes.roomMediaManager}>
            {console.log('localStream--', localStream)}
            <GenericMediaCard stream={localStream} muted={true} user={{nickname: 'local'}}/>
            <RemoteMediaManager localPeer={localPeer} localStream={localStream} />
        </Box>
    );
};

const mapStateToProps = (state) => {
    const localPeer = state.localUser.peer;
    // const localStreamActive = state.streams.data[localPeer];
    const localStream = localPeer ? streamStore.getStream(localPeer.id) : null;
    return {
        localPeer: state.localUser.peer,
        // localStreamActive: localStreamActive,
        localStream: localStream
    }
};

export default connect(mapStateToProps, {startLocalStream})(RoomMediaManager);
