import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import format from 'date-fns/format';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import FaceIcon from '@material-ui/icons/Face';

import Comments from '../Comment/Comments';
import CreateComment from '../Comment/CreateComment';
import Context from '../../context';

const PinContent = ({ classes }) => {
  const { state } = useContext(Context);
  const { title, content, author, createdAt, comments } = state.currentPin;
  return (
    <div className={classes.root}>
      <Typography component='h2' variant='h4' color='primary' gutterBottom>
        {title}
      </Typography>
      <Typography
        component='h3'
        variant='h6'
        color='inherit'
        gutterBottom
        className={classes.text}
      >
        <FaceIcon className={classes.icon} />
        {author.name}
      </Typography>
      <Typography
        variant='subtitle2'
        color='inherit'
        gutterBottom
        className={classes.text}
      >
        <AccessTimeIcon className={classes.text} />
        {format(Number(createdAt), 'MMM Do, YYYY')}
      </Typography>
      <Typography variant='subtitle1' gutterBottom className={classes.text}>
        {content}
      </Typography>

      {/* Pin Comments/Create Comment */}
      <CreateComment />
      <Comments comments={comments} />
    </div>
  );
};

const styles = theme => ({
  root: {
    padding: '1em 0.5em',
    textAlign: 'center',
    width: '100%'
  },
  icon: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  text: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default withStyles(styles)(PinContent);
