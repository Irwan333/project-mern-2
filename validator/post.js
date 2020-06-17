const {
    check
} = require("express-validator");

exports.createPostValidator = [
    // title
    check("title", "tulis title")
    .not()
    .isEmpty()
    .isLength({
        min: 4,
        max: 150
    })
    .withMessage("title 4 sampai 150 karakter"),

    // body
    check("body", "tulis body")
    .not()
    .isEmpty()
    .isLength({
        min: 4,
        max: 2000
    })
    .withMessage("body 4 sampai 2000 karakter")
];