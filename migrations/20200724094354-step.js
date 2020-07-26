'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
 	await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      }
      uuid: {
 		type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
      }, 
      body: {
      	type: Sequelize.STRING
      },
      recipe_id: {
      	type: Sequelize.STRING
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
   	await queryInterface.dropTable("steps")
  }
}
