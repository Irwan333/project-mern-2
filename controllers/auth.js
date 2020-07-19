const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const User = require("../models/user");
const Admin = require("../models/admin");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const { sendEmail } = require("../helpers");

// exports.signup = async (req, res) => {
//   const userExists = await User.findOne({ email: req.body.email });
//   if (userExists)
//     return res.status(403).json({
//       error: "Email is taken!",
//     });
//   const user = await new User(req.body);
//   await user.save();
//   res.status(200).json({ message: "Signup success! Please login." });
// };

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }

    const token = jwt.sign({ name, email, password }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    console.log(email);

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account activation link`,
      html: `
                <h1>Please use the following link to activate your account</h1>
                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
    };

    sendEmail(emailData)
      .then((sent) => {
        console.log("SIGNUP EMAIL SENT", sent);
        return res.json({
          message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
        });
      })
      .catch((err) => {
        // console.log('SIGNUP EMAIL SENT ERROR', err)
        return res.json({
          message: err.message,
        });
      });
  });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
        return res.status(401).json({
          error: "Expired link. Signup again",
        });
      }

      const { name, email, password } = jwt.decode(token);

      const user = new User({ name, email, password });

      user.save((err, user) => {
        if (err) {
          console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
          return res.status(401).json({
            error: "Error saving user in database. Try signup again",
          });
        }
        return res.json({
          message: "Signup success. Please signin.",
        });
      });
    });
  } else {
    return res.json({
      message: "Something went wrong. Try again.",
    });
  }
};

exports.signin = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    // if err or no user
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email does not exist. Please signup.",
      });
    }
    // if user is found make sure the email and password match
    // create authenticate method in model and use here
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }
    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    // persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // retrun response with user and token to frontend client
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};

exports.signinAdmin = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  Admin.findOne({ email }, (err, admin) => {
    // if err or no user
    if (err || !admin) {
      return res.status(401).json({
        error: "Email Salah",
      });
    }
    // if user is found make sure the email and password match
    // create authenticate method in model and use here
    if (!admin.authenticate(password)) {
      return res.status(401).json({
        error: "Password Salah!",
      });
    }

    const test = admin.role || !1;

    // console.log(test);
    // if (admin.role == !1) {
    //   return res.status(403).json({
    //     error: "Akses dilarang!",
    //   });
    // }
    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: admin._id, role: admin.role },
      process.env.JWT_SECRET
    );
    // persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // retrun response with user and token to frontend client
    const { _id, name, email, role } = admin;
    return res.json({ token, admin: { _id, email, name, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  return res.json({ message: "Signout success!" });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: "Access denied",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Admin resourse! Access denied",
    });
  }
  next();
};

exports.forgotPassword = (req, res) => {
  if (!req.body) return res.status(400).json({ message: "No request body" });
  if (!req.body.email)
    return res.status(400).json({ message: "No Email in request body" });

  console.log("forgot password finding user with that email");
  const { email } = req.body;
  console.log("signin req.body", email);
  // find the user based on email
  User.findOne({ email }, (err, user) => {
    // if err or no user
    if (err || !user)
      return res.status("401").json({
        error: "User with that email does not exist!",
      });

    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id, iss: process.env.APP_NAME },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );
    console.log(email);
    // email data
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Instructions",
      text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
      html: `<p>Please use the following link to reset your password:</p> <p>${process.env.CLIENT_URL}/reset-password/${token}</p>`,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.json({ message: err });
      } else {
        sendEmail(emailData);
        return res.status(200).json({
          message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
        });
      }
    });
  });
};

// to allow user to reset password
// first you will find the user in the database with user's resetPasswordLink
// user model's resetPasswordLink's value must match the token
// if the user's resetPasswordLink(token) matches the incoming req.body.resetPasswordLink(token)
// then we got the right user

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  User.findOne({ resetPasswordLink }, (err, user) => {
    // if err or no user
    if (err || !user)
      return res.status("401").json({
        error: "Invalid Link!",
      });

    const updatedFields = {
      password: newPassword,
      resetPasswordLink: "",
    };

    user = _.extend(user, updatedFields);
    user.updated = Date.now();

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json({
        message: `Great! Now you can login with your new password.`,
      });
    });
  });
};

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

exports.socialLogin = async (req, res) => {
  const idToken = req.body.tokenId;
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  });
  // console.log('ticket', ticket);
  const {
    email_verified,
    email,
    name,
    picture,
    sub: googleid,
  } = ticket.getPayload();

  if (email_verified) {
    console.log(`email_verified > ${email_verified}`);

    const newUser = { email, name, password: googleid };
    // try signup by finding user with req.email
    let user = User.findOne({ email }, (err, user) => {
      if (err || !user) {
        // create a new user and login
        user = new User(newUser);
        req.profile = user;
        user.save();
        // generate a token with user id and secret
        const token = jwt.sign(
          { _id: user._id, iss: process.env.APP_NAME },
          process.env.JWT_SECRET
        );
        res.cookie("t", token, { expire: new Date() + 9999 });
        // return response with user and token to frontend client
        const { _id, name, email } = user;
        return res.json({ token, user: { _id, name, email } });
      } else {
        // update existing user with new social info and login
        req.profile = user;
        user = _.extend(user, newUser);
        user.updated = Date.now();
        user.save();
        // generate a token with user id and secret
        const token = jwt.sign(
          { _id: user._id, iss: process.env.APP_NAME },
          process.env.JWT_SECRET
        );
        res.cookie("t", token, { expire: new Date() + 9999 });
        // return response with user and token to frontend client
        const { _id, name, email } = user;
        return res.json({ token, user: { _id, name, email } });
      }
    });
  }
};

// exports.socialLogin = (req, res) => {
//     console.log('social login req.body', req.body);

// // try signup by finding user with req.email
// let user = User.findOne({ email: req.body.email }, (err, user) => {
//     if (err || !user) {
//         // create a new user and login
//         user = new User(req.body);
//         req.profile = user;
//         user.save();
//         // generate a token with user id and secret
//         const token = jwt.sign({ _id: user._id, iss: process.env.APP_NAME }, process.env.JWT_SECRET);
//         res.cookie('t', token, { expire: new Date() + 9999 });
//         // return response with user and token to frontend client
//         const { _id, name, email } = user;
//         return res.json({ token, user: { _id, name, email } });
//     } else {
//         // update existing user with new social info and login
//         req.profile = user;
//         user = _.extend(user, req.body);
//         user.updated = Date.now();
//         user.save();
//         // generate a token with user id and secret
//         const token = jwt.sign({ _id: user._id, iss: process.env.APP_NAME }, process.env.JWT_SECRET);
//         res.cookie('t', token, { expire: new Date() + 9999 });
//         // return response with user and token to frontend client
//         const { _id, name, email } = user;
//         return res.json({ token, user: { _id, name, email } });
//     }
// });
// };
