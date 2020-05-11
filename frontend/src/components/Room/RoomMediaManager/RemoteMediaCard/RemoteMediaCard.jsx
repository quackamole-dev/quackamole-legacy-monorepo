import React, {useEffect} from 'react';
import GenericMediaCard from "../GenericMediaCard/GenericMediaCard";
import {connect} from "react-redux";
import streamStore from "../../../../store/streamStore";
import {addCall} from "../../../../store/actions/calls.actions";

const RemoteMediaCard = ({localPeer, localStream, remoteStream, connection, addCall}) => {

    useEffect(() => {
        if (localPeer && connection && !remoteStream) {
            handleStartCall();
        }
    }, [localPeer, connection]);


    const handleStartCall = () => {
        if (localPeer) {
            const call = localPeer.call(connection.peer, localStream);
            addCall(call);
        }
    };

    return (
        <GenericMediaCard stream={remoteStream} user={{nickname: 'remote'}} />
    );
};

const mapStateToProps = (state, ownProps) => {
    const localPeer = state.localUser.peer;
    const remotePeerId = ownProps.connection.peer;
    const remoteStream = remotePeerId ? streamStore.getStream(remotePeerId) : null;
    return {
        localPeer: localPeer,
        localStream: localPeer ? streamStore.getStream(localPeer.id) : null,
        remoteStream: remoteStream,
    }
};

export default connect(mapStateToProps, {addCall})(RemoteMediaCard);
