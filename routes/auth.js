const express = require("express");
const { login, register } = require("../controllers/auth");
const validateRequest = require("../middlewares/validate");
const {
  loginSchema,
  registerSchema,
} = require("../validations/authValidation");
const router = express.Router();

router.post("/login", validateRequest(loginSchema), login);
router.post("/register", validateRequest(registerSchema), register);

module.exports = router;
