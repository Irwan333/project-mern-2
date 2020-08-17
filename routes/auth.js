const express = require("express");
const {
  signup,
  signin,
  signout,
  accountActivation,
  forgotPassword,
  resetPassword,
  googleLogin,
  facebookLogin,
  // socialLogin,
  signinAdmin,
} = require("../controllers/auth");

const { runValidation } = require("../validator");
const {
  userSignupValidator,
  userSigninValidator,
  passwordResetValidator,
} = require("../validator/auth");
const { userById } = require("../controllers/user");

const router = express.Router();

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/signin", userSigninValidator, runValidation, signin);
router.post("/signin-admin", userSigninValidator, runValidation, signinAdmin);
router.get("/signout", signout);

// password forgot and reset routes
router.post("/account-activation", accountActivation);
router.put("/forgot-password", forgotPassword);
router.put(
  "/reset-password",
  passwordResetValidator,
  runValidation,
  resetPassword
);

// then use this route for social login
router.post("/google-login", googleLogin);
router.post("/facebook-login", facebookLogin);
// router.post("/social-login", socialLogin);

router.param("userId", userById);

module.exports = router;
