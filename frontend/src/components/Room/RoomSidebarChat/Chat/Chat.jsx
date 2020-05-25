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

const Chat = ({chatData, sendMessage, connections, localPeer}) => {
    const classes = useStyles('');
    const [newMessage, setNewMessage] = useState('')

    const handleChangeTexfield = (event) => {
        setNewMessage(event.target.value)
    };

    const send = (e) => {
        e.preventDefault()
        sendMessage(newMessage)
        setNewMessage('')
    };

    const chatFeed = chatData.map(message => message.peerId === localPeer.id ?
            <ChatMsg
            side={'right'}
            messages={[message.text]}
            /> :
            <ChatMsg
            avatar={''}
            messages={[message.text]}
            />
        );

    return (
        <div className={classes.chatContainer}>
            {chatFeed}
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
    chatData: state.chat,
    connections: Object.values(state.connections.data),
    localPeer: state.localUser.peer,
})

export default connect(mapStateToProps, {sendMessage})(Chat);