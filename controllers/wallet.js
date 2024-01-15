const { StatusCodes } = require("http-status-codes");
const { User, Wallet, Transaction } = require("../models");
const { getAuthorizationUrl, verifyTransaction } = require("../utils/paystack");
const { handleResponse } = require("../helpers/response");

const fundWallet = async (req, res) => {
  const { email, amount } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      const url = await getAuthorizationUrl(
        user.dataValues.email,
        amount * 100
      );
      res.status(StatusCodes.OK).json(
        handleResponse(StatusCodes.OK, true, "payment link generated", {
          paymentLink: url,
        })
      );
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(handleResponse(StatusCodes.BAD_REQUEST, false, "User Not found"));
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        handleResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          false,
          `${error.message}`
        )
      );
  }
};

const verifyWalletTransaction = async (req, res) => {
  const { reference } = req.body;
  try {
    const wallet = await Wallet.findOne({ where: { user_id: req.user.id } });
    if (wallet) {
      const verify = await verifyTransaction(reference);
      if (!verify.status) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            handleResponse(StatusCodes.BAD_REQUEST, false, `${verify.message}`)
          );
      } else {
        const amount = verify.data.amount / 100;
        const { balance } = wallet.dataValues;
        const newBalance = amount + Number(balance);
        const transaction = await Transaction.findOne({
          where: { reference: reference },
        });
        if (transaction == null) {
          await Wallet.update(
            { balance: Number(newBalance.toFixed(2)), updateAt: Date.now() },
            { where: { user_id: req.user.id } }
          );
          await Transaction.create({
            reference: reference,
            user_id: wallet.dataValues.user_id,
            wallet_id: wallet.dataValues.id,
            status: "completed",
            type: "credit",
            amount: amount,
            createdAt: Date.now(),
          });
          res
            .status(StatusCodes.OK)
            .json(handleResponse(StatusCodes.OK, true, `${verify.message}`));
        } else {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json(
              handleResponse(
                StatusCodes.BAD_REQUEST,
                false,
                "Transaction already verified"
              )
            );
        }
      }
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(handleResponse(StatusCodes.BAD_REQUEST, false, "User Not found"));
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        handleResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          false,
          `${error.message}`
        )
      );
  }
};

module.exports = { fundWallet, verifyWalletTransaction };
