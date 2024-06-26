const mongoose = require("mongoose")
const Transaction = require("../schemas/transactions")
const UserBankAmount = require("../schemas/user_bank_amounts")
const UserBank = require("../schemas/user_banks")
const err = require("multer/lib/multer-error");
const ObjetId = mongoose.Types.ObjectId

const saveTransaction = async (req, res) => {
  const senderUserBankId = req.body.senderUserBankId
  const receiverUserBankId = req.body.receiverUserBankId
  const transactionAmount = +req.body.transactionValue

  const userBankAmount = await UserBankAmount.findOne({ 'userBank': new ObjetId(senderUserBankId) })
  const senderUserBank = await UserBank.findById(senderUserBankId)
  const receiverUserBank = await UserBank.findById(receiverUserBankId)
  const transaction = new Transaction({
    transactionValue: transactionAmount,
    transactionDate: Date.now(),
    transactionStatus: 'DECLINED',
    receiverUserBank: receiverUserBank,
    senderUserBank: senderUserBank,
  })

  if (userBankAmount.accountAmount < transactionAmount) {
    transaction.save()
    res.status(404).json({ message: `Not enough amount for this transaction, transaction value: ${transactionAmount}` })
  }

  transaction.transactionStatus = 'ACCEPTED'
  userBankAmount.accountAmount = userBankAmount.accountAmount - transactionAmount
  userBankAmount.save()

  const receiverUserBankAmount = await UserBankAmount.findOne({ 'userBank': new ObjetId(receiverUserBankId) })
  receiverUserBankAmount.accountAmount = receiverUserBankAmount.accountAmount + transactionAmount
  receiverUserBankAmount.save()
  try {
    const savedTransaction = await transaction.save()
    res.status(201).json(savedTransaction)
  } catch (error) {
    res.status(500).send({ message: err.message })
  }
}

const getTransactions = async (req, res) => {
  const userBanks = await UserBank.find({ 'user': new ObjetId(req.user.id) })
    .populate('user')
    .populate('bank')
  const sentTransactions = await Promise.all(userBanks.flatMap(async userBank => findSentTransactions(userBank._id)))
  const receivedTransactions = await Promise.all(userBanks.flatMap(async userBank => findReceivedTransactions(userBank._id)))

  res.status(200).json({
    sentTransactions: sentTransactions.flat(), receivedTransactions: receivedTransactions.flat()
  })
}

const findSentTransactions = async (bankId) => {
  return Transaction.find({ 'senderUserBank': bankId }).populate({
    path: 'receiverUserBank', populate: [{ path: 'user' }, { path: 'bank' }],
  }).populate({
    path: 'senderUserBank', populate: [{ path: 'user' }, { path: 'bank' }],
  })
}

const findReceivedTransactions = async (bankId) => {
  return Transaction.find({ 'receiverUserBank': bankId }).populate({
    path: 'receiverUserBank', populate: [{ path: 'user' }, { path: 'bank' }],
  }).populate({
    path: 'senderUserBank', populate: [{ path: 'user' }, { path: 'bank' }],
  })
}

module.exports = {
  saveTransaction, getTransactions
}