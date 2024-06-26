const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: Schema.Types.ObjectId,
  email: { type: String, unique: true, required: true },
  name: String,
  password: { type: String, unique: true, required: true },
  roleIds: [{ type: Schema.Types.ObjectId, ref: 'roles' }]
})

module.exports  = mongoose.model('users', UserSchema);