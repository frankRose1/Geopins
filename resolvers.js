const Pin = require('./models/Pin');
const { AuthenticationError, PubSub } = require('apollo-server');
const pubsub = new PubSub();
const PIN_ADDED = 'PIN_ADDED';
const PIN_DELETED = 'PIN_DELETED';
const PIN_UPDATED = 'PIN_UPDATED';

const authenticated = next => (parent, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError('You must be logged in!');
  }
  //proceed with the resolver
  return next(parent, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((parent, args, ctx, info) => ctx.currentUser),
    getPins: async (parent, args, ctx, info) => {
      const pins = await Pin.find({})
        .populate('author')
        .populate('comments.author');
      return pins;
    }
  },
  Mutation: {
    createPin: authenticated(async (parent, args, ctx, info) => {
      const newPin = new Pin({
        ...args.input,
        author: ctx.currentUser._id
      });
      await newPin.save();
      const pinAdded = await Pin.populate(newPin, 'author');
      pubsub.publish(PIN_ADDED, { pinAdded });
      return pinAdded;
    }),
    deletePin: authenticated(async (parent, args, ctx, info) => {
      const pinDeleted = await Pin.findOneAndDelete({ _id: args.pinId });
      if (!pinDeleted) {
        throw new Error('Pin not found.');
      }
      pubsub.publish(PIN_DELETED, { pinDeleted });
      return pinDeleted;
    }),
    createComment: authenticated(async (parent, args, ctx, info) => {
      const newComment = {
        author: ctx.currentUser._id,
        text: args.text
      };
      const pinUpdated = await Pin.findOneAndUpdate(
        { _id: args.pinId },
        { $push: { comments: newComment } },
        { new: true }
      )
        .populate('author')
        .populate('comments.author');

      if (!pinUpdated) {
        throw new Error('Pin not found.');
      }
      pubsub.publish(PIN_UPDATED, { pinUpdated });
      return pinUpdated;
    })
  },
  Subscription: {
    pinAdded: {
      subscribe: () => pubsub.asyncIterator(PIN_ADDED)
    },
    pinDeleted: {
      subscribe: () => pubsub.asyncIterator(PIN_DELETED)
    },
    pinUpdated: {
      subscribe: () => pubsub.asyncIterator(PIN_UPDATED)
    }
  }
};
