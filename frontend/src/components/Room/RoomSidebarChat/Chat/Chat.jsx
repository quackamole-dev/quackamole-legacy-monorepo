import React, { useState } from 'react';
import ChatMsg from './ChatMsg';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import {ThemeProvider, makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
    chatContainer: {
    },
    textField: {
        width: "85%",
        marginRight: "5px",
    },
    chatSection: {
    },
})

const Chat = () => {
    const classes = useStyles('');
    const [newMessage, setNewMessage] = useState('')
    const [messages, setMessages] = useState([
        'Hi Jenny, How r u today?',
        'Did you train yesterday',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Volutpat lacus laoreet non curabitur gravida.',
    ])
    const [myMessage, setMyMessage] = useState([
        "Great! What's about you?",
        'Of course I did. Speaking of which check this out',
        'Of course I did. Speaking of which check this out',
        'Of course I did. Speaking of which check this out',
        'Of course I did. Speaking of which check thddddis out',

    ])

    const handleChangeTexfield = (event) => {
        setNewMessage(event.target.value)
    };

    const sendMessage= (e) => {
        e.preventDefault()
        setMyMessage([...myMessage, newMessage])
    }


    return (
        <div className={classes.chatContainer}>
            <ChatMsg
            avatar={''}
            messages={messages}
            />
            <ChatMsg
            side={'right'}
            messages={myMessage}
            />
            <div className={classes.chatSection}>
                <TextField
                    multiline
                    fullWidth
                    className={classes.textField} 
                    onChange={handleChangeTexfield}      
                />
                <SendIcon
                    color="primary"
                    onClick={sendMessage}
                />
            </div>
        </div>
    )
};


export default Chat;