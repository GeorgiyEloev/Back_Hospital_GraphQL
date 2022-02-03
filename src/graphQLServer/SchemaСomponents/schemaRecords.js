module.exports = `
  type Record {
    _id: ID
    userId: ID
    patient: String
    doctor: String
    date: String
    symptoms: String
  }

  input RecordInput {
    patient: String!
    doctor: String!
    date: String!
    symptoms: String!
  }
  input RecordChange {
    _id: ID!
    patient: String
    doctor: String
    date: String
    symptoms: String
  }

  type Query {
    getAllRecords(token: String!): [Record]
  }  
  type Mutation {
    addNewRecord(input: RecordInput!, token: String!): [Record]
    removeRecord(_id: ID!, token: String!): [Record]
    changeRecord(input: RecordChange!, token: String!): [Record]
  }
`;
