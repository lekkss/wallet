const { StatusCodes } = require("http-status-codes");
const { User, Wallet, Transaction } = require("../models");
const { getAuthorizationUrl, verifyTransaction } = require("../utils/paystack");
const { handleResponse } = require("../helpers/response");
const { BadRequestError } = require("../errors/index.js");
const generateReference = require("../utils/generateReference.js");

const fundWallet = async (req, res, next) => {
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
    next(error);
  }
};

const verifyWalletTransaction = async (req, res, next) => {
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
    next(error);
  }
};

const transferFund = async (req, res, next) => {
  try {
    const { username, amount, pin } = req.body;
    const { id } = req.user;
    const senderWallet = await Wallet.findOne({
      where: { user_id: id },
      include: User,
    });
    const { balance } = senderWallet.dataValues;
    if (balance < amount) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          handleResponse(StatusCodes.BAD_REQUEST, false, "Insufficient funds")
        );
    } else {
      const recipientWallet = await User.findOne({
        where: { username: username },
        include: {
          model: Wallet,
          as: "wallet",
        },
      });
      if (recipientWallet == null) {
        throw new BadRequestError("Recipient not found");
      } else if (pin !== senderWallet.User.dataValues.pin) {
        throw new BadRequestError("Incorrect pin");
      } else {
        const { user_id, balance: receiverBalance } =
          recipientWallet.wallet.dataValues;
        //sender
        const senderBalance = balance - amount;
        await Wallet.update(
          { balance: Number(senderBalance), updateAt: Date.now() },
          { where: { user_id: id } }
        );
        await Transaction.create({
          reference: generateReference(false),
          user_id: id,
          wallet_id: senderWallet.dataValues.id,
          status: "completed",
          type: "debit",
          amount: amount,
          createdAt: Date.now(),
        });

        //receiver
        const newReceiverBalance = Number(receiverBalance) + amount;
        console.log(newReceiverBalance);
        await Wallet.update(
          { balance: Number(newReceiverBalance), updateAt: Date.now() },
          { where: { user_id: user_id } }
        );
        await Transaction.create({
          reference: generateReference(true),
          user_id: user_id,
          wallet_id: recipientWallet.dataValues.id,
          status: "completed",
          type: "credit",
          amount: amount,
          createdAt: Date.now(),
        });
        res
          .status(StatusCodes.OK)
          .json(handleResponse(StatusCodes.OK, true, "transaction completed"));
      }
    }
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      where: { user_id: req.user.id },
    });
    if (transactions) {
      res
        .status(StatusCodes.OK)
        .json(
          handleResponse(
            StatusCodes.OK,
            true,
            "Transactions Fetched successfully",
            transactions
          )
        );
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          handleResponse(StatusCodes.BAD_REQUEST, false, "User does not exist")
        );
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fundWallet,
  verifyWalletTransaction,
  transferFund,
  getTransactions,
};
