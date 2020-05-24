const connection = require('../configs/db');
module.exports = {
  storeIngredients: (data) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO ingredients SET ?`;
      connection.query(query, data, (error, result) => {
        if(error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      })
    });
  },
  storeSteps: (data) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO steps SET ?`;
      connection.query(query, data, (error, result) => {
        if(error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      })
    });
  }
}
