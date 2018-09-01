'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TextSchema = new Schema({
  createdAt: {type: Date},
  updatedAt: {type: Date},
  author: {type: String},
  content: {type: String}
}, {
  versionKey: false,
  collection: 'TextsCollection',
});

module.exports = mongoose.model('TextModel', TextSchema);