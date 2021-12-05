const router = require('express').Router()
const AuthCTRL = require('./auth.controller')

router.route('/login').post(AuthCTRL.logIn)

module.exports = router
