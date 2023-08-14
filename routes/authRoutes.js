const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')


router.route('/login')
    .post(authController.login)

router.route('/sign-up')
    .post(authController.signup)

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .get(authController.logout)

module.exports = router