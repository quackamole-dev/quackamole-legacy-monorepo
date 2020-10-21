import React from 'react';
import GenericMediaCard from '../../GenericMediaCard/GenericMediaCard';
import {connect} from 'react-redux';

const RemoteMediaCard = ({ remoteStream, remoteNickname }) => <GenericMediaCard stream={remoteStream} user={{ nickname: remoteNickname }}/>;

const mapStateToProps = (state, ownProps) => {
  const remoteSocketId = ownProps.connection.remoteSocketId;
  const remoteStreamWrapper = remoteSocketId ? state.streams.data[remoteSocketId] : null;
  const remoteStream = remoteStreamWrapper ? remoteStreamWrapper.stream : null;
  const remoteMetadata = state.peers.data[remoteSocketId] ? state.peers.data[remoteSocketId].metadata : {};
  console.log('-----------------remote stream', remoteStream);
  return {
    remoteStream: remoteStream,
    remoteNickname: remoteMetadata.nickname || 'missing Nickname'
  };
};

export default connect(mapStateToProps)(RemoteMediaCard);
