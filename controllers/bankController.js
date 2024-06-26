const Bank = require("../schemas/banks")
const UserBank = require("../schemas/user_banks")
const UserBankAmount = require("../schemas/user_bank_amounts")
const User = require("../schemas/users")
const err = require("multer/lib/multer-error")
const mongoose = require("mongoose");
const ObjetId = mongoose.Types.ObjectId;

const getBanks = (req, res) => {
  Bank.find({}).then((result) => {
    res.status(200).send(result)
  }).catch((err) => {
    res.status(500).send({ message: err.message })
  })
}

const getBank = (req, res) => {
  Bank.findById(req.param.id).then((result) => {
    res.status(200).send(result)
  }).catch((err) => {
    res.status(500).send({ message: err.message })
  })
}

const findBankById = (id) => {
  return Bank.findById(id).then((result) => {
    return result
  })
}

const addBank = (req, res) => {
  const { foundationDate, bankName } = req.body
  const imagePath = req.file ? `uploads/banks/${req.file.filename}` : '';
  const newBank = new Bank({
    foundationDate: foundationDate,
    name: bankName,
    imagePath: imagePath,
  })

  try {
    const savedBank = newBank.save()
    res.status(201).json(savedBank)
  } catch (error) {
    res.status(500).send({ message: err.message })
  }
}

const updateBank = (req, res) => {
  const { foundationDate, bankName, id } = req.body
  findBankById(id).then((bank) => {
    if (!bank) {
      res.status(404).send({ message: 'Bank not found' })
      return
    }

    if (bank.foundationDate !== foundationDate) {
      bank.foundationDate = foundationDate
    }
    if (bank.name !== bankName) {
      bank.name = bankName
    }
    if (req.file) {
      bank.imagePath = `uploads/banks/${req.file.filename}`
    }

    try {
      const savedBank = bank.save()
      res.status(201).json(savedBank)
    } catch (error) {
      res.status(500).send({ message: err.message })
    }
  })
}

const deleteBank = (req, res) => {
  Bank.findByIdAndDelete(req.param.id).then((result) => {
    res.status(200).send(result)
  }).catch((err) => {
    res.status(500).send({ message: err.message })
  })
}

const saveUserBank = async (req, res) => {
  const bankId = req.query.bankId
  const bank = await findBankById(bankId)
  if (!bank) {
    res.status(404).send({ message: 'Bank not found' })
    return
  }

  const userId = req.user.id
  const user = await User.findById(userId)

  const userBank = new UserBank({
    bank: bank,
    user: user,
    addedDate: Date.now()
  })

  try {
    const savedUserBank = await userBank.save()

    const userBankAmount = new UserBankAmount({
      accountAmount: 0,
      addedDate: Date.now(),
      updatedDate: Date.now(),
      userBank: userBank,
    })
    userBankAmount.save()
    res.status(201).json(savedUserBank)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

const getUserBanks = (req, res) => {
  UserBank.find({ 'user': new ObjetId(req.user.id) })
    .populate('user')
    .populate('bank')
    .then((result) => {
      res.status(200).send(result)
    }).catch((err) => {
    res.status(500).send({ message: err.message })
  })
}

const getUserBanksWithAmounts = async (req, res) => {
  const userBanks = await UserBank.find({ 'user': new ObjetId(req.user.id) })
    .populate('bank')
  const response = await Promise.all(userBanks.map(async (userBank) =>
    mapUserBankWithAmount(userBank)))
  res.status(200).send(response)
}

const mapUserBankWithAmount = async (userBank) => {
  const userBankAmount = await UserBankAmount.findOne({ 'userBank': userBank._id })

  return {
    userBankId: userBank._id.toHexString(),
    userBankAmountId: userBankAmount._id.toHexString(),
    bankName: userBank.bank.name,
    accountAmount: userBankAmount.accountAmount || 0,
    createdDate: userBank.addedDate,
  }
}

const getUserBanksWithoutLoggedUser = async (req, res) => {
  const userBanks = await UserBank.find({ 'user': { $ne: new ObjetId(req.user.id) } })
    .populate('bank')
    .populate('user')
  res.status(200).send(userBanks)
}

const addAmount = async (req, res) => {
  const userBankId = req.body.userBankId
  const amount = req.body.amount
  const userBankAmount = await UserBankAmount.findOne({ 'userBank': new ObjetId(userBankId) })
  userBankAmount.accountAmount = userBankAmount.accountAmount + +amount

  try {
    const savedUserBankAmount = userBankAmount.save()
    res.status(201).json(savedUserBankAmount)
  } catch (error) {
    res.status(500).send({ message: err.message })
  }
}

const deleteUserBank = async (req, res) => {
  const userBankId = req.params.id
  await UserBankAmount.findOneAndDelete({ 'userBank': new ObjetId(userBankId) })
  await UserBank.findByIdAndDelete(userBankId)
  res.status(204).send({ status: 'Delete successfully' })
}

module.exports = {
  getBanks,
  getBank,
  addBank,
  updateBank,
  deleteBank,
  getUserBanks,
  saveUserBank,
  getUserBanksWithAmounts,
  getUserBanksWithoutLoggedUser,
  addAmount,
  deleteUserBank
}