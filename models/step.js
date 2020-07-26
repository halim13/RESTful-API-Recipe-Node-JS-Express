"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Step extends Model {
    static associate(models) {
     
    }
  }
  step.init(
    {
      id: DataTypes.INTEGER,
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      body: DataTypes.TEXT,
      recipe_id: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "step"
    }
  )
  return step
}
