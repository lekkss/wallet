const express = require("express");
const {
  fundWallet,
  verifyWalletTransaction,
  transferFund,
  getTransactions,
} = require("../controllers/wallet");
const router = express.Router();

router.post("/get-link", fundWallet);
router.post("/verify", verifyWalletTransaction);
router.post("/transfer", transferFund);
router.get("/transactions", getTransactions);

module.exports = router;
