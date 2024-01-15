const bcrypt = require("bcryptjs");
const { BadRequestError } = require("../errors/index.js");
const { User, Wallet, Transaction } = require("../models");
const { handleResponse } = require("../helpers/response.js");
const { StatusCodes } = require("http-status-codes");
const generateToken = require("../utils/token.js");

const register = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    if (await User.findOne({ where: { username: username } })) {
      throw new BadRequestError(`user with username: ${username} exists`);
    } else if (await User.findOne({ where: { email: email } })) {
      throw new BadRequestError(`user with email: ${email} exists`);
    } else {
      let hashedPassword = await bcrypt.hash(password, 8);
      //   const otp = await generateOtp();
      await User.create({
        ...req.body,
        role: "user",
        createdAt: new Date(),
        password: hashedPassword,
      });
      const newUser = await User.findOne({ where: { email: email } });
      console.log(newUser);
      if (newUser) {
        await Wallet.create({
          createdAt: Date.now(),
          user_id: newUser.dataValues.id,
        });
        res
          .status(StatusCodes.CREATED)
          .json(
            handleResponse(
              StatusCodes.CREATED,
              true,
              "User Created Successfully"
            )
          );
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            handleResponse(
              StatusCodes.BAD_REQUEST,
              false,
              "Sorry, an error occurred while creating user"
            )
          );
      }
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

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.scope("withPassword").findOne({
      where: { username: username },
      include: {
        model: Wallet,
        as: "wallet",
        include: { model: Transaction, as: "transactions" },
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
      },
    });
    if (user == null) {
      throw new BadRequestError("Invalid email");
    } else if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestError("Invalid password provided");
    } else {
      const token = generateToken(user.id, user.username, user.role);
      if (token) {
        res.status(StatusCodes.OK).json(
          handleResponse(StatusCodes.OK, true, "Login successful", {
            user: { ...omitPassword(user.get()) },
            token: token,
          })
        );
      }
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

function omitPassword(user) {
  const { password, ...userWithoutHash } = user;
  return userWithoutHash;
}
module.exports = { register, login };
