const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./src/graphQLServer/schema");
const resolvers = require("./src/graphQLServer/root/resolversRecord");
const resolversUser = require("./src/graphQLServer/root/resolversUser");

const apiReceptionRoutes = require("./src/modules/routes/record.router");
const apiUserRoutes = require("./src/modules/routes/user.router");
require("dotenv").config();
const { PORT, UTL_BD } = process.env;
const app = express();

app.use(cors());

mongoose.connect(UTL_BD);

const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(`Connection error: ${err}`));
dbConnection.once("open", () => console.log("Connected to DB!"));

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema,
    rootValue: { ...resolvers, ...resolversUser },
  })
);

app.use(express.json());
app.use("/record/", apiReceptionRoutes);
app.use("/user/", apiUserRoutes);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
});
