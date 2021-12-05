const jwt = require('jsonwebtoken')
const HttpError = require('http-errors')
const config = process.env.JWT_SECRET
const UserModal = require('./../db').users

module.exports = async function (req, res, next) {
  var token
  if (req.headers['x-access-token']) {
    token = req.headers['x-access-token']
  }
  if (req.headers['authorization']) {
    token = req.headers['authorization']
  }
  if (req.headers['token']) {
    token = req.headers['token']
  }
  if (req.query.token) {
    token = req.query.token
  }
  if (token) {
    try {
      const newtoken = token.split(' ')[1]
      const decoded = jwt.verify(newtoken, config)
      if (decoded) {
        const user = await UserModal.findByPk(decoded.id)
        if (!user) {
          next(new HttpError.BadRequest('User is not Register.'))
        }
        req.loggedInUser = user
        next()
      }
    } catch (error) {
      console.log(error)
      next(new HttpError.InternalServerError('Internal Server Error. gg'))
    }
  } else {
    next(new HttpError.BadRequest('Token is not Provided.'))
  }
}
