import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import {connect} from "react-redux";
import {sendMessage} from "../../../store/actions/chat.actions";
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import {parseEmojis} from '../../../utils';

const useStyles = makeStyles({
  container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
  },
  smiley: {
      margin: '4px',
      fontSize: '35px',
      cursor: 'pointer',
  },
  alignSmileys: {
    display: 'flex',
    maxWidth: '240px',
    padding: '8px',
    flexWrap: 'wrap',
  }
});

const EmojiHotbbar = ({sendMessage}) => {
  const classes = useStyles('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [smileys, setSmileys] = useState([':)', '😂','😘', '<3', ':-(', ':-@', '😇', '😑', '🤑', '🤯']);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (smiley) => {
    setAnchorEl(null);
    if(typeof(smiley) === 'string') {
        sendMessage(smiley)
    }
  };

  return (
    <div className={classes.container}>
      <Button>
        <SentimentVerySatisfiedIcon 
          color='primary' 
          fontSize='large' 
          onMouseOver={handleClick}
          onClick={handleClick}
          />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <div className={classes.alignSmileys} onMouseLeave={handleClose}>
            {smileys.map((smiley, id) => 
                <div className={classes.smiley} 
                    onClick={() => handleClose(smiley)} 
                    key={id}
                >
                    {parseEmojis(smiley)}
                </div> 
            )}
        </div>
      </Popover>
    </div>
  );
};

const mapStateToProps = (state, props) => ({
    chatData: state.chat,
    connections: Object.values(state.connections.data),
    localPeer: state.localUser.peer,
});

export default connect(mapStateToProps, {sendMessage})(EmojiHotbbar);