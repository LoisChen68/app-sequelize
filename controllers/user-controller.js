const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const userController = {
  // POST users/register
  register: async (req, res, next) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        errorCode: '400F',
        message: 'Field cannot be empty'
      })
    }
    try {
      const user =
        await User.findOne({
          attributes: ['email'],
          where: { email }
        })
      if (!user) {
        const hash = await bcrypt.hash(password, 10)
        User.create({
          name,
          email,
          password: hash
        })
        res.status(200).json({
          status: 'success',
          message: 'user create success'
        })
      }
      if (user.email === email) return res.status(400).json({
        status: 'error',
        errorCode: '400E',
        message: 'email already exists'
      })
    }
    catch (err) {
      next(err)
    }
  },
  // POST users/login
  login: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '7d' })
      res.json({ token })
    }
    catch (err) {
      next(err)
    }
  }
}

module.exports = userController