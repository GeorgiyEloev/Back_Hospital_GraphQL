const Record = require("../../../db/models/reception/recordSchema");

const resolvers = {
  Query: {
    async getAllRecords(_, args, context) {
      try {
        const userId = req.userId;

        return Record.find({ userId }, [
          "_id",
          "patient",
          "doctor",
          "date",
          "symptoms",
        ]);
      } catch (err) {
        return err;
      }
    },
  },
  Mutation: {
    addNewRecord: async ({ input }, req) => {
      try {
        console.log(req);
        const { patient, doctor, date, symptoms } = input;
        const userId = req.userId;

        let dateNew;
        new Date(date).toString() !== "Invalid Date" &&
        new Date(date) >= new Date("01-01-2021") &&
        new Date(date) <= new Date("12-31-2022")
          ? (dateNew = date)
          : (dateNew = new Date());

        const record = new Record({
          userId,
          patient,
          doctor,
          date: dateNew,
          symptoms,
        });

        await record.save();

        return Record.find({ userId }, [
          "_id",
          "patient",
          "doctor",
          "date",
          "symptoms",
        ]);
      } catch (err) {
        return err;
      }
    },
    removeRecord: async ({ _id }, req) => {
      try {
        const userId = req.userId;

        await Record.findByIdAndRemove(_id);

        return Record.find({ userId }, [
          "_id",
          "patient",
          "doctor",
          "date",
          "symptoms",
        ]);
      } catch (err) {
        return err;
      }
    },
    changeRecord: async ({ input }, req) => {
      try {
        const { _id, patient, doctor, date, symptoms } = input;
        const userId = req.userId;
        const recordUpdate = {};

        new Date(date).toString() !== "Invalid Date" &&
        new Date(date) >= new Date("01-01-2021") &&
        new Date(date) <= new Date("12-31-2022")
          ? (recordUpdate.date = date)
          : date;

        const checkKeys = ["patient", "doctor", "symptoms"];
        const inputObj = { patient, doctor, symptoms };
        for (let i in checkKeys) {
          checkUpdate(checkKeys[i], inputObj, recordUpdate);
        }

        await Record.findByIdAndUpdate(_id, recordUpdate);

        return Record.find({ userId }, [
          "_id",
          "patient",
          "doctor",
          "date",
          "symptoms",
        ]);
      } catch (err) {
        return err;
      }
    },
  },
};

const checkUpdate = (key, obj1, obj2) => {
  if (obj1.hasOwnProperty(`${key}`) && obj1[key].trim()) {
    obj2[key] = obj1[key].trim();
  }
};

module.exports = resolvers;
