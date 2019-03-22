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

export { CREATE_PIN_MUTATION, DELETE_PIN_MUTATION };
