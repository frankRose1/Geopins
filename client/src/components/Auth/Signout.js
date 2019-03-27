import React, { useContext } from 'react';
import { GoogleLogout } from 'react-google-login';
import { withStyles } from '@material-ui/core/styles';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Typography from '@material-ui/core/Typography';
import Context from '../../context';

const Signout = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const mobileSize = useMediaQuery('(max-width: 650px)');

  /**
   * Dispatches an action to sign out a user and update state
   */
  const onSignout = () => {
    dispatch({ type: 'SIGNOUT_USER' });
  };

  return (
    <GoogleLogout
      onLogoutSuccess={onSignout}
      // have to pass down onCLick handler from google-login
      render={({ onClick }) => (
        <span className={classes.root} onClick={onClick}>
          <Typography
            variant='body1'
            className={classes.buttonText}
            style={{ display: mobileSize ? 'none' : 'block' }}
          >
            Signout
          </Typography>
          <ExitToAppIcon className={classes.buttonIcon} />
        </span>
      )}
    />
  );
};

const styles = {
  root: {
    cursor: 'pointer',
    display: 'flex'
  },
  buttonText: {
    color: '#fff'
  },
  buttonIcon: {
    marginLeft: '5px',
    color: '#fff'
  }
};

export default withStyles(styles)(Signout);
