const CREATE_PIN_MUTATION = `
  mutation($title: String!, $image: String!, $content: String!, $latitude: Float!, $longitude: Float!) {
    createPin( input: {
      title: $title, 
      image: $image, 
      content: $content, 
      latitude: $latitude, 
      longitude:$longitude
    }){
      _id
      image
      createdAt
      title
      content
      latitude
      longitude
      author {
        _id
        name
        picture
      }
    }
  }
`;

const DELETE_PIN_MUTATION = `
  mutation($pinId: ID!){
    deletePin(pinId: $pinId) {
      _id
    }
  }
`;

const CREATE_COMMENT_MUTATION = `
  mutation($pinId: ID!, $text: String!){
    createComment(pinId: $pinId, text: $text) {
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

export { CREATE_PIN_MUTATION, DELETE_PIN_MUTATION, CREATE_COMMENT_MUTATION };
