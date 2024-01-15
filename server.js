require("express-async-errors");
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
//
const auth = require("./middlewares/auth");
const authRouter = require("./routes/auth");
const walletRouter = require("./routes/wallet");
const db = require("./models/index");
// const { redisConnect } = require("./services/redis");
// redisConnect();

// Error handlers
const notFound = require("./middlewares/not-found.js");
const errorHandler = require("./middlewares/error-handler.js");
//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

//
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/wallet", auth("user"), walletRouter);

// initializing express middlewares
app.use(notFound);
app.use(errorHandler);

//
const PORT = process.env.PORT || 8080;
const start = async () => {
  try {
    app.listen(PORT, () => {
      db.sequelize.sync();
      console.log(`Server is listenning on PORT: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
