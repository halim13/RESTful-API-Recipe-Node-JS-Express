const connection = require('../configs/db');
module.exports = {
  all: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.* FROM categories a`;
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
      const query = `INSERT INTO categories SET ?`;
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
