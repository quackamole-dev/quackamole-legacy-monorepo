import React, { useState } from 'react';
import ChatMsg from './ChatMsg';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import {ThemeProvider, makeStyles} from '@material-ui/core/styles';
import {connect} from "react-redux";
import {sendMessage} from '../../../../store/actions/chat.actions'

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

const Chat = ({chatData, sendMessage}) => {
    const classes = useStyles('');
    const [newMessage, setNewMessage] = useState('')
    const [messages, setMessages] = useState([
        'Hi Jenny, How r u today?',
        'Did you train yesterday',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Volutpat lacus laoreet non curabitur gravida.',
    ])
    const [myMessage, setMyMessage] = useState([
    ])

    const handleChangeTexfield = (event) => {
        setNewMessage(event.target.value)
    };

    const send = (e) => {
        e.preventDefault()
        sendMessage(newMessage)
        setNewMessage('')  
    }


    return (
        <div className={classes.chatContainer}>
            <ChatMsg
            avatar={''}
            messages={messages}
            />
            <ChatMsg
            side={'right'}
            messages={chatData}
            />
            <div className={classes.chatSection}>
                <TextField
                    multiline
                    fullWidth
                    className={classes.textField} 
                    onChange={handleChangeTexfield}
                    value={newMessage}      
                />
                <SendIcon
                    color="primary"
                    onClick={send}
                />
            </div>
        </div>
    )
};

const mapStateToProps = (state, props) => ({
    chatData: state.chat 
})

export default connect(mapStateToProps, {sendMessage})(Chat);