const Joi = require("joi");
const createBrandSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = { createBrandSchema };
