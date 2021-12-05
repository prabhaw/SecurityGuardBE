const UserModal = require('./../../db').users
const HttpError = require('http-errors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const JWT_SECRET = process.env.JWT_SECRET

function createToken(data) {
  var token = jwt.sign({ id: data.id }, JWT_SECRET)
  return token
}

const logIn = async (req, res, next) => {
  try {
    const user = await UserModal.findOne({
      where: {
        email: req.body.email,
      },
    })
    if (user) {
      const passMatch = bcrypt.compareSync(req.body.password, user.password)
      if (!passMatch) {
        next(new HttpError.BadRequest('Invalid Credentials'))
      }
      const data = { user, token: createToken(user) }
      res.status(200).json(data)
    } else {
      next(new HttpError.BadRequest('Invalid Credentials'))
    }
  } catch (error) {
    console.log(error)
    next(new HttpError.InternalServerError('Internal Server Errors.'))
  }
}

module.exports = { logIn }
