const SurchargeModal = require('./../../db').surcharge
const HttpError = require('http-errors')
const dayjs = require('dayjs')

const AddSurcharge = async (req, res, next) => {
  try {
    const data = req.body
    const yearnumber = await SurchargeModal.findOne({
      where: { year: dayjs(data.date).format('YYYY-MM-DD') },
    })
    if (yearnumber) {
      return next(
        new HttpError.BadRequest(
          'Surcharge Hour is Already Added for This Year.',
        ),
      )
    }
    const mapped_data = {
      year: dayjs(data.date).format('YYYY-MM-DD'),
      surcharge_hour: data.surcharge_hour,
    }
    const newDataOut = await SurchargeModal.create(mapped_data)
    res.status(200).json(newDataOut)
  } catch (error) {
    console.log(error)
    return next(new HttpError.InternalServerError('Internal Server Error'))
  }
}

const UpdateSurcharge = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = req.body
    const newData = { surcharge_hour: data.surcharge_hour }
    const surcharge = await SurchargeModal.findByPk(id)
    if (!surcharge) {
      next(new HttpError.BadRequest('Data NOt Found.'))
    }
    await SurchargeModal.update(newData, { where: { id: id } })
    const outData = await SurchargeModal.findByPk(id)
    res.status(200).json(outData)
  } catch (error) {
    return next(new HttpError.InternalServerError('Internal Server Error'))
  }
}

const FetchAllSucharge = async (req, res, next) => {
  try {
    const { date } = req.query
    const condition = {}
    if (date) {
      condition.year = dayjs(date).format('YYYY-MM-DD')
    }
    const allSurcharge = await SurchargeModal.findAll({ where: condition })
    res.status(200).json(allSurcharge)
  } catch (error) {
    console.log(error)
    return next(new HttpError.InternalServerError('Internal Server Error'))
  }
}

module.exports = {
  AddSurcharge,
  UpdateSurcharge,
  FetchAllSucharge,
}
