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
      affordability: DataTypes.INTEGER,
      complexity: DataTypes.INTEGER,
      imageurl: DataTypes.STRING,
      isglutenfree: DataTypes.TINYINT,
      isveganfree: DataTypes.TINYINT,
      islactosefree: DataTypes.TINYINT,
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
