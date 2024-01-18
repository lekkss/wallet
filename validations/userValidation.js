const Joi = require("joi");
const createPinSchema = Joi.object({
  pin: Joi.string()
    .required()
    .length(4)
    .pattern(/^[0-9]+$/),
  confirm_pin: Joi.string().valid(Joi.ref("pin")).required().messages({
    "any.only": "pin does not match",
  }),
});

module.exports = { createPinSchema };
