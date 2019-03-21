const Pin = require('./models/Pin');
const { AuthenticationError } = require('apollo-server');

const authenticated = next => (parent, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError('You must be logged in!');
  }
  //proceed with the resolver
  return next(parent, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((parent, args, ctx, info) => ctx.currentUser)
  },
  Mutation: {
    createPin: authenticated(async (parent, args, ctx, info) => {
      const newPin = new Pin({
        ...args.input,
        author: ctx.currentUser._id
      });
      await newPin.save();
      const pinAdded = await Pin.populate(newPin, 'author');
      return pinAdded;
    })
  }
};
