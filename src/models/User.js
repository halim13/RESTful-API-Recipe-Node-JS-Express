const connection = require("../configs/db")
module.exports = {

  auth: uuid => {
    return new Promise((resolve, reject) => {
      const query = `SELECT 
      id, 
      uuid, 
      name, 
      email, 
      avatar, 
      bio 
      FROM users  
      WHERE uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },

  checkName: name => {
    return new Promise((resolve, reject) => {
      const query = `SELECT name FROM users WHERE LOWER(name) = '${name}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },

  checkEmail: email => {
    return new Promise((resolve, reject) => {
      const query = `SELECT email FROM users WHERE email = '${email}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },

  checkAvatarExists: userId => {
    return new Promise((resolve, reject) => {
      const query = `SELECT avatar FROM users WHERE id = '${userId}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },

  getUser: email => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE email = '${email}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },

  getUserByUuid: uuid => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },

  getTotalByUserId: userId => {
    return new Promise((resolve, reject) => {
      const query = `SELECT COUNT(*) AS total FROM recipes WHERE user_id = '${userId}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },

  getCurrentProfile: uuid => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },

  viewProfile: uuid => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.* FROM users a WHERE a.uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },

  login: email => {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, uuid, password FROM users a WHERE email = ?`
      connection.query(query, email, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },

  register: data => {
    connection.beginTransaction(function(err) {
      return new Promise((resolve, reject) => {
        const query = `INSERT INTO users SET ?`
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
                });
              }
              resolve(result)
            });
          }
        })
      })
    })
  },

  updateProfile: (data, uuid) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE users SET ? WHERE uuid = ?`
      connection.query(query, [data, uuid], (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  }

}
