const express = require("express");
const { login, register } = require("../controllers/auth");
const validateRequest = require("../middlewares/validate");
const {
  loginSchema,
  registerSchema,
} = require("../validations/authValidation");
const {
  fundWallet,
  verifyWalletTransaction,
} = require("../controllers/wallet");
const router = express.Router();

router.post("/get-link", fundWallet);
router.post("/verify", verifyWalletTransaction);

module.exports = router;
