"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Posteo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Posteo.hasMany(models.Comentario);
      Posteo.hasMany(models.Like);
      Posteo.belongsTo(models.User);
      Posteo.belongsTo(models.Img);
      // define association here
    }
  }
  Posteo.init(
    {
      titulo: DataTypes.STRING,
      tipo: DataTypes.STRING,
      categoria: DataTypes.STRING,
      etiquetas: DataTypes.STRING,
      userid: DataTypes.INTEGER,
      imgid: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Posteo",
    }
  );
  return Posteo;
};
