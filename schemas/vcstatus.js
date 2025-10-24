/**
 * Opus Structure v1.6
 * Copyright (c) 2025 SYNORIX
 * Licensed under the Opus Structure License v1.6
 * Free to use and modify — Commercial use prohibited.
 */

const { Schema, model } = require("mongoose");

const vcStatusSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: false }
});

module.exports = model("VCStatus", vcStatusSchema);