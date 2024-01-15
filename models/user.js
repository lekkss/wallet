"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Wallet, Transaction }) {
      // define association here
      this.hasOne(Wallet, { foreignKey: "user_id", as: "wallet" });
      this.hasMany(Transaction, { foreignKey: "user_id" });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      username: DataTypes.STRING,
      role: DataTypes.ENUM("user", "admin"),
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      pin: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "User",
      defaultScope: {
        // exclude password by default
        attributes: { exclude: ["password"] },
      },
      scopes: {
        // include password with this scope
        withPassword: { attributes: {} },
      },
    }
  );
  return User;
};
