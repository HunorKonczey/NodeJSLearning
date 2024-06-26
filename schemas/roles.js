const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: { type: String, enum: ["ADMIN", "USER"] },
})

module.exports = mongoose.model('roles', RoleSchema);