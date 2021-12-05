const HttpError = require('http-errors')

const userTypeSupervisor = async (req, res, next) => {
  try {
    if (req.loggedInUser.role === 'SUPERVISOR') {
      next()
    } else {
      next(new HttpError.BadRequest('You are not SUPERVISOR User.'))
    }
  } catch (error) {
    next(new HttpError.InternalServerError('Internal Server Error.'))
  }
}

module.exports = userTypeSupervisor
