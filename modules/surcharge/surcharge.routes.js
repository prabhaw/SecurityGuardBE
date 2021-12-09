const router = require('express').Router()
const SurCTRL = require('./surcharge.controller')
const tokenAuth = require('./../../middleware/token_auth')
const fetch_SuperAdmin = require('./../../middleware/fetch_users')

router
  .route('/')
  .get(tokenAuth, fetch_SuperAdmin, SurCTRL.FetchAllSucharge)
  .post(tokenAuth, fetch_SuperAdmin, SurCTRL.AddSurcharge)

router.route('/:id').put(tokenAuth, fetch_SuperAdmin, SurCTRL.UpdateSurcharge)

module.exports = router
