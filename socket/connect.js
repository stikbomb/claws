'use strict';
let GamesModel = require('../models/games.model');
let User = require('../models/users.model');


exports.connect = (socket) => {
  GamesModel.find({status: 'Starting'}, (err, games) => {
    if (err) throw err;
    socket.emit('activeGames', games);
  });

  if (!socket.handshake.session.passport) {
    socket.username = 'guest' + Math.round(Math.random() * 10000000);
    socket.emit('connected',
      `You are connected to chat as ${socket.username}`);
  } else {
    let var0 = socket.handshake.session.passport.user;
    User.findOne({_id: var0._id}, (err, user) => {
      if (err)
        return (err);
      socket.username = user.local.name;
      socket.emit('connected',
        `You are connected to chat as ${socket.username}`);
    });
  }
};

exports.init = (io, socket) => {
  const obj = {
    date: Date.now(),
    dateMs: Date.now(),
    status: 'Starting',
  };

  GamesModel.create(obj, (err, game) => {
    if (err) {
      return console.log('MessageModel', err);
    }
    socket.join(game._id, (err) => {
      if (err) throw err;
      socket.emit('room', game._id);
      setTimeout(() => {
        const obj = {
          content: ' START IN 10 SECS',
        };
        // socket.emit('alert', obj);
        socket.to(game._id).emit('alert', obj);
        setTimeout(() => {
          const obj = {
            content: 'START NOW!',
          };
          // socket.emit('alert', obj);
          socket.to(game._id).emit('alert', obj);
        }, 10000);
      }, 1000);
    });
  });
};

exports.joinGame = (socket, game) => {
  socket.join(game._id, (err) => {
    if (err) throw err;
    let time = Date.now();
    let timer = time - game.dateMs + 30000;
    socket.emit('joined', timer);
    socket.emit('room', game._id);
  });
};