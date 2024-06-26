const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  transactionValue: Number,
  transactionDate: Date,
  transactionStatus: { type: String, enum: ["ACCEPTED", "PENDING", "DECLINED"] },
  receiverUserBank: { type: Schema.Types.ObjectId, ref: 'user_banks' },
  senderUserBank: { type: Schema.Types.ObjectId, ref: 'user_banks' },
})

TransactionSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports  = mongoose.model('transactions', TransactionSchema);