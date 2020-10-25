import React, {useEffect, useRef, useState} from 'react';
import ChatMsg from './ChatMsg';
import {makeStyles} from '@material-ui/core/styles';
import {TextField} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import {connect} from 'react-redux';
import {sendMessage} from '../../../../store/actions/chat.actions';

const useStyles = makeStyles({
  chat: {
    height: '100vh',
    display: 'flex',
    flexFlow: 'column nowrap',
    width: '320px'
  },
  chatFeed: {
    display: 'flex',
    flexFlow: 'column nowrap',
    flexGrow: 1,
    maxHeight: 'calc(100% - 60px)',
    overflow: 'auto',
    padding: '8px'
  },
  chatInput: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'flex-end',
    padding: '8px'
  },
  chatInputTextfield: {
    flexGrow: 1,
    zIndex: 1000,
    backgroundColor: 'white'
  },
  chatInputSendBtn: {
    fontSize: '40px',
    margin: 'auto 5px',
    cursor: 'pointer',
    opacity: 0.8,
    transition: 'opacity 0.2s',
    '&:hover': {
      opacity: 0.95
    }
  }
});

const Chat = ({ dispatch, chatData, socket }) => {
  const classes = useStyles('');
  const [newMessage, setNewMessage] = useState('');
  const feedRef = useRef(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [chatData]);

  const handleChangeTexfield = (event) => {
    setNewMessage(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        setNewMessage(newMessage.concat('\n'));
      } else {
        send(event);
      }
    }
  };

  const send = (e) => {
    e.preventDefault();
    if (newMessage.replace(/\n/g, '').length) {
      dispatch(sendMessage(newMessage));
      setNewMessage('');
    }
  };

  //handle the chat feed to display all messages on the right position
  const chatMessages = chatData.map((message, i) => message.authorSocketId === socket.id
    ? <ChatMsg key={i} side={'right'} messages={[message.text]}/>
    : <ChatMsg key={i} avatar={''} messages={[message.text]}/>
  );

  return (
    <div className={classes.chat}>

      <div className={classes.chatFeed} ref={feedRef}>
        {chatMessages}
      </div>

      <div className={classes.chatInput}>
        <TextField
          variant="outlined"
          multiline
          rowsMax={5}
          className={classes.chatInputTextfield}
          onChange={handleChangeTexfield}
          onKeyPress={handleKeyPress}
          value={newMessage}
          autoFocus
        />
        <SendIcon className={classes.chatInputSendBtn} onClick={send}/>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  chatData: state.chat,
  socket: state.localUser.socket
});

export default connect(mapStateToProps)(Chat);
