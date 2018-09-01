'use strict';

const GamesModel = require('../models/games.model');

exports.changeName = (socket, name) => {
  socket.username = name;
  socket.emit('nameChanged',
    `You successful changed name to ${socket.username}`);
};

exports.getName = (socket) => {
  if (!socket.handshake.session.passport) {
    return 'guest' + Math.round(Math.random() * 10000000);
  } else {
    return socket.handshake.session.passport.user.local.name;
  }
};

exports.getActiveGames = (socket) => {
  GamesModel.find({status: 'Starting'}, (err, games) => {
    if (err) throw err;
    socket.emit('activeGames', games);
  });
};
