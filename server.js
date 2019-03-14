const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const typedefs = require('./typeDefs');
const resolvers = require('./resolvers');
require('dotenv').config('.env');

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('DB connected'))
  .catch(err => console.error(`DB Error: ${err}`));

const server = new ApolloServer({
  typedefs,
  resolvers
});

server.listen().then(({ url }) => console.log(`Server is listening on ${url}`));
