const express = require("express");
const { setPin, getUser } = require("../controllers/user");
const validateRequest = require("../middlewares/validate");
const { createPinSchema } = require("../validations/userValidation");

const router = express.Router();

router.get("", getUser);
router.post("/pin", validateRequest(createPinSchema), setPin);

module.exports = router;
