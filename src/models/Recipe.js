const connection = require("../configs/db")
module.exports = {
  edit: uuid => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.uuid, a.title, a.imageUrl, a.category_id FROM meals a WHERE a.uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  updateTitleRecipe: (uuid, title) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE meals SET title = '${title}' WHERE uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  storeIngredients: (uuid, body, mealId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO ingredients (uuid, body, meal_id) VALUES ('${uuid}', '${body}', '${mealId}') ON DUPLICATE KEY UPDATE body = '${body}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  storeSteps: (uuid, body, mealId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO steps (uuid, body, meal_id) VALUES ('${uuid}', '${body}', '${mealId}') ON DUPLICATE KEY UPDATE body = '${body}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  updateStepsImages: (uuid, image) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE stepsimages a SET a.image = '${image}' WHERE a.uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  checkStepsImages: uuid => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM stepsimages a WHERE a.uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  checkStepsIdOnStepsImages: stepsId => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM stepsimages WHERE steps_id = '${stepsId}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  storeStepsImage: (uuid, image, mealId, stepsId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO stepsimages (uuid, image, meal_id, steps_id) VALUES ('${uuid}', '${image}', '${mealId}', '${stepsId}') ON DUPLICATE KEY UPDATE uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  deleteIngredients: uuid => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM ingredients WHERE uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  deleteSteps: uuid => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM steps WHERE uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  }
}
