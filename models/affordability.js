"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Affordability extends Model {
    static associate(models) {
     
    }
  }
  affordability.init(
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
      modelName: "affordability"
    }
  )
  return affordability
}
