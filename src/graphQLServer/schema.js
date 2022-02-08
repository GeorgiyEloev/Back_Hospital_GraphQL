const { gql } = require("apollo-server");
const { print } = require("graphql");
const { mergeTypeDefs } = require("@graphql-tools/merge");
const schemaUsers = require("./SchemaСomponents/schemaUsers");
const schemaRecords = require("./SchemaСomponents/schemaRecords");

const schema = [schemaUsers, schemaRecords];

module.exports = gql`
  ${print(mergeTypeDefs(schema))}
`;
