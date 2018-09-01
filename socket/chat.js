'use strict';

const moment = require('moment');
const MessageModel = require('../models/messages.model');

exports.msg = (socket, content) => {
  const obj = {
    date: new Date(),
    dateFormat: moment(new Date()).format('HH:mm:ss DD.MM.YYYY'),
    content: content,
    username: socket.username,
  };

  MessageModel.create(obj, (err) => {
    if (err) {
      return console.log('MessageModel', err);
    }
    socket.emit('message', obj);
    socket.to('all').emit('message', obj);
  });
};

exports.receiveHistory = (socket) => {
  MessageModel.find({})
    .sort({date: -1})
    .limit(10)
    .lean()
    .exec((err, messages) => {
      if (!err) {
        socket.emit('history', messages.reverse());
      }
    });
};

