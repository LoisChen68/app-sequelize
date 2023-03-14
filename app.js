const express = require('express')
const passport = require('passport')
const cors = require('cors')
const routes = require('./routes/index')

const app = express()
const PORT = 3000
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())

app.use(cors())
app.use('/api/v1', routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})