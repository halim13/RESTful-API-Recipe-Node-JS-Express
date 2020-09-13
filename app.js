const express = require("express")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const busboy = require("connect-busboy")
const logger = require("morgan")
const app = express()
const config = require("./src/configs/configs")
const port = config.port
const routerNav = require("./src/index")
app.use(busboy())
app.use(fileUpload())
app.use(logger("dev"))
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use("/", routerNav)
app.listen(port, () => {
  console.log(`\n\t *** Server listening on PORT ${port}  ***`)
})
app.get("*", (request, response) => {
  response.sendStatus(404)
})
module.exports = app
