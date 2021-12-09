const router = require('express').Router()
const AuthRoute = require('./../modules/auth/auth.routes')
const UserRoute = require('./../modules/users/routes/user.routes')
const ShiftRoute = require('./../modules/shift/routes/shift.route')
const DayoffRoute = require('./../modules/day_off/routes/dayoff.routes')
const HolidayRoute = require('./../modules/holiday/routes//holiday.routes')
const SurchargeRoute = require('./../modules/surcharge/surcharge.routes')

router.use('/auth', AuthRoute)
router.use('/user', UserRoute)
router.use('/shift', ShiftRoute)
router.use('/day-off', DayoffRoute)
router.use('/holiday', HolidayRoute)
router.use('/surcharge', SurchargeRoute)

module.exports = router
