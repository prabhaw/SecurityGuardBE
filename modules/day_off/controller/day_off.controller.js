const DayOffModel = require('./../../../db').day_off
const ShiftModal = require('./../../../db').shift
const UserModel = require('./../../../db').users
const day_helper = require('./../helpers/day_off.helper')
const HttpError = require('http-errors')
const Sequelize = require('sequelize')
const dayjs = require('dayjs')
const Op = Sequelize.Op

const insertDayOff = async (req, res, next) => {
  try {
    const data = req.body
    const mapDayOff = day_helper({}, data)
    mapDayOff.user_id = req.loggedInUser.id
    const outData = await DayOffModel.create(mapDayOff)
    res.status(200).json(outData)
  } catch (error) {
    return next(new HttpError.InternalServerError('Internal Server Errors'))
  }
}

const asseptDayOff = async (req, res, next) => {
  try {
    const data = req.body
    const mapUpdateDayOff = day_helper({}, data)
    const condition = {
      [Op.and]: [
        {
          user_id: data.user_id,
        },
        {
          shift_date: {
            [Op.between]: [
              dayjs(data.start_date).format('YYYY-MM-DD'),
              dayjs(data.end_date).format('YYYY-MM-DD'),
            ],
          },
        },
      ],
    }

    await ShiftModal.update(
      { on_leave: true, dayoff_id: req.params.id },
      { where: condition },
    )

    await DayOffModel.update(
      { ...mapUpdateDayOff, accepted: true },
      {
        where: { id: req.params.id },
      },
    )

    const outdayOff = await DayOffModel.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: UserModel,
          attributes: ['id', 'first_name', 'last_name'],
        },
      ],
    })
    res.status(200).json(outdayOff)
  } catch (error) {
    console.log(error)
    return next(new HttpError.InternalServerError('Internal Server Errors'))
  }
}

const fetchDayOffByUser = async (req, res, next) => {
  try {
    const condition = {
      user_id: req.loggedInUser.id,
    }
    const fetchByUser = await DayOffModel.findAll({ where: condition })
    res.status(200).json(fetchByUser)
  } catch (error) {
    return next(new HttpError.InternalServerError('Internal Server Errors'))
  }
}

const fetchDayOffByAdmin = async (req, res, next) => {
  try {
    const fetchByAdmin = await DayOffModel.findAll({
      include: [
        {
          model: UserModel,
          attributes: ['id', 'first_name', 'last_name'],
        },
      ],
    })
    res.status(200).json(fetchByAdmin)
  } catch (error) {
    return next(new HttpError.InternalServerError('Internal Server Errors'))
  }
}

// const fetchDayoffCount = async (req, res, next) => {
//   try {
//     const id = req.loggedInUser.id
//     const dayoffMonth = await DayOffModel.count({
//       where: {
//         [Op.and]: [
//           { user_id: id },
//           ,
//           {
//             shift_date: {
//               [Op.between]: [
//                 dayjs().startOf('month').format('YYYY-MM-DD'),
//                 dayjs().endOf('month').format('YYYY-MM-DD'),
//               ],
//             },
//           },
//         ],
//       },
//     })
//     const dayoffCountWeek = await ShiftModal.count({
//       where: {
//         [Op.and]: [
//           { user_id: id },

//           {
//             shift_date: {
//               [Op.between]: [
//                 dayjs().startOf('week').format('YYYY-MM-DD'),
//                 dayjs().endOf('week').format('YYYY-MM-DD'),
//               ],
//             },
//           },
//         ],
//       },
//     })
//     res.status(200).json({ dayoffMonth, dayOffWeek: dayoffCountWeek })
//   } catch (error) {
//     return next(new HttpError.InternalServerError('Internal Server Errors'))
//   }
// }

module.exports = {
  insertDayOff,
  asseptDayOff,
  fetchDayOffByUser,
  fetchDayOffByAdmin,
}
