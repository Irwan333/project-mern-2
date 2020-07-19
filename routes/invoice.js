const express = require("express");
const router = express.Router();

const { requireSignin } = require("../controllers/auth");
const {
  listOrdersUser,
  getStatusValuesUser,
} = require("../controllers/invoice");

router.get("/invoice/list/:userId", requireSignin, listOrdersUser);
router.get(
  "/invoice/status-values/:userId",
  requireSignin,
  getStatusValuesUser
);

module.exports = router;
