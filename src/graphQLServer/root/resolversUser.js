const crypto = require("crypto");
require("dotenv").config();
const User = require("../../db/models/user/userSchema");
const tokenService = require("../../modules/service/token-service");

const { HASH_ALGOR, HASH_BASE } = process.env;

const resolversUser = {
  addNewUser: ({ input }) => {
    const { login, password } = input;
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
              const token = tokenService.generateToken({ ...userNotPassword });
              return { login, token };
            })
            .catch((err) => {
              return new Error(
                '{ status: 421, text: "Error, user does not save!!!" }'
              );
            });
        } else {
          return new Error('{ status: 404, text: "Error, login is busy!!!" }');
        }
      })
      .catch((err) => {
        return new Error(
          '{ status: 419, text: "Error. An error occurred during the search!!!" }'
        );
      });
  },
  authorizationUser: ({ input }) => {
    const { login, password } = input;
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
            return new Error(
              '{ status: 401, text: "Error, invalid password!!!" }'
            );
          }
        } else {
          return new Error(
            '{ status: 404, text: "Error, the login does not exist!!!" }'
          );
        }
      })
      .catch((err) => {
        return new Error(
          '{ status: 419, text: "Error. An error occurred during the search!!!" }'
        );
      });
  },
};

module.exports = resolversUser;
