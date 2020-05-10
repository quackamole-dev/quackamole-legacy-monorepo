import React, {useEffect, useRef} from 'react';
import {Card, makeStyles} from "@material-ui/core";
import {setVideoSrc} from "../../../../utils";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    media: {
        width: '100%'
    }
}));

const GenericMediaCard = ({stream, muted = false, user}) => {
    const classes = useStyles();
    const videoRef = useRef(null);
    const {nickname, peerId} = user;

    useEffect(() => {
        setVideoSrc(videoRef, stream, muted);
    }, [stream]);

    return (
        <Card>
            <video ref={videoRef} className={classes.media}/>
            {nickname}
        </Card>
    );
};

export default GenericMediaCard;
