const { buildSchema, print } = require("graphql");
const { mergeTypeDefs } = require("@graphql-tools/merge");
const schemaUsers = require("./SchemaСomponents/schemaUsers");
const schemaRecords = require("./SchemaСomponents/schemaRecords");

const schema = [schemaUsers, schemaRecords];

module.exports = buildSchema(print(mergeTypeDefs(schema)));
