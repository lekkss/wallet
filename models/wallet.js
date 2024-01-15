"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Transaction }) {
      // define association here
      this.belongsTo(User, { foreignKey: "user_id" });
      this.hasMany(Transaction, {
        foreignKey: "wallet_id",
        as: "transactions",
      });
    }
  }
  Wallet.init(
    {
      balance: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Wallet",
    }
  );
  return Wallet;
};
