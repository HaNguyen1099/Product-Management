const express = require("express")

const route = require("./routes/client/index.route")
// const mongoose = require("mongoose")
// mongoose.connect('mongodb://127.0.0.1:27017/products-management')

const app = express()
const port = 4000

app.set("views", "./views")
app.set("view engine", "pug")

route(app)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
}) 