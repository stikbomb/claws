'use strict';

exports.changeName = (socket, name) => {
  socket.username = name;
  socket.emit('nameChanged',
    `You successful changed name to ${socket.username}`);
};
