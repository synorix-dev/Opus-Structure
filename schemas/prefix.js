/**
 * Opus Structure v1.6
 * Copyright (c) 2025 SYNORIX
 * Licensed under the Opus Structure License v1.6
 * Free to use and modify — Commercial use prohibited.
 */

const mongoose = require('mongoose');

const PrefixSchema = new mongoose.Schema({
  guildId: String,
  prefix: String,
});

module.exports = mongoose.model('Prefix', PrefixSchema);