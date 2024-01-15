"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Wallet }) {
      // define association here
      this.belongsTo(User, { foreignKey: "user_id" });
      this.belongsTo(Wallet, { foreignKey: "wallet_id" });
    }
  }
  Transaction.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      reference: DataTypes.STRING,
      amount: DataTypes.DECIMAL,
      status: DataTypes.ENUM("completed", "failed", "reversed", "pending"),
      type: DataTypes.ENUM("debit", "credit"),
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
