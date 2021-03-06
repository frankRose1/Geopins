const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config('.env');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { findOrCreateUser } = require('./controllers/userController');

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('DB connected'))
  .catch(err => console.error(`DB Error: ${err}`));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // intercept the request
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;

    try {
      authToken = req.headers.authorization;
      if (authToken) {
        currentUser = await findOrCreateUser(authToken);
      }
    } catch (err) {
      console.error(`Unable to authenticate user with the token ${authToken}`);
    }
    return { currentUser };
  }
});

server
  .listen({ port: process.env.PORT || 4000 })
  .then(({ url }) => console.log(`Server is listening on ${url}`));
