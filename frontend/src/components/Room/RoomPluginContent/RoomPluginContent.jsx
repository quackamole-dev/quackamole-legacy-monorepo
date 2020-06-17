import React, {useEffect, useRef} from 'react';
import {Box} from "@material-ui/core";
import {connect} from "react-redux";
import {handlePluginMessage, setPlugin} from "../../../store/actions/plugin.actions";

const RoomPluginContent = ({plugin, handlePluginMessage, setPlugin}) => {
    const iframeRef = useRef();

    useEffect(() => {
        const handleMessage = (evt) => {
            handlePluginMessage(evt);
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    useEffect(() => {
        if (iframeRef && iframeRef.current) {
            setPlugin({...plugin, iframe: iframeRef.current});
        }
    }, [iframeRef, plugin.url]);

    return (
        <Box flexGrow={1}>
            {plugin && plugin.url && <iframe src={plugin.url} style={{width: '100%', height: '100%'}} ref={iframeRef} title={'plugin content'} />}
        </Box>
    );
};

const mapStateToProps = (state) => ({
    plugin: state.plugin
});

export default connect(mapStateToProps, {handlePluginMessage, setPlugin})(RoomPluginContent);
