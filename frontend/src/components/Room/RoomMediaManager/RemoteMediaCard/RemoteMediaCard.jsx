import React, {useEffect} from 'react';
import {CircularProgress} from "@material-ui/core";
import GenericMediaCard from "../../GenericMediaCard/GenericMediaCard";
import {connect} from "react-redux";
import {addCall} from "../../../../store/actions/calls.actions";

const RemoteMediaCard = ({localPeer, localStream, remoteStream, connection, call, addCall}) => {

    useEffect(() => {
        if (localPeer && connection && !remoteStream) {
            // setTimeout(handleStartCall, Math.random() * 1500 + 1500); //
            // handleStartCall();
        }
    }, [localPeer, connection]);


    const handleStartCall = () => {
        if (localPeer && !call) {
            // FIXME adjust to only make one of the peers make the call and the other answer it on connection.
            const call = localPeer.call(connection.peer, localStream);
            addCall(call);
        }
    };

    return (
        <>
            { call
                ? <GenericMediaCard stream={remoteStream} user={{nickname: 'remote'}} />
                : <CircularProgress color="inherit"/>

            }
        </>
    );
};

const mapStateToProps = (state, ownProps) => {
    const localPeer = state.localUser.peer;
    const remotePeerId = ownProps.connection.peer;
    const remoteStream = remotePeerId ? state.streams.data[remotePeerId] : null;
    return {
        localPeer: localPeer,
        localStream: localPeer ? state.streams.data[localPeer.id] : null,
        remoteStream: remoteStream,
        call: state.calls.data[remotePeerId]
    }
};

export default connect(mapStateToProps, {addCall})(RemoteMediaCard);
