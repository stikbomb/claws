'use strict';
let list;
let mainRoom;
function response(data) {
  let resp = data.responseText;
  try {
    if (data.message != void (0)) {
      resp = data.message;
    } else {
      resp = JSON.parse(data.responseText);
      resp = resp.message;
    }
  } catch (e) {}
  return resp;
}

$('.logout-btn').on('click', e => {
  e.preventDefault();
  $.ajax({
    url: '/logout',
    type: 'POST',
    data: {},
    success: (res) => {
      alert(response(res));
      location.reload();
    },
    error: (res) => {
      alert(response(res));
    },
  });
});

$(document).ready(() => {
  var socket = io.connect('http://127.0.0.1:7777');
  socket.on('connected', function(msg) {
    console.log(msg);
    socket.emit('login', 'WTF!');
    socket.emit('receiveHistory');
    // socket.emit('start');
  });

  socket.on('activeGames', games => {
    list = games;
  });

  socket.on('message', addMessage);

  socket.on('room', room => {
      mainRoom = room;
      console.log(mainRoom);
  })

  socket.on('history', messages => {
    for (let message of messages) {
      addMessage(message);
    }
  });

  $('.chat-message button').on('click', e => {
    e.preventDefault();

    var selector = $("textarea[name='message']");
    var messageContent = selector.val().trim();
    console.log(messageContent);
    if (messageContent !== '') {
    socket.emit('msg', messageContent, mainRoom);
    selector.val('');
    }
  });

  $('.join-room button').on('click', e => {
    e.preventDefault();
    socket.emit('init');
  });

  $('.join-game button').on('click', e => {
    e.preventDefault();
    console.log('LIST');
    console.log(list[0]);
    socket.emit('joinRoom', list[0]);
  });

  function encodeHTML(str){
    return $('<div />').text(str).html();
  }

  function addMessage(message) {
    message.date = (new Date(message.date)).toLocaleString();
    message.username = encodeHTML(message.username);
    message.content = encodeHTML(message.content);

    var html = `
            <li>
                <div class="message-data">
                    <span class="message-data-name">${message.username}</span>
                    <span class="message-data-time">${message.date}</span>
                </div>
                <div class="message my-message" dir="auto">${message.content}</div>
            </li>`;

    $(html).hide().appendTo('.chat-history ul').slideDown(200);

    $('.chat-history').animate({ scrollTop: $('.chat-history')[0].scrollHeight}, 1000);
  }
});
