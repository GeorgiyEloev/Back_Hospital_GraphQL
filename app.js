// const express = require("express");
const { ApolloServer } = require("apollo-server");
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { applyMiddleware } = require("graphql-middleware");
const schema = require("./src/graphQLServer/schema");
const resolvers = require("./src/graphQLServer/root/resolver");
const { makeExecutableSchema } = require("@graphql-tools/schema");
// const apiReceptionRoutes = require("./src/modules/routes/record.router");
// const apiUserRoutes = require("./src/modules/routes/user.router");
require("dotenv").config();
const { PORT, UTL_BD } = process.env;

const permissions = require("./src/graphQLServer/root/tokenError");

const newSchema = makeExecutableSchema({ typeDefs: schema, resolvers });

const app = new ApolloServer({
  schema: applyMiddleware(newSchema, permissions),
  context: ({ req }) => ({ req }),
});

mongoose.connect(UTL_BD);

// app.all("/graphql*", (req, res, next) => {
//   const token = req.headers.authorization;
//   if (req.headers.hasOwnProperty("authorization")) {
//     root = { ...resolvers, ...resolversUser };
//     console.log(root);
//   } else {
//     root = resolversUser;
//   }
//   jwt.verify(token, process.env.JWT_KEY, (err, data) => {
//     if (err) {
//       res.status(401).send("Error, corrupted token!!!");
//     } else {
//       req.userId = data._id;
//       next();
//     }
//   });
// });

// app.use(
//   "/graphql",
//   graphqlHTTP({
//     graphiql: true,
//     schema: schema,
//     rootValue: { ...resolvers, ...resolversUser },
//   })
// );

// app.use(
//   "/user/graphql",
//   graphqlHTTP({
//     graphiql: true,
//     schema: schemaUsers,
//     rootValue: resolversUser,
//   })
// );

// app.use(express.json());
// app.use("/record/", apiReceptionRoutes);
// app.use("/user/", apiUserRoutes);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
});
