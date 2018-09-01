'use strict';

const connect = require('./connect');
const chat = require('./chat');
const utils = require('./utils');

module.exports = io => {
  io.on('connection', (socket) => {
    // Create connection to socket, receive list of active game
    connect.connect(socket);

    // Init new game, receive game ID, start countdown, start game
    socket.on('init', () => {
      connect.init(io, socket);
    });

    // Join to game, receive timer, receive game ID
    socket.on('joinRoom', game => {
      connect.joinGame(socket, game);
    });

    // Chat to all rooms
    socket.on('msg', (content) => {
      chat.msg(socket, content);
    });

    // Change players name in socket
    socket.on('changeName', name => {
      utils.changeName(socket, name);
    });

    // Receive message history
    socket.on('receiveHistory', () => {
      chat.receiveHistory(socket);
    });
  });
};

