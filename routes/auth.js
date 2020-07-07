const express = require("express");
const {
  signup,
  signin,
  signout,
  // googleLogin,
  // facebookLogin,
} = require("../controllers/auth");

const { runValidation } = require("../validator");
const {
  userSignupValidator,
  userSigninValidator,
} = require("../validator/auth");
const { userById } = require("../controllers/user");

const router = express.Router();

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/signin", userSigninValidator, runValidation, signin);
router.get("/signout", signout);

router.param("userId", userById);

// google and facebook
// router.post("/google-login", googleLogin);
// router.post("/facebook-login", facebookLogin);

module.exports = router;
