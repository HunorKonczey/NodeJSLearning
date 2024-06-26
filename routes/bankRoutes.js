const express = require('express')
const bankController = require("../controllers/bankController")
const { BANKS_URL, USER_BANKS_URL } = require("../constants/const")
const router = express.Router()
const multer = require('multer')
const path = require('path')
const authMiddleware = require('../middleware/authMiddleware')

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/banks/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage })

router.get(BANKS_URL, authMiddleware, bankController.getBanks)
router.get(USER_BANKS_URL, authMiddleware, bankController.getUserBanks)
router.get(BANKS_URL + ':id', authMiddleware, bankController.getBank)
router.post(BANKS_URL, upload.single('imageFile'), authMiddleware, bankController.addBank);
router.post(BANKS_URL + 'update', authMiddleware, upload.single('imageFile'), bankController.updateBank)
router.get(BANKS_URL + 'delete/:id', authMiddleware, bankController.deleteBank)
router.post(USER_BANKS_URL, authMiddleware, bankController.saveUserBank)
router.get(USER_BANKS_URL + 'amounts', authMiddleware, bankController.getUserBanksWithAmounts)
router.get(USER_BANKS_URL + 'others', authMiddleware, bankController.getUserBanksWithoutLoggedUser)
router.post(USER_BANKS_URL + 'amount', authMiddleware, bankController.addAmount);
router.get(USER_BANKS_URL + 'delete/:id', authMiddleware, bankController.deleteUserBank);

module.exports = router;