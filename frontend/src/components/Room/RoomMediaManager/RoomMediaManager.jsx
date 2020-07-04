import React from 'react';
import {connect} from "react-redux";
import GenericMediaCard from "../GenericMediaCard/GenericMediaCard";
import {Box, makeStyles} from "@material-ui/core";
import RemoteMediaManager from "./RemoteMediaManager/RemoteMediaManager";

const useStyles = makeStyles((theme) => ({
    roomMediaManager: {
        padding: '5px',
        backgroundColor: '#f5deb340',
        borderLeft: '1px solid #0000003b'
    },
}));

const RoomMediaManager = ({localStream, localPeerMetadata}) => {
    const classes = useStyles();

    return (
        <Box bgcolor='lightblue' width={'220px'} minWidth={'150px'} className={classes.roomMediaManager}>
            <GenericMediaCard stream={localStream} muted={true} user={{nickname: localPeerMetadata.nickname}}/>
            <RemoteMediaManager />
        </Box>
    );
};

const mapStateToProps = (state) => {
    const localPeer = state.localUser.peer;
    const localStream = localPeer ? state.streams.data[localPeer.id] : null;
    return {
        localPeerMetadata: state.localUser.metadata,
        localStream: localStream,
    }
};

export default connect(mapStateToProps, {})(RoomMediaManager);
