import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { GraphQLClient } from 'graphql-request';
import { withStyles } from '@material-ui/core/styles';
import { CLIENT_ID, SERVER_URL } from '../../config';
// import Typography from "@material-ui/core/Typography";

const ME_QUERY = `
  {
    me {
      _id
      email
      name
      picture
    }
  }
`;

const Login = ({ classes }) => {
  const onSuccess = async googleUser => {
    // gets the ID token to be sent to the server to get a users info
    const idToken = googleUser.getAuthResponse().id_token;
    const client = new GraphQLClient(SERVER_URL, {
      headers: { authorization: idToken }
    });
    const data = await client.request(ME_QUERY);
    console.log(data);
  };
  return <GoogleLogin clientId={CLIENT_ID} onSuccess={onSuccess} />;
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
