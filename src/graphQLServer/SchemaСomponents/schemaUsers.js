module.exports = `
  type Token {
    login: String!
    token: String!
  }

  input UserInput {
    login: String!
    password: String!
  }

  type Query {
    authorizationUser(input: UserInput!): Token!
  }
  type Mutation {
    addNewUser(input: UserInput!): Token!
  }
`;
