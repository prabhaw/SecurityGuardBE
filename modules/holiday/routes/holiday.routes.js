const router = require('express').Router()
const SuperUser = require('./../../../middleware/supervisor_user')
const TokenAuth = require('./../../../middleware/token_auth')
const HolidayCTRL = require('./../controller/holiday.controller')

router
  .route('/')
  .get(TokenAuth, SuperUser, HolidayCTRL.fetchHoliday)
  .post(TokenAuth, SuperUser, HolidayCTRL.insertHoliday)
router
  .route('/holiday')
  .get(TokenAuth, SuperUser, HolidayCTRL.fetchHolidayByDate)

router.route('/:id').delete(TokenAuth, SuperUser, HolidayCTRL.removeHoliday)

module.exports = router
