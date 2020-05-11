import React, {useEffect} from 'react';
import GenericMediaCard from "../GenericMediaCard/GenericMediaCard";
import {connect} from "react-redux";

const RemoteMediaCard = ({localPeer, localStream, remoteStream, connection}) => {

    // const handleOnStream = (call) => {
    //     call.on('stream', remoteMediaStream => {
    //         console.log('ONSTREAM', remoteMediaStream);
    //         setRemoteStream(remoteMediaStream);
    //     });
    // };

    // const initCallListeners = () => {
    //     // FIXME add localPeer and calls to redux to prevent prop drilling
        // localPeer.on('call', call => {
        //     console.log('-----------------ONCALL', call);
        //     if (call.peer === connection.peer) {
        //         call.answer(localStream);
        //         // handleOnStream(call);
        //     } else {
        //         console.log('call doesnt match connectionId, call:', call, 'connection:', connection)
        //     }
        // });
    // };

    useEffect(() => {
        if (localPeer && localPeer.id) {
            // initCallListeners();
            handleStartCall();
            console.log('UE handlestartcall');
        }
    }, [localPeer]);


    const handleStartCall = () => {
        if (localPeer) {
            // const call = localPeer.call(connection.peer, localStream);

            // handleOnStream(call); // TODO add call to redux init listeners inside thunk
        }
    };


    return (
        <GenericMediaCard stream={remoteStream} user={{nickname: 'remote'}} />
    );
};

const mapStateToProps = (state, ownProps) => {
    // const peerId = ownProps;
    return {
        remoteStream: null
    };
};

export default connect(mapStateToProps)(RemoteMediaCard);
