const express = require("express");
const router = express.Router();

const {
  addNewUser,
  authorizationUser,
} = require("../conrtollers/user.controller");

router.post("/addNewUser", addNewUser);
router.post("/authorizationUser", authorizationUser);

module.exports = router;
