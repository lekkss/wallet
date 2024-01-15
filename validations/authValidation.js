const Joi = require("joi");
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username: Joi.string().required(),
});

const verifySchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string()
    .length(4)
    .pattern(/^[0-9]+$/),
});

module.exports = { loginSchema, registerSchema, verifySchema };
