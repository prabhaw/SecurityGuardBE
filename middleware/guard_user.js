const HttpError = require('http-errors')

const userTypeGuard = async (req, res, next) => {
  try {
    if (req.loggedInUser.role === 'GUARD') {
      next()
    } else {
      next(new HttpError.BadRequest('You are not SUPERVISOR User.'))
    }
  } catch (error) {
    next(new HttpError.InternalServerError('Internal Server Error.'))
  }
}

module.exports = userTypeGuard
