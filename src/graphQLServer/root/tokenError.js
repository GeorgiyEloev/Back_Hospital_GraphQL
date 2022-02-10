const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");
require("dotenv").config();

const isAuthenticated = (authHeader) => {
  if (authHeader) {
    // Bearer [token]
    // Получаем токен
    const token = authHeader.split("Bearer ")[1];

    if (token) {
      try {
        // Проверяем аутентификацию
        const user = jwt.verify(token, process.env.JWT_KEY);
        return user._id;
      } catch (err) {
        throw new Error("Неправильный/Устаревший токен");
      }
    } else {
      throw new Error("Токен аутентификации должен иметь вид 'Bearer [token]'");
    }
  } else {
    throw new Error('Должен быть предоставлен HTTP-заголовок "Authorization"');
  }
};
const permissions = {
  Query: {
    getAllRecords: async (resolve, parent, args, context, info) => {
      const argsWithDefault = {
        userId: isAuthenticated(context.req.headers.authorization),
        ...args,
      };
      const result = await resolve(parent, argsWithDefault, context, info);
      return result;
    },
  },
  Mutation: {
    addNewRecord: async (resolve, parent, args, context, info) => {
      const argsWithDefault = {
        userId: isAuthenticated(context.req.headers.authorization),
        ...args,
      };
      const result = await resolve(parent, argsWithDefault, context, info);
      return result;
    },
    removeRecord: async (resolve, parent, args, context, info) => {
      const argsWithDefault = {
        userId: isAuthenticated(context.req.headers.authorization),
        ...args,
      };
      const result = await resolve(parent, argsWithDefault, context, info);
      return result;
    },
    changeRecord: async (resolve, parent, args, context, info) => {
      const argsWithDefault = {
        userId: isAuthenticated(context.req.headers.authorization),
        ...args,
      };
      const result = await resolve(parent, argsWithDefault, context, info);
      return result;
    },
  },
};

module.exports = permissions;
