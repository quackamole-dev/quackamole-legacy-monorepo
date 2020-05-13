import React from 'react';
import {Box} from "@material-ui/core";

const RoomPluginContent = () => {

    return (
        <Box bgcolor='salmon' flexGrow={1}>
            {/* Example game, not a real plugin, just to show how plugins will be rendered. */}
            <iframe src="https://andreas-schoch.github.io/breakout-game/" style={{width: '100%', height: '100%'}} />

        </Box>
    );
};

export default RoomPluginContent;
