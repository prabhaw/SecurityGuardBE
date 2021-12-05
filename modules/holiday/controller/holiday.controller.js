const HolidayModel = require('./../../../db').holidays
const HttpError = require('http-errors')
const holiday_helper = require('./../helpers/holiday.helpers')
const ShiftModal = require('./../../../db').shift

const insertHoliday = async (req, res, next) => {
  try {
    const data = req.body
    const fetchByUser = await HolidayModel.findOne({
      where: { calendar_date: data.calendar_date },
    })
    const map_holiday = holiday_helper({}, data)
    if (fetchByUser) {
      return next(new HttpError.BadRequest('Holiday Already Exist.'))
      // const outData = await HolidayModel.update(map_holiday, {
      //   where: { calendar_date: data.calendar_date },
      // })
      // return res.status(200).json(outData)
    }

    const outData = await HolidayModel.create(map_holiday)
    return res.status(200).json(outData)
  } catch (error) {
    console.log(error)
    next(new HttpError.InternalServerError('Internal Server Error.'))
  }
}

const fetchHoliday = async (req, res, next) => {
  try {
    const fetchByUser = await HolidayModel.findAll()
    res.status(200).json(fetchByUser)
  } catch (error) {
    next(new HttpError.InternalServerError('Internal Server Error.'))
  }
}

const fetchHolidayByDate = async (req, res, next) => {
  try {
    const { date } = req.query
    const condition = { calendar_date: date }
    const fetchOut = await HolidayModel.findOne({ where: condition })
    res.status(200).json(fetchOut)
  } catch (error) {
    next(new HttpError.InternalServerError('Internal Server Error.'))
  }
}

const removeHoliday = async (req, res, next) => {
  try {
    const id = req.params.id
    const condition = { id: id }

    await ShiftModal.update(
      { is_holiday: false, holiday_id: null },
      {
        where: { holiday_id: req.params.id },
      },
    )
    await HolidayModel.destroy({ where: condition })
    res.status(200).json({ message: 'Holiday Updated Success.' })
  } catch (error) {
    next(new HttpError.InternalServerError('Internal Server Error.'))
  }
}

module.exports = {
  insertHoliday,
  fetchHoliday,
  fetchHolidayByDate,
  removeHoliday,
}
