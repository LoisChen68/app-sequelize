const express = require('express')
const userController = require('../controllers/user-controller')

const router = express.Router()

router.post('/users/register', userController.register)

module.exports = router