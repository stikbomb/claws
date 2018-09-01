'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GamesSchema = new Schema({
  date: {type: Date},
  dateMs: {type: Number},
  status: {type: String},
  host: {id: {type: String},
    name: {type: String},
    result: {type: String}},
  players: [{id: String,
    name: {type: String},
    result: String}],
},
{
  versionKey: false,
  collection: 'GamesCollection',
});

module.exports = mongoose.model('GamesModel', GamesSchema);
