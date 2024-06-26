const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')
const { TRANSACTION_URL } = require("../constants/const")
const authMiddleware = require('../middleware/authMiddleware')

router.post(TRANSACTION_URL, authMiddleware, transactionController.saveTransaction)
router.get(TRANSACTION_URL, authMiddleware, transactionController.getTransactions)

module.exports = router