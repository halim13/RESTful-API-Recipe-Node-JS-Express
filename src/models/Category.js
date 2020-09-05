const connection = require('../configs/db');
module.exports = {

  getCategories: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM categories`
      connection.query(query, (error, result) => {
        if(error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },


  getFoodCountries: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM food_countries`
      connection.query(query, (error, result) => {
        if(error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },

  getCategoryByTitle: title => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM categories WHERE title = '${title}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },

  getFoodCountryByName: name => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM food_countries WHERE name = '${name}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },


  getTotalByCategoryId: categoryId => {
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

  getCategory: uuid => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM categories WHERE uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },

  getCountry: uuid => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM food_countries WHERE uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },

  store: (data) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO categories SET ?`
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
