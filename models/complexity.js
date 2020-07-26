"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Complexity extends Model {
    static associate(models) {
     
    }
  }
  complexity.init(
    {
      id: DataTypes.INTEGER,
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      type: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "complexity"
    }
  )
  return complexity
}
