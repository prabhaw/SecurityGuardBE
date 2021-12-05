const router = require('express').Router()
const SupervisorToken = require('./../../../middleware/supervisor_user')
const TokenAuth = require('./../../../middleware/token_auth')
const GuardToken = require('./../../../middleware/guard_user')
const DayOffCTRL = require('./../controller/day_off.controller')

router
  .route('/')
  .get(TokenAuth, GuardToken, DayOffCTRL.fetchDayOffByUser)
  .post(TokenAuth, GuardToken, DayOffCTRL.insertDayOff)
router
  .route('/admin')
  .get(TokenAuth, SupervisorToken, DayOffCTRL.fetchDayOffByAdmin)
router.route('/:id').put(TokenAuth, SupervisorToken, DayOffCTRL.asseptDayOff)

module.exports = router
