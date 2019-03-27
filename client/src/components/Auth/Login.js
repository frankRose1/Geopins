import React, { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';
import { GraphQLClient } from 'graphql-request';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import { ME_QUERY } from '../../graphql/queries';
import { CLIENT_ID, SERVER_URL } from '../../config';
import Context from '../../context';

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const onFailure = err => {
    console.error(`Error logging in: ${err}`);
    // handles the case when the google access token is expired
    // state.isAuth will be false and user will be redirected to /login
    dispatch({ type: 'IS_LOGGED_IN', payload: false });
  };

  const onSuccess = async googleUser => {
    try {
      // gets the ID token to be sent to the server to get a users info
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient(SERVER_URL, {
        headers: { authorization: idToken }
      });
      const { me } = await client.request(ME_QUERY);
      dispatch({ type: 'LOGIN_USER', payload: me });
      // isSignedIn() will return true if googleoAUth was able to authenticate the user
      dispatch({ type: 'IS_LOGGED_IN', payload: googleUser.isSignedIn() });
    } catch (err) {
      onFailure(err);
    }
  };

  return (
    <div className={classes.root}>
      <Typography
        component='h1'
        variant='h3'
        gutterBottom
        noWrap
        style={{ color: 'rgba(66, 133, 244)' }}
      >
        Welcome!
      </Typography>
      <GoogleLogin
        clientId={CLIENT_ID}
        onSuccess={onSuccess}
        onFailure={onFailure}
        isSignedIn={true}
        theme='dark'
      />
    </div>
  );
};

const styles = {
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  }
};

export default withStyles(styles)(Login);
