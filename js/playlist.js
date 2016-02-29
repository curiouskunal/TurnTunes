/*******************************************************
 Globals
 *******************************************************/
var songQueue;
songQueue = new Queue();
var songCount = 1;
var playing = false;
var id = String(window.location.search.split("id=")[1]).toLowerCase();
var isHost = parseInt(sessionStorage.getItem("isHost"));
var partyName = partyExists(id, isHost);
var url = "https://dazzling-torch-8949.firebaseio.com/" + partyName;
var nowPlayingRef = new Firebase(url + "/now-playing");
var currentRef = new Firebase(url + "/playlist");
var usersRef = new Firebase(url + "/users");
var curSong = 0;

document.title = 'TurnTunes';
$('.partyNameText').append(partyName);

/*******************************************************
  Party Authentication
********************************************************/
function partyExists(party, host) {
  var firebaseRef = new Firebase("https://dazzling-torch-8949.firebaseio.com/");
  firebaseRef.once("value", function(snapshot) {
    var exists = snapshot.child(party).exists();
    //This is to check for party name exists
    if (!exists && !host) {
      alert("Party does not exist. You will be redirected to the homepage.");
      window.open("index.html", "_self");
    }
  });
  return party;
}


/*******************************************************
  Firebase Data Changes
*******************************************************/
currentRef.on('child_added', function (childSnapshot) {
    var key = childSnapshot.key();
    var song = childSnapshot.val().song;
    var url = childSnapshot.val().url;
    var song_id = childSnapshot.val().song_id;

    songQueue.enqueue(childSnapshot.val());
    var length = songQueue.getLength();
    if (length) {
      $("#empty-plist").addClass('hide');
    }
    //To apply the border-color when songs are added during edge cases
    var isPlaying = "";
    if (curSong === 0)
      isPlaying = "current-song";
    else if (curSong === songCount - 1)
      isPlaying = "next-song";
    else if (!isHost && songCount === curSong)
      isPlaying = "current-song";

    $('.playlist').prepend('<li class="list-group-item ' + isPlaying + '" id="song-' + songCount + '"><span class="label label-default label-pill pull-xs-right">' + songCount + '</span>' + song + '</li>');

    if (length == 1 && isHost) {
        if (!($('#song-play').attr('src')) || !playing) {
            playing = true;
            var newSong = songQueue.dequeue();
            pushNowPlaying(newSong);
        } else if (playing) {
          $('#skip-btn').removeClass('hide');
        }
    } else if (length == 2) {
      $('#skip-btn').removeClass('hide');
    }
    songCount++;
});

nowPlayingRef.on("value", function (snapshot) {
    var newSong = snapshot.val();
    if (newSong != null) {
        $('#song-play').attr('src', newSong.url);
        $(".np-title").text(newSong.song);
        $(".np-img").attr('src', newSong.img);
        changeCurrentSong(newSong);
        curSong = newSong.song_id;
        document.title = newSong.song + ' - TurnTunes'
    }

}, function (errorObject) {});

/*******************************************************
  User Functions
*******************************************************/
usersRef.on("value", function (snapshot) {
  var count = snapshot.val();
  $('.userCountText').text(count);
});

function addUser() {
  usersRef.transaction(function (current_value) {
  return (current_value || 0) + 1;
  });
}

function removeUser() {
  usersRef.transaction(function (current_value) {
  return (current_value || 0) - 1;
  });
}

/*******************************************************
  Party UI Changes
*******************************************************/
function changeCurrentSong(song) {
  var oldId = curSong + 1;
  $('#song-' + oldId).removeClass('next-song');
  $('#song-' + curSong).removeClass('current-song');
  $('#song-' + song.song_id).addClass('current-song');
  $('.current-song').removeClass('next-song');
  $('.current-song').prev('li').addClass('next-song');
}

/*******************************************************
  Party UI
*******************************************************/
$(document).ready(function() {
  addUser();

  var url = window.location.href;
  var title = document.title;
  var text = "Come vibe with me."

  $('.fb').click(function() {
      window.open('http://www.facebook.com/sharer/sharer.php?u=' + url + '&title=' + title, 'yourWindowName', 'width=600,height=300');
  });

  $('.tweet').click(function() {
      window.open('http://twitter.com/intent/tweet?status=' + text + '+' + url, 'yourWindowName', 'width=600,height=250');
  });

  $('i.copy').tooltip();

  $('.url-share-button').on('click', function() {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val("http://turntunes.com/party.html?id=" + partyName).select();
    document.execCommand("copy");
    $temp.remove();
    $('i.copy').attr('title', 'Link Copied!').tooltip('fixTitle').tooltip('show');
    setTimeout(function() {
        $('i.copy').attr('title', 'Copy Link').tooltip('fixTitle').tooltip();
    }, 500);
  });

  if (isHost == 1) {
    $("#song-play").attr('controls', 'controls');
  } else {
    $('#skip-btn').remove();
  }
});

window.onunload = function(){
  removeUser();
  sessionStorage.clear();
};

$(".brand").click(function () {
    window.open("index.html", "_self");
});

$('.search-input').bind("enterKey", function (e) {
    var song = $(this).val().toLowerCase();
    if (song != "") {
        searchSC(song);
        $(this).val("");
    }
    $('.search-result').remove();
});

$("#search-btn").on('click', function () {
    var song = $('.search-input').val().toLowerCase();
    if (song != "") {
        searchSC(song);
        $('.search-input').val("");
    }
    $('.search-result').remove();
});

$('.search-input').keyup(function (e) {
    var inp = String.fromCharCode(event.keyCode);
    if (e.keyCode == 13) {
        $(this).trigger("enterKey");
    } else if (/[a-zA-Z0-9- ]/.test(inp) || event.keyCode == 8) {
      var song = $(this).val().toLowerCase();
      if (song != "")
        searchSC(song);
    }
});

$('.search-input').keydown(function (e) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9- ]/.test(inp) || event.keyCode == 8) {
      $('.search-result').remove();
    }
});

$('#song-play').on('ended', function () {
    //Hide the currently playing color scheme
    var songId = songCount - 1;
    $('#song-' + songId).removeClass('current-song');
    if (songQueue.peek()) {
        var newSong = songQueue.dequeue();
        if (isHost) {
            pushNowPlaying(newSong);
        }
        if (!songQueue.getLength()) {
          $('#skip-btn').addClass('hide');
        }
    } else {
        playing = false;
    }
});

$('#skip-btn').on('click', function () {
    var newSong = songQueue.dequeue();
    if (!songQueue.getLength()) {
      $('#skip-btn').addClass('hide');
    }
    pushNowPlaying(newSong);
});

$('body').on('click keyup', function(e) {
  if (e.type === "click" || e.keyCode == 27) {
    $('.search-input').val("");
    $('.search-result').remove();
  }
});
