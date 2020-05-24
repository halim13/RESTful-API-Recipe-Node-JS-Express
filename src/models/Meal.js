const connection = require('../configs/db');
module.exports = {
  getCategoryId:(id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.id FROM categories a WHERE id = '${id}'`;
      connection.query(query, (error, result) => {
        if(error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  total:(categoryId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT COUNT(*) AS total FROM meals WHERE category_id = '${categoryId}'`;
      connection.query(query, (error, result) => {
        if(error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  all: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.* FROM meals a`;
      connection.query(query, (error, result) => {
        if(error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      })
    });
  },
  detail: (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.id, a.title, a.imageUrl, a.isfavourite FROM meals a WHERE id = '${id}'`;
      connection.query(query, (error, result) => {
        if(error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      })
    });
  },
  favourite: () => {
  	return new Promise((resolve, reject) => {
      const query = `SELECT a.id, a.title, a.imageUrl, a.duration, a.isfavourite, b.type as affordability , c.type as complexity
			FROM meals a
			LEFT JOIN affordabilities b ON b.id = a.affordability
			LEFT JOIN complexities c ON c.id = a.complexity
			WHERE isfavourite = 1`;
  	  connection.query(query, (error, result) => {
  		if(error) {
  		 reject(new Error());
  		} else {
  		 resolve(result);
  		}
  	  });
  	});
  },
  steps: (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.body FROM steps a WHERE meal_id = '${id}'`;
      connection.query(query, (error, result) => {
        if(error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  ingredients: (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.body FROM ingredients a WHERE meal_id = '${id}'`;
      connection.query(query, (error, result) => {
        if(error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  show: (offset, limit, sort, search, id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT DISTINCT a.id, a.title, a.duration, a.imageurl, b.type as affordabilities, c.type as complexities, d.title as category_title
  		FROM meals a
  		LEFT JOIN affordabilities b ON a.affordability = b.id
  		LEFT JOIN complexities c ON a.complexity = c.id
  		LEFT JOIN categories d ON a.category_id = d.id
		  WHERE a.category_id = '${id}' AND LOWER(a.title) LIKE '%${search}%'
      LIMIT ${offset}, ${limit}`;
      connection.query(query, (error, result) => {
        if(error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  updateFavourite: (id, isFavourite) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE meals SET isfavourite = '${isFavourite}' WHERE id = '${id}'`;
      connection.query(query, (error, result) => {
        if(error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  getCountViews: (mealId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.views FROM search_suggestions a WHERE meal_id = '${mealId}'`;
      connection.query(query, (error, result) => {
        if(error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  checkReservedSearchSuggestions: (mealId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.meal_id FROM search_suggestions a WHERE meal_id = '${mealId}'`;
      connection.query(query, (error, result) => {
        if(error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  storeSearchSuggestions: (idSearchSuggestions, mealId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO search_suggestions (id, views, meal_id) VALUES('${idSearchSuggestions}', 1, '${mealId}')`;
      connection.query(query, (error, result) => {
        if(error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  updateSearchSuggestions: (views, mealId) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE search_suggestions SET views = ${views} + 1 WHERE meal_id = '${mealId}'`;
      connection.query(query, (error, result) => {
        if(error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  searchSuggestions: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.id, a.title, a.imageUrl
      FROM meals a
      INNER JOIN search_suggestions b ON a.id  = b.meal_id
      WHERE b.views > 0
      ORDER BY views DESC LIMIT 3`;
      connection.query(query, (error, result) => {
        if(error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  store: (data) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO meals SET ?`;
      connection.query(query, data, (error, result) => {
        if(error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  }
}
