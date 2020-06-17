const {
    check
} = require("express-validator");

exports.userSignupValidator = [
    check("name")
    .not()
    .isEmpty()
    .withMessage("Nama harus diisi"),
    check("email")
    .not()
    .isEmpty()
    .withMessage("Email harus diisi")
    .isEmail()
    .withMessage("Email tidak valid"),
    check("password")
    .isLength({
        min: 8
    })
    .withMessage("password minimal 8 karakter")
    .matches(/\d/)
    .withMessage("Password harus mengandung angka")
    // .matches(/[^A-Za-z0-9]/)
    // .withMessage("Password harus mengandung karakter spesial")
];

exports.userSigninValidator = [
    check("email")
    .isEmail()
    .withMessage("Email tidak valid"),
    check("password")
    .isLength({
        min: 8
    })
    .withMessage("password minimal 8 karakter")
];

exports.forgotPasswordValidator = [
    check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Email tidak valid")
];

exports.resetPasswordValidator = [
    check("newPassword")
    .not()
    .isEmpty()
    .isLength({
        min: 8
    })
    .withMessage("password minimal 8 karakter")
];