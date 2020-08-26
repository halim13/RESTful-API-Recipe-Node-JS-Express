"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    static associate(models) {
     
    }
  }
  recipe.init(
    {
      id: DataTypes.INTEGER,
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      title: DataTypes.STRING,
      duration: DataTypes.INTEGER,
      isfavourite: DataTypes.TINYINT,
      imageurl: DataTypes.STRING,
      portion: DataTypes.STRING,
      category_id: DataTypes.STRING,
      user_id: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "recipe"
    }
  )
  return recipe
}
