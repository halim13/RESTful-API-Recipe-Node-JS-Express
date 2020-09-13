const connection = require("../configs/db")

module.exports = {
  
  getRecipes: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM recipes `
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
      const query = `SELECT DISTINCT 
      a.uuid, 
      a.body, 
      GROUP_CONCAT(b.id SEPARATOR ',') steps_images_id,
      GROUP_CONCAT(b.uuid SEPARATOR ',') steps_images_uuid, 
      GROUP_CONCAT(b.image SEPARATOR ',') steps_images_body
      FROM steps a 
      LEFT JOIN stepsimages b ON a.uuid = b.step_id 
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
      const query = `SELECT 
      a.uuid, 
      a.title, 
      a.duration, 
      a.isfavorite, 
      a.portion, 
      a.imageurl,
      a.user_id, 
      b.name,
      c.title as category_title,
      d.name as country_name
      FROM recipes a
      INNER JOIN users b ON a.user_id = b.uuid
      INNER JOIN search_suggestions e ON a.uuid  = e.recipe_id
      LEFT JOIN categories c ON a.category_id = c.uuid
      LEFT JOIN food_countries d ON a.country_id = d.uuid
      WHERE e.views > 0
      ORDER BY e.views DESC LIMIT 3`
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
      const query = `SELECT DISTINCT 
        a.body body_group, 
        a.uuid uuid_group, 
        GROUP_CONCAT(b.body SEPARATOR '*') body_child,
        GROUP_CONCAT(b.uuid SEPARATOR '*') uuid_child 
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

  favorite: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT 
      a.uuid, 
      a.title, 
      a.imageurl, 
      a.portion, 
      a.duration, 
      a.isfavorite, 
      a.user_id,
      b.name,
      c.title as category_title,
      d.name as country_name
      FROM recipes a
      INNER JOIN users b ON a.user_id = b.uuid
      LEFT JOIN categories c ON a.category_id = c.uuid
      LEFT JOIN food_countries d ON a.country_id = d.uuid
      WHERE a.isfavorite = 1`
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
      const query = `SELECT 
      a.uuid, 
      a.title, 
      a.duration,
      a.portion, 
      a.imageurl,
      a.user_id,
      b.name,
      c.title as category_title,
      d.name as country_name
      FROM recipes a
      INNER JOIN users b ON a.user_id = b.uuid
      LEFT JOIN categories c ON a.category_id = c.uuid
      LEFT JOIN food_countries d ON a.country_id = d.uuid
      WHERE a.category_id = '${categoryId}' 
      AND a.ispublished = '1' 
      AND LOWER(a.title) LIKE '%${search}%'
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

  detail: uuid => {
    return new Promise((resolve, reject) => {
      const query = `SELECT 
      a.uuid, 
      a.title, 
      a.imageurl, 
      a.portion,
      a.duration,
      a.isfavorite,
      a.user_id,
      b.name,
      c.title as category_title,
      d.name as country_name
      FROM recipes a
      INNER JOIN users b ON a.user_id = b.uuid
      LEFT JOIN categories c ON a.category_id = c.uuid
      LEFT JOIN food_countries d ON a.country_id = d.uuid
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

  showMe: (offset, limit, search, userId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT 
      a.uuid, 
      a.title, 
      a.duration, 
      a.portion, 
      a.imageurl, 
      a.user_id,
      b.name,
      c.title as category_title,
      d.name as country_name
      FROM recipes a
      INNER JOIN users b ON a.user_id = b.uuid
      LEFT JOIN categories c ON a.category_id = c.uuid
      LEFT JOIN food_countries d ON a.country_id = d.uuid
      WHERE a.user_id = '${userId}' 
      AND a.ispublished = '1' 
      AND LOWER(a.title) LIKE '%${search}%'
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

  showDraft: (offset, limit, search, userId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT 
      a.uuid, 
      a.title, 
      a.duration,
      a.portion,
      a.ispublished, 
      a.imageurl,
      a.user_id,
      b.name,
      c.title as category_title,
      d.name as country_name
      FROM recipes a
      INNER JOIN users b ON a.user_id = b.uuid
      LEFT JOIN categories c ON a.category_id = c.uuid
      LEFT JOIN food_countries d ON a.country_id = d.uuid
      WHERE a.ispublished = '0' AND a.user_id = '${userId}'
      AND LOWER(a.title) LIKE '%${search}%'
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
      const query = `SELECT 
      a.uuid, 
      a.duration, 
      a.title, 
      a.portion, 
      a.imageUrl, 
      a.category_id, 
      a.country_id,
      a.ispublished
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

  checkDemo: (userId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT COUNT(*) AS total 
      FROM demo a 
      INNER JOIN recipes c ON c.uuid = a.recipe_id
      WHERE a.user_id = '${userId}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },

  storeDemo: data => {
    connection.beginTransaction(function() {
      return new Promise((resolve, reject) => {
        const query =  `INSERT INTO demo SET ?`
        connection.query(query, data, (error, result) => {
          if (error) {
            return connection.rollback(function() {
              reject(new Error(error))
            })
          } else {
            connection.commit(function(err) {
              if (err) {
                return connection.rollback(function() {
                  reject(new Error(err))
                })
              }
              resolve(result)
            })
          }
        })
      })
    })
  },

  store: data => {
    connection.beginTransaction(function(err) {
      return new Promise((resolve, reject) => {
        const query = `INSERT INTO recipes SET ?`
        connection.query(query, data, (error, result) => {
          if(error) {
            return connection.rollback(function() {
              reject(new Error(error))
            })
          } else {
            connection.commit(function(err) {
              if (err) {
                return connection.rollback(function() {
                  reject(new Error(err))
                })
              }
              resolve(result)
            })
          }
        })
      })
    })
  },

  storeSearchSuggestions: (uuid, recipeId) => {
    connection.beginTransaction(function(err) {
      return new Promise((resolve, reject) => {
        const query = `INSERT INTO 
        search_suggestions (uuid, views, recipe_id) 
        VALUES('${uuid}', 1, '${recipeId}')`
        connection.query(query, (error, result) => {
          if (error) {
            return connection.rollback(function() {
              reject(new Error(error))
            })
          } else {
            connection.commit(function(err) {
              if (err) {
                return connection.rollback(function() {
                  reject(new Error(err))
                })
              }
              resolve(result)
            })
          }
        })
      })
    })
  },

  storeSteps: (uuid, body, recipeId) => {
    connection.beginTransaction(function(err) {
      return new Promise((resolve, reject) => {
        const query = `INSERT INTO steps 
        (uuid, body, recipe_id) 
        VALUES ('${uuid}', '${body}', '${recipeId}') 
        ON DUPLICATE KEY UPDATE body = '${body}'`
        connection.query(query, (error, result) => {
          if (error) {
            return connection.rollback(function() {
              reject(new Error(error))
            })
          } else {
            connection.commit(function(err) {
              if (err) {
                return connection.rollback(function() {
                  reject(new Error(err))
                })
              }
              resolve(result)
            })
          }
        })
      })
    })
  },

  storeStepsImage: (uuid, image, stepsId) => {
    connection.beginTransaction(function(err) {
      return new Promise((resolve, reject) => {
        const query = `INSERT INTO stepsimages 
        (uuid, image, step_id) VALUES ('${uuid}', '${image}', '${stepsId}') 
        ON DUPLICATE KEY UPDATE image = '${image}'`
        connection.query(query, (error, result) => {
          if (error) {
            return connection.rollback(function() {
              reject(new Error(error))
            })
          } else {
            connection.commit(function(err) {
              if (err) {
                return connection.rollback(function() {
                  reject(new Error(err))
                });
              }
              resolve(result)
            });
          }
        })
      })
    })
  },

  storeIngredientsGroup: (uuid, body) => {
    connection.beginTransaction(function(err) {
      return new Promise((resolve, reject) => {
        const query = `INSERT INTO ingredient_groups 
        (uuid, body) 
        VALUES ('${uuid}', '${body}') 
        ON DUPLICATE KEY UPDATE body = '${body}'`
        connection.query(query, (error, result) => {
          if (error) {
            return connection.rollback(function() {
              reject(new Error(error))
            })
          } else {
            connection.commit(function(err) {
              if (err) {
                return connection.rollback(function() {
                  reject(new Error(err))
                });
              }
              resolve(result)
            });
          }
        })
      })
    })
  },

  storeIngredients: (uuid, body, recipeId, ingredientGroupId) => {
    connection.beginTransaction(function(err) {
      return new Promise((resolve, reject) => {
        const query = `INSERT INTO ingredients 
        (uuid, body, recipe_id, ingredient_group_id) 
        VALUES ('${uuid}', '${body}', '${recipeId}', '${ingredientGroupId}') 
        ON DUPLICATE KEY UPDATE body = '${body}'`
        connection.query(query, (error, result) => {
          if (error) {
            return connection.rollback(function() {
              reject(new Error(error))
            })
          } else {
            connection.commit(function(err) {
              if (err) {
                return connection.rollback(function() {
                  reject(new Error(err))
                });
              }
              resolve(result)
            });
          }
        })
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

  updateFavorite: (uuid, isFavorite) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE recipes SET isfavorite = '${isFavorite}' WHERE uuid = '${uuid}'`
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
      const query = `SELECT views FROM search_suggestions WHERE recipe_id = '${recipeId}'`
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
      const query = `SELECT recipe_id FROM search_suggestions WHERE recipe_id = '${recipeId}'`
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
      const query = `SELECT * FROM stepsimages WHERE step_id = '${stepId}'`
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
