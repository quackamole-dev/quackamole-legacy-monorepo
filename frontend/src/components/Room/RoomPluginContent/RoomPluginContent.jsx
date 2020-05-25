import React, {useEffect, useRef} from 'react';
import {Box} from "@material-ui/core";
import {connect} from "react-redux";
import {broadcastPluginMessageToPeers, setPlugin} from "../../../store/actions/plugin.actions";

const RoomPluginContent = ({plugin, broadcastPluginMessageToPeers, setPlugin}) => {
    const iframeRef = useRef();

    useEffect(() => {
        const handleBroadcastPluginMessage = (evt) => {
            if (evt.data.type === 'broadcast') {
                broadcastPluginMessageToPeers({type: 'pluginData', payload: evt.data.payload}, iframeRef.current);
            }
        };

        window.addEventListener('message', handleBroadcastPluginMessage);
        return () => window.removeEventListener('message', handleBroadcastPluginMessage);
    }, []);

    useEffect(() => {
        if (iframeRef && iframeRef.current) {
            setPlugin({...plugin, iframe: iframeRef.current});
        }
    }, [iframeRef, plugin.url]);

    return (
        <Box bgcolor='salmon' flexGrow={1}>
            {plugin && plugin.url && <iframe src={plugin.url} style={{width: '100%', height: '100%'}} ref={iframeRef} />}
        </Box>
    );
};

const mapStateToProps = (state) => ({
    plugin: state.plugin
});

export default connect(mapStateToProps, {broadcastPluginMessageToPeers, setPlugin})(RoomPluginContent);
