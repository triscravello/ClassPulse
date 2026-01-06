// schemas/authSchema.js

const Joi = require('joi');

// signupSchema with password rules
exports.signupSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().min(6).pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/).message("Password must contain at least one letter and one number").required(),
}).options({ allowUnknown: false }); // disallow unknown fields

exports.loginSchema = Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().required(),
}).options({ allowUnknown: false }); // disallow unknown fields