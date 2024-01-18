const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const { User, Wallet, Transaction } = require("../models");
const { handleResponse } = require("../helpers/response");
const getUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
      where: { id: id },
      include: {
        model: Wallet,
        as: "wallet",
        include: { model: Transaction, as: "transactions" },
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
      },
    });
    if (!user) {
      throw new BadRequestError("User not Found");
    }
    res
      .status(StatusCodes.OK)
      .json(handleResponse(StatusCodes.OK, true, "User profile fetched", user));
  } catch (error) {
    next(error);
  }
};

const setPin = async (req, res, next) => {
  try {
    const { pin } = req.body;
    const { id } = req.user;
    const user = await User.findOne({ where: { id: id } });
    if (!user) {
      throw new BadRequestError("User not Found");
    } else {
      if (user.dataValues.pin !== null) {
        throw new BadRequestError("pin already set");
      } else {
        await User.update(
          { pin: pin, updatedAt: Date.now() },
          { where: { id: id } }
        );
        res
          .status(StatusCodes.OK)
          .json(
            handleResponse(StatusCodes.OK, true, "Pin updated successfully")
          );
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getUser, setPin };
