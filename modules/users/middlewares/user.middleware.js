const UserModal = require('./../../../db').users
const httpErrors = require('http-errors')

const addUserEmailValid = async (req, res, next) => {
  if (req.body.email) {
    const emailContain = await UserModal.findOne({
      where: {
        email: req.body.email,
      },
    })
    if (emailContain) {
      next(new httpErrors.BadRequest('Email is already taken.'))
    } else next()
  } else {
    next(new httpErrors.BadRequest('Email is not Inputed.'))
  }
}

module.exports = addUserEmailValid
