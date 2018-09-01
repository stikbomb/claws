'use strict';
let GamesModel = require('../models/games.model');
let User = require('../models/users.model');
let utils = require('./utils');
let Text = require('../models/texts.model');


exports.connect = (socket) => {
  utils.getActiveGames(socket);
  socket.join('all');
  socket.username = utils.getName(socket);
  socket.emit('connected',
    `You are connected to chat as ${socket.username}`);

};

exports.init = async (io, socket) => {
  let id = 'guest';
  if (socket.handshake.session.passport) {
    id = socket.handshake.session.passport.user._id;
  }
  Text.count().exec((err, count) => {
    let random = Math.floor(Math.random() * count);
    Text.findOne().skip(random).exec((err, randomText) => {
      const obj = {
        host: {id: id,
          name: socket.username,
        },
        text: randomText.content,
        date: Date.now(),
        dateMs: Date.now(),
        status: 'Starting',
      };

      GamesModel.create(obj, (err, game) => {
        if (err) {
          return console.log('MessageModel', err);
        }
        console.log(socket.handshake.session.passport);
        socket.join(game._id, (err) => {
          if (err) throw err;
          socket.emit('room', game._id);
          setTimeout(() => {
            const obj = {
              content: 'START IN 10 SECS',
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
    })
  })

};

exports.joinGame = (socket, game) => {
  socket.join(game._id, (err) => {
    if (err) throw err;
    let time = Date.now();
    let timer = time - game.dateMs + 30000;
    let id = 'guest';
    if (socket.handshake.session.passport) {
      id = socket.handshake.session.passport.user._id;
    }
    let player = {id: id,
      name: socket.username};
    GamesModel.findOneAndUpdate({_id: game._id}, {$push: {players: player}}, (err) => {
      if (err) throw err;
      socket.emit('joined', timer);
      socket.emit('room', game._id);
    });
  });
};