const { Schema, model } = require("mongoose");

const vcStatusSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: false }
});

module.exports = model("VCStatus", vcStatusSchema);