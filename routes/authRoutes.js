const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { API_URL, USERS_URL } = require("../constants/const")
const authMiddleware = require('../middleware/authMiddleware')

router.post(USERS_URL + 'register', authController.register)
router.get(USERS_URL + 'token/refresh', authController.refresh)
router.post(API_URL + 'login', authController.login)
router.get(USERS_URL + ':id', authMiddleware, authController.getUser)

module.exports = router