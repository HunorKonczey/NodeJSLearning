const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserBankAmountSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  accountAmount: Number,
  addedDate: Date,
  updatedDate: Date,
  userBank: { type: Schema.Types.ObjectId, ref: 'user_banks' },
})

module.exports  = mongoose.model('user_bank_amounts', UserBankAmountSchema);
