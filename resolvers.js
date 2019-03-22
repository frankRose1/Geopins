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
      return pinAdded;
    }),
    deletePin: authenticated(async (parent, args, ctx, info) => {
      const pin = await Pin.findByIdAndDelete(args.pinId);
      if (!pin) {
        throw new Error('Pin not found.');
      }

      return pin;
    }),
    createComment: authenticated(async (parent, args, ctx, info) => {
      const newComment = {
        author: ctx.currentUser._id,
        text: args.text
      };
      const pin = await Pin.findByIdAndUpdate(
        args.pinId,
        { $push: { comments: newComment } },
        { new: true }
      )
        .populate('author')
        .populate('comments.author');

      if (!pin) {
        throw new Error('Pin not found.');
      }

      return pin;
    })
  }
};
