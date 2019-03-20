import React, { useState, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddAPhotoIcon from '@material-ui/icons/AddAPhotoTwoTone';
import LandscapeIcon from '@material-ui/icons/LandscapeOutlined';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/SaveTwoTone';
import Context from '../../context';

const CreatePin = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');

  /**
   * Sets title, image, and content back to initial state and removes the draft pin
   * from the map by dispatching an action.
   */
  const handleDeleteDraft = () => {
    setTitle('');
    setContent('');
    setImage('');
    dispatch({ type: 'DELETE_DRAFT_PIN' });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(title, image, content);
  };

  return (
    <form className={classes.form}>
      {/* Form Title */}
      <Typography
        className={classes.alignCenter}
        component='h2'
        variant='h4'
        color='secondary'
      >
        <LandscapeIcon className={classes.iconLarge} /> Pin Location
      </Typography>
      {/* Pin Title & Image */}
      <div>
        <TextField
          name='title'
          label='Title'
          placeholder='Pin title'
          onChange={e => setTitle(e.target.value)}
        />
        <input
          className={classes.input}
          id='image'
          accept='image/*'
          type='file'
          onChange={e => setImage(e.target.files[0])}
        />
        <label htmlFor='image'>
          <Button
            style={{ color: image && 'green' }}
            component='span'
            size='small'
            className={classes.button}
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      {/* Text Content */}
      <div className={classes.contentField}>
        <TextField
          name='content'
          label='Content'
          multiline
          fullWidth
          margin='normal'
          rows='6'
          variant='outlined'
          onChange={e => setContent(e.target.value)}
        />
      </div>
      {/* Discard Draft & Submit Button */}
      <div>
        <Button
          variant='contained'
          color='primary'
          className={classes.button}
          onClick={handleDeleteDraft}
        >
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>
        <Button
          type='submit'
          variant='contained'
          color='secondary'
          className={classes.button}
          disabled={!title.trim() || !image || !content.trim()}
          onClick={handleSubmit}
        >
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '95%'
  },
  input: {
    display: 'none'
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'center'
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
