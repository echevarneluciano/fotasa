"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Img);
      User.hasMany(models.Comentario);
      User.hasMany(models.Posteo);
      User.hasMany(models.Like);
      // define association here
    }
  }
  User.init(
    {
      nombre: DataTypes.STRING,
      intereses: DataTypes.STRING,
      nick: DataTypes.STRING,
      mail: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
