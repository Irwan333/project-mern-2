const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ObjectId } = mongoose.Schema;

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    updated: Date,
    photo: {
      data: Buffer,
      contentType: String,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// virtual
adminSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = bcrypt.genSaltSync(8);
    this.hashed_password = bcrypt.hashSync(password, this.salt);
  })
  .get(function () {
    return this._password;
  });

// methods
adminSchema.methods = {
  authenticate: function (plainText) {
    return bcrypt.compareSync(plainText, this.hashed_password);
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      // return crypto
      //   .createHmac("sha1", this.salt)
      //   .update("I love cupcakes")
      //   .digest("hex");
      return bcrypt.compareSync(password, this.hashed_password);
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

// // hash password
// adminSchema.methods.hashPassword = function (password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// }

// // check password
// adminSchema.methods.checkPassword = function (password) {
//   return bcrypt.compareSync(password, this.hashed_password);
// };

const Admin = mongoose.model("Admin", adminSchema);
// module.exports = { Admin };
module.exports = Admin;
