const router = require('express').Router()
const supervisor = require('./../../../middleware/supervisor_user')
const token_auth = require('./../../../middleware/token_auth')
const guard_access = require('./../../../middleware/guard_user')
const ShiftCTRL = require('./../controllers/shift.controller')
const ADMIN_SUPER = require('./../../../middleware/fetch_users')

router
  .route('/')
  .get(token_auth, supervisor, ShiftCTRL.fetchShift)
  .post(token_auth, supervisor, ShiftCTRL.addShift)

router
  .route('/by-guard')
  .get(token_auth, guard_access, ShiftCTRL.fetchShiftByGuard)
router
  .route('/total-guard')
  .get(token_auth, guard_access, ShiftCTRL.totleWorkigHour)
router
  .route('/bar-guard')
  .get(token_auth, guard_access, ShiftCTRL.shiftBarGuard)
router
  .route('/shift-guard-dash')
  .get(token_auth, guard_access, ShiftCTRL.guardShiftDataMonth)
router.route('/all-shift').get(token_auth, supervisor, ShiftCTRL.fetchallShift)
router
  .route('/dash-shift-table')
  .get(token_auth, ADMIN_SUPER, ShiftCTRL.adminShiftData)
router
  .route('/dash-shift-year')
  .get(token_auth, ADMIN_SUPER, ShiftCTRL.adminShiftDataYear)
router
  .route('/dash-shift-month')
  .get(token_auth, ADMIN_SUPER, ShiftCTRL.adminShiftDataMonth)
router
  .route('/salary-year')
  .get(token_auth, ADMIN_SUPER, ShiftCTRL.adminSalaryYear)
router
  .route('/salary-month')
  .get(token_auth, ADMIN_SUPER, ShiftCTRL.adminSalaryMonth)
router
  .route('/salary-week')
  .get(token_auth, ADMIN_SUPER, ShiftCTRL.adminSalaryWeek)
router
  .route('/:id')
  .put(token_auth, supervisor, ShiftCTRL.updateShift)
  .delete(token_auth, supervisor, ShiftCTRL.removeShift)

module.exports = router
