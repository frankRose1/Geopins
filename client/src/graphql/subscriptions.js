import gql from 'graphql-tag';

const PIN_ADDED_SUBSCRIPTION = gql`
  subscription {
    pinAdded {
      _id
      image
      createdAt
      title
      content
      latitude
      longitude
      author {
        name
        picture
      }
      comments {
        text
        createdAt
        _id
        author {
          name
          picture
        }
      }
    }
  }
`;

const PIN_UPDATED_SUBSCRIPTION = gql`
  subscription {
    pinUpdated {
      _id
      title
      createdAt
      content
      image
      latitude
      longitude
      author {
        _id
        name
      }
      comments {
        text
        createdAt
        _id
        author {
          name
          picture
        }
      }
    }
  }
`;

const PIN_DELETED_SUBSCRIPTION = gql`
  subscription {
    pinDeleted {
      _id
    }
  }
`;

export {
  PIN_ADDED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION
};
