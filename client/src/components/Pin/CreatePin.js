import React, { useState, useContext } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddAPhotoIcon from '@material-ui/icons/AddAPhotoTwoTone';
import LandscapeIcon from '@material-ui/icons/LandscapeOutlined';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/SaveTwoTone';
import Context from '../../context';
import { useClient } from '../../client';
import { CREATE_PIN_MUTATION } from '../../graphql/mutations';
import { CLOUDINARY_KEY } from '../../config';

const CreatePin = ({ classes }) => {
  const { dispatch, state } = useContext(Context);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [client] = useClient();

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

  /**
   * Handles uploading an image to cloudinary
   */
  const handleImageUpload = async () => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'geopins');
    data.append('cloud_name', CLOUDINARY_KEY);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_KEY}/image/upload`,
      data
    );
    return res.data.url;
  };

  /**
   * Submits the pin data to the server and will update the "pins" in context
   * with the newly created pin so that it appears on the map immediately
   */
  const handleSubmit = async e => {
    e.preventDefault();
    const imageUrl = await handleImageUpload();
    const variables = {
      title,
      content,
      image: imageUrl,
      latitude: state.draftPin.latitude,
      longitude: state.draftPin.longitude
    };
    try {
      setSubmitting(true);
      const { createPin } = await client.request(
        CREATE_PIN_MUTATION,
        variables
      );
      dispatch({ type: 'CREATE_PIN', payload: createPin });
    } catch (err) {
      setSubmitting(false);
      console.error('Error creating pin', err);
    }
    setSubmitting(false);
    handleDeleteDraft();
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
          disabled={!title.trim() || !image || !content.trim() || submitting}
          onClick={handleSubmit}
        >
          Submit{submitting ? 'ting' : ''}
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
