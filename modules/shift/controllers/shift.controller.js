const ShiftModal = require('./../../../db').shift
const UserModel = require('./../../../db').users
const HolidayModal = require('./../../../db').holidays
const DayOffModal = require('./../../../db').day_off
const Sequelize = require('sequelize')
const HttpError = require('http-errors')
const map_shift = require('./../helper/shift.helper')
const dayjs = require('dayjs')
const Op = Sequelize.Op

const addShift = async (req, res, next) => {
  try {
    const data = req.body

    const isUserNewCondition = {
      [Op.and]: [
        { shift_number: data.shift_number },
        { userId: data.user_id },
        { shift_date: dayjs(data.shift_date).format('YYYY-MM-DD') },
        { on_leave: false },
      ],
    }
    const isShiftFullonShift = await ShiftModal.count({
      where: isUserNewCondition,
    })

    if (isShiftFullonShift !== 0) {
      return next(
        new HttpError.BadRequest('User is already Assign on This Shift.'),
      )
    }
    const guardPerShiftCondition = {
      [Op.and]: [{ shift_number: data.shift_number }, { on_leave: false }],
    }

    const checkNumShift = await ShiftModal.findAll({
      where: guardPerShiftCondition,
    })
    const isShiftFull = checkNumShift.filter(
      (item) =>
        dayjs(item.shift_date).format('YYYY-MM-DD') ===
        dayjs(data.shift_date).format('YYYY-MM-DD'),
    )

    if (isShiftFull.length === 3 || isShiftFull.length > 3) {
      return next(new HttpError.BadRequest('One Shift Can Only Have 3 Guard.'))
    }

    // const shiftCalcCondition = {
    //   [Op.and]: [
    //     {
    //       shift_number: data.shift_number,
    //     },
    //     {
    //       shift_date: {
    //         [Op.between]: [
    //           dayjs(data.shift_date).format('YYYY-MM-DD'),
    //           dayjs(data.shift_date).format('YYYY-MM-DD'),
    //         ],
    //       },
    //     },
    //   ],
    // }
    // const shift_count = await ShiftModal.count({ where: shiftCalcCondition })
    // if (shift_count === 3 || shift_count > 3) {
    //   return next(new HttpError.BadRequest('One Shift Can Only Have 3 Guard.'))
    // }
    const mapCondition = {
      [Op.and]: [{ userId: data.user_id }, { on_leave: false }],
    }
    const on8hr = await ShiftModal.findAll({
      where: mapCondition,
    })

    const findSadule = on8hr.filter((item) => {
      const start_time = {}
      if (parseInt(data.shift_number) === 1) {
        start_time.time = dayjs(data.shift_date).add(6, 'hour').format()
      }
      if (parseInt(data.shift_number) === 2) {
        start_time.time = dayjs(data.shift_date).add(14, 'hour').format()
      }
      if (parseInt(data.shift_number) === 3) {
        start_time.time = dayjs(data.shift_date).add(22, 'hour').format()
      }
      let day1 = {}
      const shift_date = dayjs(data.shift_date).diff(item.end_time, 'day')

      // if (shift_date === 8 && shift_date === -8) {
      //   return null
      // }
      if (shift_date > 0) {
        day1.time = dayjs(item.end_time).diff(start_time.time, 'hour')
      }
      if (shift_date < 0) {
        day1.time = dayjs(item.start_time).diff(start_time.time, 'hour')
      }
      if (shift_date === 0) {
        if (dayjs(data.shift_date).diff(item.end_time, 'hour') > 0) {
          day1.time = dayjs(item.start_time).diff(start_time.time, 'hour')
        } else {
          day1.time = dayjs(item.end_time).diff(start_time.time, 'hour')
        }
      }

      return (
        (day1.time < 8 || day1.time === 8) &&
        (day1.time > -8 || day1.time === -8)
      )
    })

    if (findSadule.length > 0) {
      return next(
        new HttpError.BadRequest('Shift Time Gap Should Be More Then 8 Hours'),
      )
    }

    if (data.shift_number === 3) {
      const count_condition = {
        [Op.and]: [
          {
            shift_date: {
              [Op.between]: [
                dayjs(data.shift_date).startOf('week').format('YYYY-MM-DD'),
                dayjs(data.shift_date).endOf('week').format('YYYY-MM-DD'),
              ],
            },
          },
          {
            shift_number: 3,
          },
          {
            user_id: data.user_id,
          },
          {
            on_leave: false,
          },
        ],
      }

      const shift_count_3 = await ShiftModal.findAll({ where: count_condition })

      const shift_count = shift_count_3.filter((item) => {
        if (
          item.shift_date >
            dayjs(data.shift_date).startOf('week').format('YYYY-MM-DD') ||
          item.shift_date ===
            item.shift_date >
              dayjs(data.shift_date).startOf('week').format('YYYY-MM-DD') ||
          item.shift_date <
            dayjs(data.shift_date).endOf('week').format('YYYY-MM-DD') ||
          item.shift_date ===
            dayjs(data.shift_date).endOf('week').format('YYYY-MM-DD')
        ) {
          return item
        }
        return null
      })

      if (shift_count.length > 3 || shift_count.length === 3) {
        return next(
          new HttpError.BadRequest("Can't Exceed 3 Service in Shift 3."),
        )
      }
    }
    var newMappedShift = map_shift({}, data)

    const condition = { calendar_date: data.shift_date }
    const holidays = await HolidayModal.findOne({ where: condition })

    if (holidays) {
      newMappedShift.holidayId = holidays.id
    }

    const out = await ShiftModal.create(newMappedShift)
    // console.table(outShift)

    const outShift = await ShiftModal.findOne({
      where: { id: out.id },
      include: [
        {
          model: UserModel,
          attributes: ['id', 'first_name', 'last_name'],
        },
        {
          model: HolidayModal,
          attributes: ['id', 'calendar_date', 'name_holiday'],
        },
      ],
    })
    res.status(200).json(
      outShift,
      // start: dayjs(outShift.start_time).format('HH:mm'),
      // end: dayjs(outShift.end_time).format('HH:mm'),
    )
  } catch (error) {
    return next(new HttpError.InternalServerError('Internal Server Errors'))
  }
}

const updateShift = async (req, res, next) => {
  try {
    const data = req.body
    // const id = req.params.id
    const isUserNewCondition = {
      [Op.and]: [
        { shift_number: data.shift_number },
        { userId: data.user_id },
        { shift_date: dayjs(data.shift_date).format('YYYY-MM-DD') },
        { on_leave: false },
      ],
    }
    const isShiftFullonShift = await ShiftModal.count({
      where: isUserNewCondition,
    })

    if (isShiftFullonShift !== 0) {
      return next(new HttpError.BadRequest('Shift Gap Should Be More.'))
    }
    const mapCondition = {
      [Op.and]: [
        {
          userId: data.user_id,
        },
        { on_leave: false },
      ],
    }
    const on8hr = await ShiftModal.findAll({
      where: mapCondition,
    })

    const findSadule = on8hr.filter((item) => {
      const start_time = {}
      if (parseInt(data.shift_number) === 1) {
        start_time.time = dayjs(data.shift_date).add(6, 'hour').format()
      }
      if (parseInt(data.shift_number) === 2) {
        start_time.time = dayjs(data.shift_date).add(14, 'hour').format()
      }
      if (parseInt(data.shift_number) === 3) {
        start_time.time = dayjs(data.shift_date).add(22, 'hour').format()
      }
      let day1 = {}
      const shift_date = dayjs(data.shift_date).diff(item.end_time, 'day')
      if (shift_date > 0) {
        day1.time = dayjs(item.end_time).diff(start_time.time, 'hour')
      }
      if (shift_date < 0) {
        day1.time = dayjs(item.start_time).diff(start_time.time, 'hour')
      }
      if (shift_date === 0) {
        if (dayjs(data.shift_date).diff(item.end_time, 'hour') > 0) {
          day1.time = dayjs(item.start_time).diff(start_time.time, 'hour')
        } else {
          day1.time = dayjs(item.end_time).diff(start_time.time, 'hour')
        }
      }

      if (
        (day1.time < 8 || day1.time === 8) &&
        (day1.time > -8 || day1.time === -8)
      ) {
        return item
      }

      return null
    })

    if (findSadule.length > 0) {
      return next(
        new HttpError.BadRequest('Shift Time Gap Should Be More Then 8 Hours'),
      )
    }

    // const shiftCalcCondition = {
    //   [Op.and]: [
    //     {
    //       shift_number: data.shift_number,
    //     },
    //     {
    //       shift_date: {
    //         [Op.between]: [
    //           dayjs(data.shift_date).format('YYYY-MM-DD'),
    //           dayjs(data.shift_date).format('YYYY-MM-DD'),
    //         ],
    //       },
    //     },
    //   ],
    // }
    // const shift_count = await ShiftModal.count({ where: shiftCalcCondition })
    // if (shift_count === 3 || shift_count > 3) {
    //   return next(new HttpError.BadRequest('One Shift Can Only Have 3 Guard.'))
    // }
    if (data.shift_number === 3) {
      const count_condition = {
        [Op.and]: [
          {
            shift_date: {
              [Op.between]: [
                dayjs(data.shift_date).startOf('week').format('YYYY-MM-DD'),
                dayjs(data.shift_date).endOf('week').format('YYYY-MM-DD'),
              ],
            },
          },
          {
            shift_number: 3,
          },
          {
            user_id: data.user_id,
          },
          { on_leave: false },
        ],
      }

      const shift_count_3 = await ShiftModal.findAll({ where: count_condition })

      const shift_count = shift_count_3.filter((item) => {
        if (
          item.shift_date >
            dayjs(data.shift_date).startOf('week').format('YYYY-MM-DD') ||
          item.shift_date ===
            item.shift_date >
              dayjs(data.shift_date).startOf('week').format('YYYY-MM-DD') ||
          item.shift_date <
            dayjs(data.shift_date).endOf('week').format('YYYY-MM-DD') ||
          item.shift_date ===
            dayjs(data.shift_date).endOf('week').format('YYYY-MM-DD')
        ) {
          return item
        }
        return null
      })

      if (shift_count.length > 3 || shift_count.length === 3) {
        return next(
          new HttpError.BadRequest("Can't Exceed 3 Service in Shift 3."),
        )
      }
    }

    const updatedMappedShift = map_shift({}, data)

    if (data.is_holiday) {
      const holiday = {
        name_holiday: data.name_holiday,
      }
      const holidays = await HolidayModal.update(holiday, {
        where: { calendar_date: data.shift_date },
      })

      updatedMappedShift.holidayId = holidays.id
    }

    await ShiftModal.update(updatedMappedShift, {
      where: { id: req.params.id },
    })

    const outShift = await ShiftModal.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: UserModel,
          attributes: ['id', 'first_name', 'last_name'],
        },
        {
          model: HolidayModal,
          attributes: ['id', 'calendar_date', 'name_holiday'],
        },
      ],
    })

    res.status(200).json(outShift)
  } catch (error) {
    return next(new HttpError.InternalServerError('Internal Server Error'))
  }
}

const fetchShift = async (req, res, next) => {
  try {
    const query = req.query

    const condition = {
      [Op.and]: [
        {
          shift_date: {
            [Op.between]: [
              dayjs(query.start_date).format(),
              dayjs(query.end_date).format(),
            ],
          },
        },
        {
          on_leave: false,
        },
      ],
    }

    const fetchShiftByAdmin = await ShiftModal.findAll({
      where: condition,
      include: [
        {
          model: UserModel,
          attributes: ['id', 'first_name', 'last_name'],
        },
        {
          model: HolidayModal,
          attributes: ['id', 'calendar_date', 'name_holiday'],
        },
      ],
    })

    res.status(200).json(fetchShiftByAdmin)
  } catch (error) {
    return next(new HttpError.InternalServerError('Internal Server Error'))
  }
}

const fetchShiftByGuard = async (req, res, next) => {
  try {
    const id = req.loggedInUser.id
    const sadule = await ShiftModal.findAll({
      where: {
        [Op.and]: [
          { userId: id },
          {
            on_leave: false,
          },
        ],
      },
      include: [
        {
          model: UserModel,
          attributes: ['id', 'first_name', 'last_name'],
        },
        {
          model: HolidayModal,
          attributes: ['id', 'calendar_date', 'name_holiday'],
        },
      ],
    })
    res.status(200).json(sadule)
  } catch (error) {
    return next(new HttpError.InternalServerError('Internal Server Error'))
  }
}

const removeShift = async (req, res, next) => {
  try {
    const id = req.params.id

    const shift = await ShiftModal.findByPk(id)
    if (!shift) {
      next(new HttpError.BadRequest('No Shift Found'))
    }
    const isdelet = await ShiftModal.destroy({ where: { id: id } })
    if (isdelet == 0) {
      next(new HttpError.BadRequest('Cannot remove Shift.'))
    }
    res.status(200).json({ message: 'Shift is Removed' })
  } catch (error) {
    return next(new HttpError.InternalServerError('Internal Server Error'))
  }
}

const totleWorkigHour = async (req, res, next) => {
  try {
    const id = req.loggedInUser.id
    const saduleAllMonth = await ShiftModal.count({
      where: {
        [Op.and]: [
          { userId: id },
          {
            on_leave: false,
          },
          {
            shift_date: {
              [Op.between]: [
                dayjs().startOf('month').format('YYYY-MM-DD'),
                dayjs().endOf('month').format('YYYY-MM-DD'),
              ],
            },
          },
        ],
      },
    })
    const saduleAllWeek = await ShiftModal.count({
      where: {
        [Op.and]: [
          { userId: id },

          {
            on_leave: false,
          },
          {
            shift_date: {
              [Op.between]: [
                dayjs().startOf('week').format('YYYY-MM-DD'),
                dayjs().endOf('week').format('YYYY-MM-DD'),
              ],
            },
          },
        ],
      },
    })
    const saduleMonth = saduleAllMonth * 8
    const saduleWeek = saduleAllWeek * 8
    res.status(200).json({ saduleMonth, saduleWeek })
  } catch (error) {
    return next(new HttpError.InternalServerError('Internal Server Error'))
  }
}

const shiftBarGuard = async (req, res, next) => {
  try {
    const id = req.loggedInUser.id
    const { startDate, endDate } = req.query
    const condition = {
      [Op.and]: [
        {
          shift_date: {
            [Op.between]: [
              dayjs(startDate).startOf('month').format('YYYY-MM-DD'),
              dayjs(endDate).endOf('month').format('YYYY-MM-DD'),
            ],
          },
        },
        { userId: id },

        {
          on_leave: false,
        },
      ],
    }
    const shifts = await ShiftModal.findAll({
      where: condition,
      order: [['shift_date', 'ASC']],
    })

    res.status(200).json(shifts)
  } catch (error) {
    console.log(error)
    return next(new HttpError.InternalServerError('Internal Server Error'))
  }
}

const fetchallShift = async (req, res, next) => {
  try {
    const { start_date, end_date, guard_id, leave } = req.query
    const on_leave = leave === 'true' ? true : leave === 'false' ? false : null
    let condition = {}
    if (on_leave === true || on_leave === false) {
      condition = {
        on_leave: on_leave,
      }
    }
    if (!start_date && !end_date && guard_id) {
      condition = {
        [Op.and]: [
          {
            userId: guard_id,
          },
        ],
      }
    }
    if (
      !start_date &&
      !end_date &&
      guard_id &&
      (on_leave === true || on_leave === false)
    ) {
      condition = {
        [Op.and]: [
          {
            userId: guard_id,
          },
          { on_leave: on_leave },
        ],
      }
    }
    if (start_date && end_date && !guard_id) {
      condition = {
        [Op.and]: [
          {
            shift_date: {
              [Op.between]: [
                dayjs(start_date).format('YYYY-MM-DD'),
                dayjs(end_date).format('YYYY-MM-DD'),
              ],
            },
          },
        ],
      }
    }
    if (
      start_date &&
      end_date &&
      !guard_id &&
      (on_leave === true || on_leave === false)
    ) {
      condition = {
        [Op.and]: [
          {
            shift_date: {
              [Op.between]: [
                dayjs(start_date).format('YYYY-MM-DD'),
                dayjs(end_date).format('YYYY-MM-DD'),
              ],
            },
          },
          {
            on_leave: on_leave,
          },
        ],
      }
    }

    if (start_date && end_date && guard_id) {
      condition = {
        [Op.and]: [
          {
            shift_date: {
              [Op.between]: [
                dayjs(start_date).format('YYYY-MM-DD'),
                dayjs(end_date).format('YYYY-MM-DD'),
              ],
            },
          },

          {
            userId: guard_id,
          },
        ],
      }
    }
    if (
      start_date &&
      end_date &&
      guard_id &&
      (on_leave === true || on_leave === false)
    ) {
      condition = {
        [Op.and]: [
          {
            shift_date: {
              [Op.between]: [
                dayjs(start_date).format('YYYY-MM-DD'),
                dayjs(end_date).format('YYYY-MM-DD'),
              ],
            },
          },

          {
            userId: guard_id,
          },
          {
            on_leave: Boolean(on_leave),
          },
        ],
      }
    }
    const shifts = await ShiftModal.findAll({
      where: condition,
      order: [['shift_date', 'DESC']],
      include: [
        {
          model: UserModel,
          attributes: ['id', 'first_name', 'last_name'],
        },
        {
          model: HolidayModal,
          attributes: ['id', 'calendar_date', 'name_holiday'],
        },
        {
          model: DayOffModal,
          attributes: ['id', 'category'],
        },
      ],
    })
    res.status(200).json(shifts)
  } catch (error) {
    return next(new HttpError.InternalServerError('Internal Server Error'))
  }
}

const adminShiftData = async (req, res, next) => {
  try {
    const { date } = req.query
    condition = {
      shift_date: {
        [Op.between]: [
          dayjs(date).startOf('week').format('YYYY-MM-DD'),
          dayjs(date).endOf('week').format('YYYY-MM-DD'),
        ],
      },
    }
    const shifts = await ShiftModal.findAll({
      where: condition,
      order: [['shift_date', 'DESC']],
      include: [
        {
          model: UserModel,
          attributes: ['id', 'first_name', 'last_name'],
        },
      ],
    })
    const guard = await UserModel.findAll({
      where: { role: 'GUARD' },
    })
    const guard_shift = guard.map((item) => {
      let total = 0
      let shift_one = 0
      let shift_two = 0
      let shift_three = 0
      let holiday = 0
      shifts.forEach((element) => {
        if (element.user_id === item.id) {
          total = total + 1
          if (element.is_holiday === true) {
            holiday = holiday + 1
          }
          if (element.user_id === item.id && element.shift_number === 1) {
            shift_one = shift_one + 1
          }
          if (element.user_id === item.id && element.shift_number === 2) {
            shift_two = shift_two + 1
          }
          if (element.user_id === item.id && element.shift_number === 3) {
            shift_three = shift_three + 1
          }
        }
      })
      return {
        ...item,
        holiday,
        total: total,
        shift_three,
        shift_two,
        shift_one,
      }
    })
    res.status(200).json(guard_shift)
  } catch (error) {
    return next(new HttpError.InternalServerError('Internal Server Error'))
  }
}

const adminShiftDataYear = async (req, res, next) => {
  try {
    const { date } = req.query
    condition = {
      shift_date: {
        [Op.between]: [
          dayjs(date).startOf('year').format('YYYY-MM-DD'),
          dayjs(date).endOf('year').format('YYYY-MM-DD'),
        ],
      },
    }
    const shifts = await ShiftModal.findAll({
      where: condition,
      order: [['shift_date', 'DESC']],
      include: [
        {
          model: UserModel,
          attributes: ['id', 'first_name', 'last_name'],
        },
      ],
    })
    const guard = await UserModel.findAll({
      where: { role: 'GUARD' },
    })
    const guard_shift = guard.map((item) => {
      let total = 0

      shifts.forEach((element) => {
        if (element.user_id === item.id) {
          total = total + 1
        }
      })
      return {
        id: item.id,
        gurd_name: item.first_name + '' + item.last_name,
        start_date: dayjs(date).startOf('year').format('YYYY'),
        total: total,
      }
    })
    res.status(200).json(guard_shift)
  } catch (error) {
    return next(new HttpError.InternalServerError('Internal Server Error'))
  }
}

const adminShiftDataMonth = async (req, res, next) => {
  try {
    const { date } = req.query
    condition = {
      shift_date: {
        [Op.between]: [
          dayjs(date).startOf('month').format('YYYY-MM-DD'),
          dayjs(date).endOf('month').format('YYYY-MM-DD'),
        ],
      },
    }
    const shifts = await ShiftModal.findAll({
      where: condition,
      order: [['shift_date', 'DESC']],
      include: [
        {
          model: UserModel,
          attributes: ['id', 'first_name', 'last_name'],
        },
      ],
    })
    const guard = await UserModel.findAll({
      where: { role: 'GUARD' },
    })
    const guard_shift = guard.map((item) => {
      let total = 0
      let shift_one = 0
      let shift_two = 0
      let shift_three = 0
      let holiday = 0
      shifts.forEach((element) => {
        if (element.user_id === item.id) {
          total = total + 1
          if (element.is_holiday === true) {
            holiday = holiday + 1
          }
          if (element.user_id === item.id && element.shift_number === 1) {
            shift_one = shift_one + 1
          }
          if (element.user_id === item.id && element.shift_number === 2) {
            shift_two = shift_two + 1
          }
          if (element.user_id === item.id && element.shift_number === 3) {
            shift_three = shift_three + 1
          }
        }
      })
      return {
        ...item,
        holiday: holiday,
        total: total,
        shift_three,
        shift_two,
        shift_one,
      }
    })
    res.status(200).json(guard_shift)
  } catch (error) {
    return next(new HttpError.InternalServerError('Internal Server Error'))
  }
}

const guardShiftDataMonth = async (req, res, next) => {
  try {
    const { date } = req.query
    const id = req.loggedInUser.id
    condition = {
      [Op.and]: [
        {
          userId: id,
        },
        {
          on_leave: false,
        },
        {
          shift_date: {
            [Op.between]: [
              dayjs(date).startOf('month').format('YYYY-MM-DD'),
              dayjs(date).endOf('month').format('YYYY-MM-DD'),
            ],
          },
        },
      ],
    }
    const shifts = await ShiftModal.findAll({
      where: condition,
      order: [['shift_date', 'DESC']],
    })

    const shift_content = shifts.map((element) => {
      let shift_one = 0
      let shift_two = 0
      let shift_three = 0
      let holiday = 0

      if (element.is_holiday === true) {
        holiday = holiday + 1
      }
      if (element.shift_number === 1) {
        shift_one = shift_one + 1
      }
      if (element.shift_number === 2) {
        shift_two = shift_two + 1
      }
      if (element.shift_number === 3) {
        shift_three = shift_three + 1
      }
      return {
        shift_two,
        shift_one,
        holiday,
        shift_three,
        shift_date: element.shift_date,
        id: element.id,
      }
    })
    res.status(200).json(shift_content)
  } catch (error) {
    return next(new HttpError.InternalServerError('Internal Server Error'))
  }
}

module.exports = {
  addShift,
  updateShift,
  fetchShift,
  removeShift,
  fetchShiftByGuard,
  totleWorkigHour,
  shiftBarGuard,
  fetchallShift,
  adminShiftData,
  adminShiftDataYear,
  adminShiftDataMonth,
  guardShiftDataMonth,
}
