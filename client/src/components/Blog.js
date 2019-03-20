import React, { useContext } from 'react';
import Context from '../context';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

import NoContent from './Pin/NoContent';
import CreatePin from './Pin/CreatePin';

const Blog = ({ classes }) => {
  const { state } = useContext(Context);
  const { draftPin } = state;
  let BlogContent;
  if (!draftPin) {
    // no content
    BlogContent = NoContent;
  } else if (draftPin) {
    // show the create pin component so they can add info to the pin
    BlogContent = CreatePin;
  }
  return (
    <Paper className={classes.root}>
      <BlogContent />
    </Paper>
  );
};

const styles = {
  root: {
    minWidth: 350,
    maxWidth: 400,
    maxHeight: 'calc(100vh - 64px)',
    overflowY: 'scroll',
    display: 'flex',
    justifyContent: 'center'
  },
  rootMobile: {
    maxWidth: '100%',
    maxHeight: 300,
    overflowX: 'hidden',
    overflowY: 'scroll'
  }
};

export default withStyles(styles)(Blog);
