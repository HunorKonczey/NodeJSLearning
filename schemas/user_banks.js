const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserBankSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  addedDate: Date,
  bank: { type: Schema.Types.ObjectId, ref: 'banks' },
  user: { type: Schema.Types.ObjectId, ref: 'users' },
})

UserBankSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports  = mongoose.model('user_banks', UserBankSchema);