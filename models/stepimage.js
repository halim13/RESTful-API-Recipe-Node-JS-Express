"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class StepImage extends Model {
    static associate(models) {
     
    }
  }
  stepimage.init(
    {
      id: DataTypes.INTEGER,
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      image: DataTypes.STRING,
      recipe_id: DataTypes.STRING,
      step_id: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "stepimage"
    }
  )
  return stepimage
}
