import { createContext } from 'react';

const Context = createContext({
  currentUser: null,
  isAuth: false,
  draftPin: null
});

export default Context;
