const connection = require("../configs/db")
module.exports = {
  allCategory: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM categories`
      connection.query(query, (error, result) => {
        if(error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  getCategory: uuid => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM categories a WHERE a.uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  getCategoryByTitle: title => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM categories a WHERE a.title = '${title}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  total: categoryId => {
    return new Promise((resolve, reject) => {
      const query = `SELECT COUNT(*) AS total FROM recipes WHERE category_id = '${categoryId}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  all: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.* FROM recipes a`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  steps: recipeId => {
    return new Promise((resolve, reject) => {
      const query = `SELECT DISTINCT a.uuid, a.body, 
      GROUP_CONCAT(b.id SEPARATOR ',') steps_images_id,
      GROUP_CONCAT(b.uuid SEPARATOR ',') steps_images_uuid, 
      GROUP_CONCAT(b.image SEPARATOR ',') steps_images_body
      FROM steps a LEFT JOIN stepsimages b ON a.uuid = b.step_id 
      WHERE a.recipe_id = '${recipeId}'
      GROUP BY a.id ORDER BY b.id ASC`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  searchSuggestions: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.uuid, a.title, a.imageUrl
      FROM recipes a
      INNER JOIN search_suggestions b ON a.uuid  = b.recipe_id
      WHERE b.views > 0
      ORDER BY views DESC LIMIT 3`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  ingredientsGroup: recipeId => {
    return new Promise((resolve, reject) => {
      const query = `SELECT DISTINCT a.body body_group, a.uuid uuid_group, 
        GROUP_CONCAT(b.body SEPARATOR ',') body_child,
        GROUP_CONCAT(b.uuid SEPARATOR ',') uuid_child 
        FROM ingredient_groups a
        INNER JOIN ingredients b ON a.uuid = b.ingredient_group_id 
        WHERE b.recipe_id = '${recipeId}'
        GROUP by a.id ORDER BY b.id ASC`
        connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  detail: uuid => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.uuid, a.title, a.imageUrl, a.portion, a.isfavourite FROM recipes a WHERE uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  favourite: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.id, a.uuid, a.title, a.imageUrl, a.duration, a.isfavourite
      FROM recipes a
      WHERE isfavourite = 1`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error())
        } else {
          resolve(result)
        }
      })
    })
  },
  show: (offset, limit, search, categoryId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT DISTINCT a.uuid, a.title, a.duration, a.portion, a.imageurl, c.name, d.title as category_title
      FROM recipes a
      INNER JOIN users c ON a.user_id = c.uuid
      LEFT JOIN categories d ON a.category_id = d.uuid
      WHERE a.category_id = '${categoryId}' AND LOWER(a.title) LIKE '%${search}%'
      LIMIT ${offset}, ${limit}`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  edit: uuid => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.uuid, a.duration, a.title, a.portion, a.imageUrl, a.category_id
      FROM recipes a
      WHERE a.uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  store: data => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO recipes SET ?`
      connection.query(query, data, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  storeSearchSuggestions: (uuid, mealId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO search_suggestions (uuid, views, meal_id) VALUES('${uuid}', 1, '${mealId}')`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  storeSteps: (uuid, body, recipeId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO steps (uuid, body, recipe_id) VALUES ('${uuid}', '${body}', '${recipeId}') ON DUPLICATE KEY UPDATE body = '${body}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  storeStepsImage: (uuid, image, stepsId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO stepsimages (uuid, image, step_id) VALUES ('${uuid}', '${image}', '${stepsId}') ON DUPLICATE KEY UPDATE image = '${image}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  storeIngredients: (uuid, body, recipeId, ingredientGroupId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO ingredients (uuid, body, recipe_id, ingredient_group_id) VALUES ('${uuid}', '${body}', '${recipeId}', '${ingredientGroupId}') ON DUPLICATE KEY UPDATE body = '${body}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  storeIngredientsGroup: (uuid, body) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO ingredient_groups (uuid, body) VALUES ('${uuid}', '${body}') ON DUPLICATE KEY UPDATE body = '${body}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  update: (data, recipeId) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE recipes SET ? WHERE uuid = '${recipeId}'`
      connection.query(query, data, (error, result) => {
        if(error) {
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
  updateFavourite: (uuid, isFavourite) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE recipes SET isfavourite = '${isFavourite}' WHERE uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  updateSearchSuggestions: (views, recipeId) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE search_suggestions SET views = ${views} + 1 WHERE recipe_id = '${recipeId}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  getCountViews: recipeId => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.views FROM search_suggestions a WHERE a.recipe_id = '${recipeId}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  checkReservedSearchSuggestions: recipeId => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.meal_id FROM search_suggestions a WHERE a.recipe_id = '${recipeId}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  checkStepsImages: stepId => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM stepsimages a WHERE a.step_id = '${stepId}'`
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
  deleteIngredientsGroup: uuid => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM ingredient_groups WHERE uuid = '${uuid}'`
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
