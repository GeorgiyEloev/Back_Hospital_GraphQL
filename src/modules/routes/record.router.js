const express = require("express");
const router = express.Router();

const {
  getAllRecord,
  addNewRecord,
  removeRecord,
  changeRecord,
} = require("../conrtollers/record.controller");

router.get("/allRecord", getAllRecord);
router.post("/addNewRecord", addNewRecord);
router.patch("/changeRecord", changeRecord);
router.delete("/removeRecord", removeRecord);

module.exports = router;
