/**
 * Opus Structure v1.6
 * Copyright (c) 2025 SYNORIX
 * Licensed under the Opus Structure License v1.6
 * Free to use and modify — Commercial use prohibited.
 */

const mongoose = require("mongoose");

const noPrefixSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  expiresAt: { type: Date, default: null }
});

module.exports = mongoose.model("NoPrefixUser", noPrefixSchema);