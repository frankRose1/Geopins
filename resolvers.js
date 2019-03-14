const user = {
  name: 'adad',
  email: 'user',
  _id: '1211411231'
}

module.exports = {
  Query: {
    me(){
      return user
    }
  }
}