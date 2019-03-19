const User = require('../models/User');
// will verify the token sent from the client
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

/**
 * See if a user already exists in the database
 * @param {string} email - email returned from google's API
 */
const checkExistingUser = email => User.findOne({ email });

/**
 * Creates a new user in the database
 * @param {object} userinfo - user's info as an object returned from google's API, only need email, name, and picture
 */
const createNewUser = ({ name, email, picture }) => {
  const newUser = new User({ email, name, picture });
  return newUser.save();
};

/**
 * Will verify if a token in the authorization headers is valid
 * @param {string} token - tokenId provided from the client, via google oauth
 */
const verifyAuthToken = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID
    });
    // gets the google user
    return ticket.getPayload();
  } catch (err) {
    console.error(`Error verifying auth token ${err}`);
  }
};

/**
 * Using the token provided in auth headers, will sign a user in or create a new one
 * @param {string} token - when a user signs in via google's oauth, a tokenId will be provided to access user data
 */
exports.findOrCreateUser = async token => {
  //verify the token
  const googleUser = await verifyAuthToken(token);

  //see if user exists
  const existingUser = await checkExistingUser(googleUser.email);

  if (!existingUser) {
    const user = await createNewUser(googleUser);
    return user;
  }

  return existingUser;
};
