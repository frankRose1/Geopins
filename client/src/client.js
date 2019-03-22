import { useState, useEffect } from 'react';
import { GraphQLClient } from 'graphql-request';
import { SERVER_URL } from './config';

export const useClient = () => {
  const [idToken, setIdToken] = useState('');
  useEffect(() => {
    const token = window.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getAuthResponse().id_token;
    setIdToken(token);
  }, []);

  const _client = new GraphQLClient(SERVER_URL, {
    headers: { authorization: idToken }
  });

  return [_client];
};
