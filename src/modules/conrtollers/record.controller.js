const jwt = require("jsonwebtoken");
const Record = require("../../db/models/reception/recordSchema");

module.exports.getAllRecord = (req, res) => {
  const { authorization } = req.headers;
  jwt.verify(authorization, process.env.JWT_KEY, (err, data) => {
    if (err) return res.status(401).send("Error, corrupted token!!!");
    const userId = data._id;
    Record.find({ userId }, ["_id", "patient", "doctor", "date", "symptoms"])
      .then((result) => {
        res.send({ data: result });
      })
      .catch((err) => {
        res.status(419).send("Error. An error occurred during the search!!!");
      });
  });
};

module.exports.addNewRecord = (req, res) => {
  const { authorization } = req.headers;
  const { patient, doctor, date, symptoms } = req.body;
  jwt.verify(authorization, process.env.JWT_KEY, (err, data) => {
    if (err) return res.status(401).send("Error, corrupted token!!!");
    if (
      req.body.hasOwnProperty("patient") &&
      req.body.patient.trim() &&
      req.body.hasOwnProperty("doctor") &&
      req.body.doctor.trim() &&
      req.body.hasOwnProperty("symptoms") &&
      req.body.symptoms.trim()
    ) {
      let dateNew;
      new Date(date).toString() !== "Invalid Date" &&
      new Date(date) >= new Date("01-01-2021") &&
      new Date(date) <= new Date("12-31-2022")
        ? (dateNew = date)
        : (dateNew = new Date());
      const recordNew = {
        userId: data._id,
        patient,
        doctor,
        date: dateNew,
        symptoms,
      };
      const record = new Record(recordNew);
      record
        .save()
        .then((result) => {
          const { userId } = result;
          Record.find({ userId }, [
            "_id",
            "patient",
            "doctor",
            "date",
            "symptoms",
          ])
            .then((result) => {
              res.send({ data: result });
            })
            .catch((err) => {
              res
                .status(419)
                .send("Error. An error occurred during the search!!!");
            });
        })
        .catch((err) => {
          res.status(421).send("Error, record doesn't save!!!");
        });
    } else {
      res.status(422).send("Error, incorrect data!!!");
    }
  });
};

module.exports.removeRecord = (req, res) => {
  const { authorization } = req.headers;
  jwt.verify(authorization, process.env.JWT_KEY, (err, data) => {
    if (err) return res.status(401).send("Error, corrupted token!!!");
    const id = req.body._id;
    Record.deleteOne({ _id: id })
      .then((result) => {
        if (result.deletedCount) {
          const userId = data._id;
          Record.find({ userId }, [
            "_id",
            "patient",
            "doctor",
            "date",
            "symptoms",
          ])
            .then((result) => {
              res.send({ data: result });
            })
            .catch((err) => {
              res
                .status(419)
                .send("Error. An error occurred during the search!!!");
            });
        } else {
          res.status(404).send("Error, record does not exist!!!");
        }
      })
      .catch((err) => {
        res.status(419).send("Error. An error occurred during the delete!!!");
      });
  });
};

module.exports.changeRecord = (req, res) => {
  const { authorization } = req.headers;
  jwt.verify(authorization, process.env.JWT_KEY, (err, data) => {
    if (err) return res.status(401).send("Error, corrupted token!!!");

    const body = req.body;
    const recordUpdate = {};

    if (body.hasOwnProperty("_id") && body._id.trim()) {
      new Date(body.date).toString() !== "Invalid Date" &&
      new Date(body.date) >= new Date("01-01-2021") &&
      new Date(body.date) <= new Date("12-31-2022")
        ? (recordUpdate.date = body.date)
        : body;
      const checkKeys = ["patient", "doctor", "symptoms"];
      for (let i in checkKeys) {
        checkUpdate(checkKeys[i], body, recordUpdate);
      }
      Record.updateOne({ _id: body._id }, recordUpdate)
        .then((result) => {
          const userId = data._id;
          Record.find({ userId }, [
            "_id",
            "patient",
            "doctor",
            "date",
            "symptoms",
          ])
            .then((result) => {
              res.send({ data: result });
            })
            .catch((err) => {
              res
                .status(419)
                .send("Error. An error occurred during the search!!!");
            });
        })
        .catch((err) => {
          res.status(419).send("Error. An error occurred during the update!!!");
        });
    } else {
      res.status(422).send("Error! Invalid ID!!!!");
    }
  });
};

const checkUpdate = (key, obj1, obj2) => {
  if (obj1.hasOwnProperty(`${key}`) && obj1[key].trim()) {
    obj2[key] = obj1[key].trim();
  }
};
