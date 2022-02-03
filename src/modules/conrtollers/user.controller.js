const crypto = require("crypto");
require("dotenv").config();
const User = require("../../db/models/user/userSchema");
const tokenService = require("../service/token-service");

const { HASH_ALGOR, HASH_BASE } = process.env;

module.exports.addNewUser = (req, res) => {
  User.findOne({ login: req.body.login })
    .then((result) => {
      if (!result) {
        if (
          req.body.hasOwnProperty("login") &&
          req.body.hasOwnProperty("password") &&
          req.body.password.trim() &&
          req.body.login.trim()
        ) {
          const user = new User(req.body);
          user.password = crypto
            .createHash(HASH_ALGOR)
            .update(user.password)
            .digest(HASH_BASE);
          user
            .save()
            .then((result) => {
              const { _id, login } = result;
              const userNotPassword = {
                _id,
                login,
              };
              const token = tokenService.generateToken({ ...userNotPassword });
              res.send({ data: { login, token } });
            })
            .catch((err) => {
              res.status(421).send("Error, user doesn't save!!!");
            });
        } else {
          res.status(422).send("Error, incorrect data!!!");
        }
      } else {
        res.status(404).send("Error, login is busy!!!");
      }
    })
    .catch((err) => {
      res.status(419).send("Error. An error occurred during the search!!!");
    });
};

module.exports.authorizationUser = (req, res) => {
  const { login, password } = req.body;
  User.findOne({ login })
    .then((result) => {
      if (result) {
        const hash = crypto
          .createHash(HASH_ALGOR)
          .update(password)
          .digest(HASH_BASE);
        if (hash === result.password) {
          const { _id } = result;
          const userNotPassword = {
            _id,
            login,
          };
          const token = tokenService.generateToken({ ...userNotPassword });
          res.send({ data: { login, token } });
        } else {
          res.status(401).send("Error, invalid password!!!");
        }
      } else {
        res.status(404).send("Error, the login does not exist!!!");
      }
    })
    .catch((err) => {
      res.status(419).send("Error. An error occurred during the search!!!");
    });
};
