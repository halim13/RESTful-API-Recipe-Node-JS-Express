const connection = require("../configs/db")
module.exports = {
  getCategory: uuid => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.id FROM categories a WHERE a.uuid = '${uuid}'`
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
      const query = `SELECT COUNT(*) AS total FROM meals WHERE category_id = '${categoryId}'`
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
      const query = `SELECT a.* FROM meals a`
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
      const query = `SELECT a.uuid, a.title, a.imageUrl, a.isfavourite FROM meals a WHERE uuid = '${uuid}'`
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
      const query = `SELECT a.id, a.title, a.imageUrl, a.duration, a.isfavourite, b.type as affordability , c.type as complexity
			FROM meals a
			LEFT JOIN affordabilities b ON b.id = a.affordability
			LEFT JOIN complexities c ON c.id = a.complexity
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
  steps: mealId => {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT DISTINCT a.uuid, a.body, 
      GROUP_CONCAT(b.uuid SEPARATOR ',') steps_images_id, 
      GROUP_CONCAT(b.image SEPARATOR ',') steps_images_body
      FROM steps a LEFT JOIN stepsimages b ON a.uuid = b.steps_id 
      WHERE a.meal_id = '${mealId}'
      GROUP BY a.id
      `
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  ingredients: mealId => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.uuid, a.body FROM ingredients a WHERE meal_id = '${mealId}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  show: (offset, limit, search, categoryId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT DISTINCT a.uuid, a.title, a.duration, a.imageurl, b.type as affordabilities, c.type as complexities, d.title as category_title
  		FROM meals a
  		LEFT JOIN affordabilities b ON a.affordability = b.uuid
  		LEFT JOIN complexities c ON a.complexity = c.uuid
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
  updateFavourite: (uuid, isFavourite) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE meals SET isfavourite = '${isFavourite}' WHERE uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  getCountViews: mealId => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.views FROM search_suggestions a WHERE a.meal_id = '${mealId}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  checkReservedSearchSuggestions: mealId => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.meal_id FROM search_suggestions a WHERE a.meal_id = '${mealId}'`
      connection.query(query, (error, result) => {
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
  updateSearchSuggestions: (views, mealId) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE search_suggestions SET views = ${views} + 1 WHERE meal_id = '${mealId}'`
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
      FROM meals a
      INNER JOIN search_suggestions b ON a.uuid  = b.meal_id
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
  store: data => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO meals SET ?`
      connection.query(query, data, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  }
}
