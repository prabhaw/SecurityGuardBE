const router = require('express').Router()
const signupemail = require('../middlewares/user.middleware')
const userCTRL = require('./../controllers/user.controller')
const tokenAuth = require('./../../../middleware/token_auth')
const adminMidd = require('./../../../middleware/admin_user')
const userMiddle = require('./../../../middleware/fetch_users')

router.route('/admin').post(signupemail, userCTRL.insertAdmin)

router
  .route('/')
  .get(tokenAuth, adminMidd, userCTRL.fetchAllUser)
  .post(tokenAuth, adminMidd, signupemail, userCTRL.insertUser)
router.route('/fetch-guard').get(tokenAuth, userMiddle, userCTRL.fetchAllGuard)
router.route('/getByToken').get(tokenAuth, userCTRL.fetchUserById)
router.route('/password/:id').put(tokenAuth, userCTRL.updatePassword)

module.exports = router
