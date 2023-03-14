const express = require('express')

const userController = require('../controllers/user-controller')
const passport = require('../config/passport')
const { apiErrorHandler } = require('../middleware/error-handle')

const router = express.Router()

router.post('/users/register', userController.register)
router.post('/users/login', passport.authenticate('local', { session: false }), userController.login)

router.use('/', apiErrorHandler)

module.exports = router