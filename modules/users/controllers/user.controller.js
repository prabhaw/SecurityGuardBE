const UserModel = require('./../../../db').users
const map_user_data = require('./../helpers/user.helper')
const bcrypt = require('bcryptjs')
const HttpError = require('http-errors')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const insertAdmin = async (req, res, next) => {
  try {
    var data = req.body
    var newUser = {}
    var newMappedUser = map_user_data(newUser, data)

    var salt = bcrypt.genSaltSync(10)
    var hashPassword = bcrypt.hashSync(data.password, salt)
    newMappedUser.password = hashPassword
    newMappedUser.role = 'ADMIN'
    const newUserOut = await UserModel.create(newMappedUser)
    res.status(200).json(newUserOut)
  } catch (error) {
    next(new HttpError.InternalServerError('Error While Creating User.'))
  }
}

const insertUser = async (req, res, next) => {
  try {
    var data = req.body
    if (data.role === 'GUARD') {
      const total = await UserModel.count({ where: { role: 'GUARD' } })
      if (total > 13 || total === 13) {
        next(new HttpError.BadRequest("Guard can't be more then 13."))
      }
    }
    var newUser = {}
    var newMappedUser = map_user_data(newUser, data)
    var salt = bcrypt.genSaltSync(10)
    var hashPassword = bcrypt.hashSync(data.password, salt)
    newMappedUser.password = hashPassword

    const newUserOut = await UserModel.create(newMappedUser)
    res.status(200).json(newUserOut)
  } catch (error) {
    next(new HttpError.InternalServerError('Error While Creating User.'))
  }
}

// const insertGuard = async (req, res, next) => {
//   try {
//     var data = req.body
//     var newUser = {}
//     var newMappedUser = map_user_data(newUser, data)
//     var salt = bcrypt.genSaltSync(10)
//     var hashPassword = bcrypt.hashSync(data.password, salt)
//     newMappedUser.password = hashPassword
//     newMappedUser.role = 'GUARD'
//     const newUserOut = await UserModel.create(newMappedUser)
//     res.status(200).json(newUserOut)
//   } catch (error) {
//     next(new HttpError.InternalServerError('Error While Creating User.'))
//   }
// }

const fetchUserById = async (req, res, next) => {
  try {
    const condition = { id: req.loggedInUser.id }
    const user = await UserModel.findAll({
      where: condition,
      attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'phone'],
    })
    res.status(200).json(user[0])
  } catch (error) {
    next(new HttpError.InternalServerError('Internal Server Error.'))
  }
}
const fetchAllUser = async (req, res, next) => {
  try {
    const condition = { [Op.or]: [{ role: 'SUPERVISOR' }, { role: 'GUARD' }] }

    const users = await UserModel.findAll({
      where: condition,
      attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'phone'],
    })
    res.status(200).json(users)
  } catch (error) {
    next(new HttpError.InternalServerError('Internal Server Error.'))
  }
}

const fetchAllGuard = async (req, res, next) => {
  try {
    const condition = { role: 'GUARD' }

    const users = await UserModel.findAll({
      where: condition,
      attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'phone'],
    })
    res.status(200).json(users)
  } catch (error) {
    next(new HttpError.InternalServerError('Internal Server Error.'))
  }
}

const updatePassword = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = req.body
    const newData = {}
    const user = await UserModel.findByPk(id)
    if (!user) {
      next(new HttpError.BadRequest('User not Found.'))
    }
    var salt = bcrypt.genSaltSync(10)
    var hashPassword = bcrypt.hashSync(data.password, salt)
    newData.password = hashPassword
    UserModel.update(newData, { where: { id: id } })
    res.status(200).json({ message: 'Password Changed Success.' })
  } catch (error) {
    next(new HttpError.InternalServerError('Internal Server Error.'))
  }
}

// const removeUser = async (req, res, next) => {
//   try {
//     const userId = req.params.id
//     const user = await UserModel.findByPk(userId)
//     if (!user) {
//       next(new HttpError.BadRequest('User not Found.'))
//     }
//     await UserModel.destroy({ where: { id: userId } })
//     res.status(200).json({ message: 'User Deleted Success.' })
//   } catch (error) {
//     next(new HttpError.InternalServerError('Internal Server Error.'))
//   }
// }

module.exports = {
  insertAdmin,
  insertUser,
  fetchAllGuard,
  fetchUserById,
  fetchAllUser,
  updatePassword,
}
