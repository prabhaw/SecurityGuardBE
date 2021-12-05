'use strict'
const express = require('express')
require('dotenv').config()
const cors = require('cors')
const apiRoute = require('./routes/api.routes')
const dayjs = require('dayjs')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 5000
require('./db')
// console.log(dayjs('2021-10-11/05:06').add(1, 'day').format())
// var corsOptions={
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 204,
// }

app.use(cors())
// Static files

// ---------------Json -------------
app.use(
  express.urlencoded({
    extended: true,
  }),
)
app.use(express.json())
app.use(express.static(path.join(__dirname, "client", "build")))

app.use('/api', apiRoute)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.use(function (error, req, res, next) {
  res.status(error.status || 400).json({
    status: error.status || 400,
    message: error.message || error,
  })
})




app.listen(PORT, function () {
  console.log(`Server has started on ${PORT}`)
})
