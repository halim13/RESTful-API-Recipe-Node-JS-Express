"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class SearchSuggestion extends Model {
    static associate(models) {
     
    }
  }
  searchsuggestion.init(
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
      modelName: "searchsuggestion"
    }
  )
  return searchsuggestion
}
