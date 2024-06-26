const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BankSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  foundationDate: Date,
  name: String,
  imagePath: String,
})

BankSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('banks', BankSchema);