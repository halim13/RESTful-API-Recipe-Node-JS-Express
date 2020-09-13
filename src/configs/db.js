const mysql = require("mysql")
const config = require("./configs")
const connection = mysql.createConnection(config.database.mysql)
connection.connect(error => {
  if (error) {
    console.log(`Error Database Connection: \n ${error}`)
  } else {
    console.log('\n\t *** New connection established with the database. ***')
  }
})
module.exports = connection
