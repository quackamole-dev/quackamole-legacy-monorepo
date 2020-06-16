import React, { useState } from 'react';
import ChatMsg from './ChatMsg';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import {ThemeProvider, makeStyles} from '@material-ui/core/styles';
import {connect} from "react-redux";
import {sendMessage} from '../../../../store/actions/chat.actions';
import {toArray} from "react-emoji-render";

const useStyles = makeStyles({
    chatContainer: {
    },
    textField: {
        width: "85%",
        marginRight: "5px",
    },
    chatSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    customizeIcon: {
        border: '2px solid #E53935',
        borderRadius: '50%',
        color: '#E53935',
        height: 35,
        width: 35,
        padding: 4,
        cursor: 'pointer',
        '&:hover': {
            background: "#E53935",
            color: 'white',
         },
    },
});

const Chat = ({chatData, sendMessage, connections, localPeer}) => {
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

    const parseEmojis = value => {
        const emojisArray = toArray(value);

        // toArray outputs React elements for emojis and strings for other
        const newValue = emojisArray.reduce((previous, current) => {
          if (typeof current === "string") {
            return previous + current;
          }
          return previous + current.props.children;
        }, "");

        return newValue;
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
            messages={[parseEmojis(message.text)]}
        />
    );

    return (
        <div className={classes.chatContainer}>
            {chatFeed}
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

const mapStateToProps = (state, props) => ({
    chatData: state.chat,
    connections: Object.values(state.connections.data),
    localPeer: state.localUser.peer,
});

export default connect(mapStateToProps, {sendMessage})(Chat);
