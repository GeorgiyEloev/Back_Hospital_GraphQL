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
    getAllRecords: [Record]
  }  
  type Mutation {
    addNewRecord(input: RecordInput!): [Record]
    removeRecord(_id: ID! ): [Record]
    changeRecord(input: RecordChange!): [Record]
  }
`;
