var chat = new Firebase(url + "/chat");

$('#chat-input').on('keypress', function(e) {
  if (e.keyCode === 13) {
    var $msg = $(this);
    addMsg($msg.val(), "Kokul");
    $msg.val("");
  }
});

function addMsg(msg, user) {
  var date = new Date();
  chat.push({
    "message": msg,
    "user": user,
    "time": date.getHours() + ":" + date.getMinutes()
  });
}

chat.on('child_added', function (childSnapshot) {
  var message = childSnapshot.val().message;
  var user = childSnapshot.val().user;
  var time = childSnapshot.val().time;
  var $box = $('.chat-msg');
  $box.append("<p>" + message + "</p><p>" + user + "</p><p>" + time + "</p>");
});
