const HttpError = require('http-errors')

const userTypeAdmin = async (req, res, next) => {
  try {
    if (
      req.loggedInUser.role === 'ADMIN' ||
      req.loggedInUser.role === 'SUPERVISOR'
    ) {
      next()
    } else {
      next(new HttpError.BadRequest('You are not Admin User.'))
    }
  } catch (error) {
    next(new HttpError.InternalServerError('Internal Server Error.'))
  }
}

module.exports = userTypeAdmin
