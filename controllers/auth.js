const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const User = require("../models/user");
const Admin = require("../models/admin");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const { sendEmail } = require("../helpers");
const fetch = require("node-fetch");
// const activation = require("../style/jade/activation.html");
// const css = require("../style/activation.css");

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
      subject: `Link aktivasi akun`,
      html: `
 <head>
 <link
  href="https://fonts.googleapis.com/css?family=Lato:300,400,700"
  rel="stylesheet"
/>
<style>
  html,
  body {
    margin: 0 auto !important;
    padding: 0 !important;
    height: 100% !important;
    width: 100% !important;
    background: #f1f1f1;
  }
  * {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }
  div[style*="margin: 16px 0"] {
    margin: 0 !important;
  }
  table {
    border-spacing: 0 !important;
    border-collapse: collapse !important;
    table-layout: fixed !important;
    margin: 0 auto !important;
  }
  img {
    -ms-interpolation-mode: bicubic;
  }
  a {
    text-decoration: none;
  }
  *[x-apple-data-detectors],  /* iOS */
.unstyle-auto-detected-links *,
.aBn {
    border-bottom: 0 !important;
    cursor: default !important;
    color: inherit !important;
    text-decoration: none !important;
    font-size: inherit !important;
    font-family: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
  }
  .a6S {
    display: none !important;
    opacity: 0.01 !important;
  }
  .im {
    color: inherit !important;
  }
  img.g-img + div {
    display: none !important;
  }
  @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
    u ~ div .email-container {
      min-width: 320px !important;
    }
  }
  @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
    u ~ div .email-container {
      min-width: 375px !important;
    }
  }
  @media only screen and (min-device-width: 414px) {
    u ~ div .email-container {
      min-width: 414px !important;
    }
  }
</style>
<style>
  .primary {
    background: #30e3ca;
  }
  .bg_white {
    background: #ffffff;
  }
  .bg_light {
    background: #fafafa;
  }
  .bg_black {
    background: #000000;
  }
  .bg_dark {
    background: rgba(0, 0, 0, 0.8);
  }
  .email-section {
    padding: 2.5em;
  }
  .btn {
    padding: 10px 15px;
    display: inline-block;
  }
  .btn.btn-primary {
    border-radius: 5px;
    background: #30e3ca;
    color: #ffffff;
  }
  .btn.btn-white {
    border-radius: 5px;
    background: #ffffff;
    color: #000000;
  }
  .btn.btn-white-outline {
    border-radius: 5px;
    background: transparent;
    border: 1px solid #fff;
    color: #fff;
  }
  .btn.btn-black-outline {
    border-radius: 0px;
    background: transparent;
    border: 2px solid #000;
    color: #000;
    font-weight: 700;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: "Lato", sans-serif;
    color: #000000;
    margin-top: 0;
    font-weight: 400;
  }

  body {
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-size: 15px;
    line-height: 1.8;
    color: rgba(0, 0, 0, 0.4);
  }

  a {
    color: #30e3ca;
  }
  .logo h1 {
    margin: 0;
  }
  .logo h1 a {
    color: #30e3ca;
    font-size: 24px;
    font-weight: 700;
    font-family: "Lato", sans-serif;
  }
  .hero {
    position: relative;
    z-index: 0;
  }

  .hero .text {
    color: rgba(0, 0, 0, 0.3);
  }
  .hero .text h2 {
    color: #000;
    font-size: 40px;
    margin-bottom: 0;
    font-weight: 400;
    line-height: 1.4;
  }
  .hero .text h3 {
    font-size: 24px;
    font-weight: 300;
  }
  .hero .text h2 span {
    font-weight: 600;
    color: #30e3ca;
  }
  .heading-section h2 {
    color: #000000;
    font-size: 28px;
    margin-top: 0;
    line-height: 1.4;
    font-weight: 400;
  }
  .heading-section .subheading {
    margin-bottom: 20px !important;
    display: inline-block;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: rgba(0, 0, 0, 0.4);
    position: relative;
  }
  .heading-section .subheading::after {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -10px;
    content: "";
    width: 100%;
    height: 2px;
    background: #30e3ca;
    margin: 0 auto;
  }

  .heading-section-white {
    color: rgba(255, 255, 255, 0.8);
  }
  .heading-section-white h2 {
    line-height: 1;
    padding-bottom: 0;
  }
  .heading-section-white h2 {
    color: #ffffff;
  }
  .heading-section-white .subheading {
    margin-bottom: 0;
    display: inline-block;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.4);
  }

  ul.social {
    padding: 0;
  }
  ul.social li {
    display: inline-block;
    margin-right: 10px;
  }
  .footer {
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.5);
  }
  .footer .heading {
    color: #000;
    font-size: 20px;
  }
  .footer ul {
    margin: 0;
    padding: 0;
  }
  .footer ul li {
    list-style: none;
    margin-bottom: 10px;
  }
  .footer ul li a {
    color: rgba(0, 0, 0, 1);
  }
</style>
 </head> 
<body
  width="100%"
  style="margin: 0; padding: 0 !important; background-color: #f1f1f1;"
>
  <center style="width: 100%; background-color: #f1f1f1;">
    <div style="max-width: 600px; margin: 0 auto;" class="email-container">
      <table
        align="center"
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        border="0"
        width="100%"
        style="margin: auto;"
      >
        <tr>
          <td valign="top" class="bg_white" style="padding: 1em 2.5em 0 2.5em;">
            <table
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
              width="100%"
            >
              <tr>
                <td class="logo" style="text-align: center;">
                  <h1><a href="${process.env.CLIENT_URL}">Aqua Mania</a></h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td
            valign="middle"
            class="hero bg_white"
            style="padding: 3em 0 2em 0;"
          >
            <img
              src="../style/img/email.png"
              alt=""
              style="
                width: 300px;
                max-width: 600px;
                height: auto;
                margin: auto;
                display: block;
              "
            />
          </td>
        </tr>
        <tr>
          <td
            valign="middle"
            class="hero bg_white"
            style="padding: 2em 0 4em 0;"
          >
            <table>
              <tr>
                <td>
                  <div
                    class="text"
                    style="padding: 0 2.5em; text-align: center;"
                  >
                    <h2>Aktivasi Email</h2>
                    <h3>Jika ini bukan Anda, abaikan!</h3>
                    <p>
                      <a
                        href="${process.env.CLIENT_URL}/auth/activate/${token}"
                        class="btn btn-primary"
                        >Aktivasi</a
                      >
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </center>
</body>
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
        console.log(user);
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
  // User.findOne({ email }, (err, user) => {
  User.findOne({ email }).exec((err, user) => {
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
    // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "7d",
    // });
    // persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // retrun response with user and token to frontend client
    const { _id, name, email, role } = user;
    return res.json({
      token,
      _id: _id,
      email: email,
      name: name,
      role: role,
    });
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
    return res.json({
      token,
      _id: _id,
      email: email,
      name: name,
      role: role,
    });
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
      text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/auth/password/reset/${token}`,
      html: `<p>Please use the following link to reset your password:</p> <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>`,
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

  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_SECRET, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(400).json({
          error: "Expired link. Try again",
        });
      }

      User.findOne({ resetPasswordLink }, (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "Something went wrong. Try later",
          });
        }

        const updatedFields = {
          password: newPassword,
          resetPasswordLink: "",
        };

        user = _.extend(user, updatedFields);

        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: "Error resetting user password",
            });
          }
          res.json({
            message: `Great! Now you can login with your new password`,
          });
        });
      });
    });
  }
};

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const idToken = req.body.tokenId;
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  });
  // console.log('ticket', ticket);
  const { email_verified, email, name, sub: googleid } = ticket.getPayload();

  if (email_verified) {
    console.log(`email_verified > ${email_verified}`);

    const newUser = { email, name, password: googleid };
    // try signup by finding user with req.email
    User.findOne({ email }, (err, user) => {
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
        return res.json(token);
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
        const { _id, name, email, role } = user;
        return res.json({
          token,
          _id: _id,
          email: email,
          name: name,
          role: role,
        });
      }
    });
  }
};

exports.facebookLogin = (req, res) => {
  // console.log("FACEBOOK LOGIN REQ BODY", req.body);
  const { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v8.0/${userID}/?fields=id,name,email&access_token=${accessToken}`;
  // console.log(url);
  fetch(url, {
    method: "GET",
  })
    .then((response) => {
      // console.log("signin response: ", response);
      return response.json();
    })
    .then((response) => {
      const { email, name } = response;
      User.findOne({ email }).exec((err, user) => {
        if (user) {
          const token = jwt.sign(
            { _id: user._id, iss: process.env.APP_NAME },
            process.env.JWT_SECRET
          );
          res.cookie("t", token, { expire: new Date() + 9999 });
          const { _id, email, name, role } = user;
          return res.json({
            token,
            _id: _id,
            email: email,
            name: name,
            role: role,
          });
        } else {
          let password = email + process.env.JWT_SECRET;
          user = new User({ name, email, password });
          user.save((err, data) => {
            if (err) {
              console.log("ERROR FACEBOOK LOGIN ON USER SAVE", err);
              return res.status(400).json({
                error: "User signup failed with facebook",
              });
            }
            const token = jwt.sign(
              { _id: user._id, iss: process.env.APP_NAME },
              process.env.JWT_SECRET
            );
            res.cookie("t", token, { expire: new Date() + 9999 });
            const { _id, email, name, role } = data;
            return res.json({
              token,
              _id: _id,
              email: email,
              name: name,
              role: role,
            });
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
