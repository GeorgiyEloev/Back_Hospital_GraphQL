const Record = require("../../db/models/reception/recordSchema");
const jwt = require("jsonwebtoken");

const resolvers = {
  getAllRecords: ({ token }) => {
    return jwt.verify(token, process.env.JWT_KEY, (err, data) => {
      if (err)
        return new Error('{ status: 401, text: "Error, corrupted token!!!" }');
      const userId = data._id;
      return Record.find({ userId }, [
        "_id",
        "patient",
        "doctor",
        "date",
        "symptoms",
      ])
        .then((result) => {
          return result;
        })
        .catch((err) => {
          return new Error(
            '{ status: 419, text: "Error. An error occurred during the search!!!" }'
          );
        });
    });
  },
  addNewRecord: ({ input, token }) => {
    const { patient, doctor, date, symptoms } = input;
    return jwt.verify(token, process.env.JWT_KEY, (err, data) => {
      if (err)
        return new Error('{ status: 401, text: "Error, corrupted token!!!" }');
      const userId = data._id;
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
      return record
        .save()
        .then(() => {
          return Record.find({ userId }, [
            "_id",
            "patient",
            "doctor",
            "date",
            "symptoms",
          ])
            .then((result) => {
              return result;
            })
            .catch((err) => {
              return new Error(
                '{ status: 419, text: "Error. An error occurred during the search!!!" }'
              );
            });
        })
        .catch((err) => {
          return new Error(
            '{ status: 421, text: "Error, record doesn\'t save!!!" }'
          );
        });
    });
  },
  removeRecord: ({ _id, token }) => {
    return jwt.verify(token, process.env.JWT_KEY, (err, data) => {
      if (err)
        return new Error('{ status: 401, text: "Error, corrupted token!!!" }');
      const userId = data._id;
      return Record.findByIdAndRemove(_id)
        .then((result) => {
          if (result) {
            return Record.find({ userId }, [
              "_id",
              "patient",
              "doctor",
              "date",
              "symptoms",
            ])
              .then((result) => {
                return result;
              })
              .catch((err) => {
                return new Error(
                  '{ status: 419, text: "Error. An error occurred during the search!!!" }'
                );
              });
          } else {
            return new Error(
              '{ status: 404, text: "Error, record does not exist!!!" }'
            );
          }
        })
        .catch((err) => {
          return new Error(
            '{ status: 419, text: "Error. An error occurred during the delete!!!" }'
          );
        });
    });
  },
  changeRecord: ({ input, token }) => {
    const { _id, patient, doctor, date, symptoms } = input;
    return jwt.verify(token, process.env.JWT_KEY, (err, data) => {
      if (err)
        return new Error('{ status: 401, text: "Error, corrupted token!!!" }');
      const userId = data._id;
      const recordUpdate = {};

      if (_id) {
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
        return Record.findByIdAndUpdate(_id, recordUpdate)
          .then((result) => {
            return Record.find({ userId })
              .then((result) => {
                return result;
              })
              .catch((err) => {
                return new Error(
                  '{ status: 419, text: "Error. An error occurred during the search!!!" }'
                );
              });
          })
          .catch((err) => {
            return new Error(
              '{ status: 419, text: "Error. An error occurred during the update!!!" }'
            );
          });
      } else {
        return new Error('{ status: 422, text: "Error! Invalid ID!!!!" }');
      }
    });
  },
};

const checkUpdate = (key, obj1, obj2) => {
  if (obj1.hasOwnProperty(`${key}`) && obj1[key].trim()) {
    obj2[key] = obj1[key].trim();
  }
};

module.exports = resolvers;
