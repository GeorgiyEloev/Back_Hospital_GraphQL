const resolversRecord = require("./Resolvers/resolversRecord");
const resolversUser = require("./Resolvers/resolversUser");

const resolvers = {
  Query: {
    ...resolversRecord.Query,
    ...resolversUser.Query,
  },
  Mutation: {
    ...resolversRecord.Mutation,
    ...resolversUser.Mutation,
  },
};

module.exports = resolvers;
