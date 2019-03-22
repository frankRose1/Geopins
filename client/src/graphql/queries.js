export const ME_QUERY = `
  {
    me {
      _id
      email
      name
      picture
    }
  }
`;

export const GET_PINS_QUERY = `
  {
    getPins {
      _id
      createdAt
      title
      image
      latitude
      longitude
      content
      author {
        _id
        name
        picture
      }
      comments {
        text
        createdAt
        author {
          name
          picture
        }
      }
    }
  }
`;
