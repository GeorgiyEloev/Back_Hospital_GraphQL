module.exports = `
  type Token {
    login: String!
    token: String!
  }

  input UserInput {
    login: String!
    password: String!
  }
  
  type Mutation {
    authorizationUser(input: UserInput!): Token!
    addNewUser(input: UserInput!): Token!
  }
`;
