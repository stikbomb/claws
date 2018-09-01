'use strict';

const connect = require('./connect');
const chat = require('./chat');
const utils = require('./utils');

module.exports = io => {
  io.on('connection', (socket) => {
    // Create connection to socket
    // Return:
    // socket.emit('activeGames', games);
    // socket.emit('connected', `You are connected to chat as ${socket.username}`);
    connect.connect(socket);

    // Init new game
    // Return:
    // socket.emit('room', game._id);
    // socket.to(game._id).emit('alert', obj); "START IN 10 SECS" and "START NOW"
    socket.on('init', () => {
      connect.init(io, socket);
    });

    // Return active games:
    // socket.emit('activeGames', games);
    socket.on('getActiveGames', () => {
      utils.getActiveGames(socket);
    });

    // Join to game
    // Return:
    // socket.emit('joined', timer);
    // socket.emit('room', game._id);
    socket.on('joinRoom', game => {
      connect.joinGame(socket, game);
    });

    // Chat to all rooms
    // Return:
    // socket.to('all').emit('message', obj);
    socket.on('msg', (content) => {
      chat.msg(socket, content);
    });

    // Change players name in socket
    // Return:
    // socket.emit('nameChanged', `You successful changed name to ${socket.username}`);
    socket.on('changeName', name => {
      utils.changeName(socket, name);
    });

    // Receive message history
    // Return:
    // socket.emit('history', messages.reverse());
    socket.on('receiveHistory', () => {
      chat.receiveHistory(socket);
    });
  });
};

