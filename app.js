const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const schemaRecords = require("./src/graphQLServer/SchemaСomponents/schemaRecords");
const schemaUsers = require("./src/graphQLServer/SchemaСomponents/schemaUsers");
const resolvers = require("./src/graphQLServer/root/resolversRecord");
const resolversUser = require("./src/graphQLServer/root/resolversUser");
const apiReceptionRoutes = require("./src/modules/routes/record.router");
const apiUserRoutes = require("./src/modules/routes/user.router");
require("dotenv").config();
const { PORT, UTL_BD } = process.env;
const app = express();

app.use(cors());

mongoose.connect(UTL_BD);

app.all("/record/*", (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, process.env.JWT_KEY, (err, data) => {
    if (err) {
      res.status(401).send("Error, corrupted token!!!");
    } else {
      req.userId = data._id;
      next();
    }
  });
});

app.use(
  "/record/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: schemaRecords,
    rootValue: resolvers,
  })
);

app.use(
  "/user/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: schemaUsers,
    rootValue: resolversUser,
  })
);

// app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use("/record/", apiReceptionRoutes);
app.use("/user/", apiUserRoutes);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
});
