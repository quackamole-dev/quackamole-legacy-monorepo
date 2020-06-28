import React, { useState } from 'react';
import ChatMsg from './ChatMsg';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import {ThemeProvider, makeStyles} from '@material-ui/core/styles';
import {connect} from "react-redux";
import {sendMessage} from '../../../../store/actions/chat.actions';
import {toArray} from "react-emoji-render";
import {parseEmojis} from "../../../../utils";

const useStyles = makeStyles({
    chatContainer: {
        overflow: 'auto',
    },
    textField: {
        width: "85%",
        marginRight: "5px"
    },
    chatSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    customizeIcon: {
        border: '2px solid #2E7D32',
        borderRadius: '50%',
        color: '#2E7D32',
        height: 35,
        width: 35,
        padding: 4,
        cursor: 'pointer',
        '&:hover': {
            background: "#2E7D32",
            color: 'white',
         },
    },
});

const Chat = ({chatData, sendMessage, localPeer, localPeerMetadata}) => {
    const classes = useStyles('');
    const [newMessage, setNewMessage] = useState('');

    const handleChangeTexfield = (event) => {
        setNewMessage(event.target.value)
    };

    const handleKeyPress = (event) => {
        if(event.key === 'Enter' && newMessage.length > 0) {
            send(event)
        }
    };

    const send = (e) => {
        e.preventDefault();
        sendMessage(newMessage);
        setNewMessage('');
    };

    //handle the chat feed to display all messages on the right position
      const chatFeed = chatData.map((message, i) => message.peerId === localPeer.id ?
        <ChatMsg
            key={i}
            side={'right'}
            messages={[parseEmojis(message.text)]}
        /> :
        <ChatMsg
            key={i}
            avatar={''}
            messages={[parseEmojis(`${localPeerMetadata.nickname}: ${message.text}`)]}
        />
    );

    return (
        <div>
            <div className={classes.chatContainer}>
                {chatFeed}
            </div>
            <div className={classes.chatSection}>
                <TextField
                    variant="outlined"
                    size="small"
                    multiline
                    fullWidth
                    className={classes.textField}
                    onChange={handleChangeTexfield}
                    onKeyPress={handleKeyPress}
                    value={parseEmojis(newMessage)}
                />
                <SendIcon
                    className={classes.customizeIcon}
                    onClick={send}
                />
            </div>
        </div>
    )
};

const mapStateToProps = (state, props) => {
    const chatData = state.chat;
    const localPeer = state.localUser.peer;
    const localStream = localPeer ? state.streams.data[localPeer.id] : null;
    return {
        localPeerMetadata: state.localUser.metadata,
        localStream: localStream,
        localPeer: localPeer,
        chatData: chatData,
    }
};

export default connect(mapStateToProps, {sendMessage})(Chat);
