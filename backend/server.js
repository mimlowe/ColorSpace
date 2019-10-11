const express    = require("express")
const bodyParser = require("body-parser")
const logger     = require("morgan")
const mongoose   = require("mongoose")
const cors       = require("cors")
const router     = require('./Routes.js')

const PORT = process.env.PORT || 3000

const app = express()

app.use(bodyParser.json())
app.use(express.static("public"))
app.use(cors())
app.use("/", router)

mongoose.Promise = Promise
mongoose.connect("mongodb://localhost:27017/project",{})
  .then(() => {
    console.log("Ready to use Mongo")
  }, err => {
    console.log(err)
  }
)

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!")
})
