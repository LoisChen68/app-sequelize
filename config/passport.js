const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, cb) => {
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) {
        const error = new Error('Incorrect email or password')
        error.statusCode = 401
        cb(error)
      }
      else {
        const passportCompare = await bcrypt.compare(password, user.password)
        if (!passportCompare) {
          const error = new Error('Incorrect email or password')
          error.statusCode = 401
          cb(error)
        }
        return cb(null, user)
      }
    }
    catch (err) {
      cb(err)
    }
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}

passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  try {
    const user = await User.findByPk(jwtPayload.id)
    return cb(null, user)
  }
  catch (err) {
    cb(err)
  }
}))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id)
    return cb(null, user)
  }
  catch (err) {
    cb(err)
  }
})

module.exports = passport
