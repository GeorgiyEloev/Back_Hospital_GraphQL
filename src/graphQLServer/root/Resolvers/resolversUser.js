const crypto = require("crypto");
const { AuthenticationError } = require("apollo-server");
require("dotenv").config();
const {
  ERR_AUTH,
  ERR_REG,
  ERR_FIND,
  ERR_SAVE,
} = require("../../../const/AuthError");
const User = require("../../../db/models/user/userSchema");
const tokenService = require("../../service/token-service");

const { HASH_ALGOR, HASH_BASE } = process.env;

const resolversUser = {
  Mutation: {
    authorizationUser: (_, args) => {
      const { login, password } = args.input;
      return User.findOne({ login })
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
              return { login, token };
            } else {
              return new Error(ERR_AUTH);
            }
          } else {
            return new Error(ERR_AUTH);
          }
        })
        .catch((err) => {
          return new Error(ERR_FIND);
        });
    },
    addNewUser: (_, args) => {
      const { login, password } = args.input;
      return User.findOne({ login })
        .then((result) => {
          if (!result) {
            const user = new User({ login, password });
            user.password = crypto
              .createHash(HASH_ALGOR)
              .update(user.password)
              .digest(HASH_BASE);
            return user
              .save()
              .then((result) => {
                const { _id, login } = result;
                const userNotPassword = {
                  _id,
                  login,
                };
                const token = tokenService.generateToken({
                  ...userNotPassword,
                });
                return { login, token };
              })
              .catch((err) => {
                return new Error(ERR_SAVE);
              });
          } else {
            return new Error(ERR_REG);
          }
        })
        .catch((err) => {
          return new Error(ERR_FIND);
        });
    },
  },
};

module.exports = resolversUser;
