module.exports = `
  type User {
    _id: ID
    login: String
    password: String
  }
  type Token {
    login: String!
    token: String!
  }

  input UserInput {
    login: String!
    password: String!
  }

  type Mutation {
    addNewUser(input: UserInput!): Token!
    authorizationUser(input: UserInput!): Token!
  }
`;
