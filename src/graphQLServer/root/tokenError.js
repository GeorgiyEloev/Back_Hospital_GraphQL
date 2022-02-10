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

const protectRouter = async (resolve, parent, args, context, info) => {
  const argsWithDefault = {
    userId: isAuthenticated(context.req.headers.authorization),
    ...args,
  };
  const result = await resolve(parent, argsWithDefault, context, info);
  return result;
};

const permissions = {
  Query: {
    getAllRecords: (resolve, parent, args, context, info) => {
      return protectRouter(resolve, parent, args, context, info);
    },
  },
  Mutation: {
    addNewRecord: (resolve, parent, args, context, info) => {
      return protectRouter(resolve, parent, args, context, info);
    },
    removeRecord: (resolve, parent, args, context, info) => {
      return protectRouter(resolve, parent, args, context, info);
    },
    changeRecord: (resolve, parent, args, context, info) => {
      return protectRouter(resolve, parent, args, context, info);
    },
  },
};

module.exports = permissions;
