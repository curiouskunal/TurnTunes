var usersRef = new Firebase('https://dazzling-torch-8949.firebaseio.com/grape');
var songQueue = new Queue(); // The class was taken from this site http://code.stephenmorley.org/javascript/queues/
var playing = false;
var songCount = 1;

//Firebase data functions
usersRef.on('child_added', function(childSnapshot) {
  var key = childSnapshot.key();
  var song = childSnapshot.val().song;
  var url = childSnapshot.val().url;
  var votes = childSnapshot.val().votes;
  songQueue.enqueue(childSnapshot.val());
  var length = songQueue.getLength();
  if (length == 1) {
  	$("#empty-plist").hide();
    if (!($('#song-play').attr('src')) || !playing) {
      playing = true;
      var newSong = songQueue.dequeue();
      $('#song-play').attr('src', newSong.url);
      $(".np-title").text(newSong.song);
      $(".np-img").attr('src', newSong.img)
    }
  }
  $('.playlist').append('<li class="list-group-item"><span class="label label-default label-pill pull-xs-right">'+songCount+'</span>'+song+'</li>');
  songCount++;
});

// Main Page UI functions
$("#host-btn").click(function() {
 if ( $(".join-input").css('visibility') == 'hidden' )
    $(".join-input").css('visibility','visible').focus();
  else
    $(".join-input").css('visibility','hidden');
});

$(".brand").click(function(){
  window.location.href =  "index.html";
});

$('.join-input').keypress(function (e) {
  if (e.which == 13) {
    dest = $('.join-input').val();
    usersRef.remove();
    $('#skip-btn').show();
    window.location.href =  dest.toLowerCase() + ".html?host=grape";
    return false;
  }
});

var isHost = window.location.search.substring(6);

if (isHost == 'grape') {
  $('#skip-btn').show();
  $("#song-play").attr('controls','controls');
}

$('#join-btn').on('click', function() {
  window.location.href =  "party.html"; //Hardcoded into butter for now
  return false;
});

//Playlist page UI functions
$('.add-input').bind("enterKey",function(e){
   var song = $(this).val().toLowerCase();
   searchSC(song);
   $(this).val("");
});

$("#add-btn").on('click', function() {
  var song = $('.add-input').val().toLowerCase();
  searchSC(song);
  $('.add-input').val("");
});

$('.add-input').keyup(function(e){
    if(e.keyCode == 13) {
        $(this).trigger("enterKey");
    }
});

$('#song-play').on('ended', function() {
  if (songQueue.peek()) {
    var newSong = songQueue.dequeue();
    $(this).attr('src', newSong.url);
    $(".np-title").text(newSong.song);
    $(".np-img").attr('src', newSong.img)
  } else {
    playing = false;
  }
});

$('#skip-btn').on('click', function() {
  var newSong = songQueue.dequeue();
  $('#song-play').attr('src', newSong.url);
  $(".np-title").text(newSong.song);
  $(".np-img").attr('src', newSong.img)
});
