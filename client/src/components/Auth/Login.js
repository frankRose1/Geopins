import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { withStyles } from '@material-ui/core/styles';
import { CLIENT_ID } from '../../config';
// import Typography from "@material-ui/core/Typography";

const Login = ({ classes }) => {
  return <GoogleLogin clientId={CLIENT_ID} />;
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
