const mongoose = require('mongoose');

const WarnSchema = new mongoose.Schema({
  guildId: String,
  userId: String,
  moderatorId: String,
  reason: String,
  date: Number,
});

module.exports = mongoose.model('Warn', WarnSchema);