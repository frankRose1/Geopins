import React, { useState, useContext } from 'react';
import { withStyles } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import SendIcon from '@material-ui/icons/Send';
import Divider from '@material-ui/core/Divider';

import Context from '../../context';
import { useClient } from '../../client';
import { CREATE_COMMENT_MUTATION } from '../../graphql/mutations';

const CreateComment = ({ classes }) => {
  const [client] = useClient();
  const { state } = useContext(Context);
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const variables = { text: commentText, pinId: state.currentPin._id };
    try {
      await client.request(CREATE_COMMENT_MUTATION, variables);
      setCommentText('');
    } catch (err) {
      console.error('Error creating a comment', err);
    }
  };

  return (
    <>
      <form className={classes.form}>
        <IconButton
          onClick={() => setCommentText('')}
          disabled={!commentText.trim()}
          className={classes.clearButton}
        >
          <ClearIcon />
        </IconButton>
        <InputBase
          className={classes.input}
          placeholder='Add Comment'
          multiline={true}
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
        />
        <IconButton
          type='submit'
          onClick={handleSubmit}
          disabled={!commentText.trim()}
          className={classes.sendButton}
        >
          <SendIcon />
        </IconButton>
      </form>
      {/* Divider to seperate form from comments */}
      <Divider />
    </>
  );
};

const styles = theme => ({
  form: {
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  clearButton: {
    padding: 0,
    color: 'red'
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark
  }
});

export default withStyles(styles)(CreateComment);
