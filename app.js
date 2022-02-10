const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server");
const { applyMiddleware } = require("graphql-middleware");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const schema = require("./src/graphQLServer/schema");
const resolvers = require("./src/graphQLServer/root/resolver");
const permissions = require("./src/graphQLServer/root/tokenError");
require("dotenv").config();

const { PORT, UTL_BD } = process.env;

const newSchema = makeExecutableSchema({ typeDefs: schema, resolvers });

const app = new ApolloServer({
  schema: applyMiddleware(newSchema, permissions),
  context: ({ req }) => ({ req }),
});

mongoose.connect(UTL_BD);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
});
