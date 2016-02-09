/*******************************************************
  Globals
*******************************************************/
var songQueue = new Queue();
var songCount = 1;
var playing = false;
var id = String(window.location.search.split("id=")[1]).toLowerCase();
var isHost = parseInt(sessionStorage.getItem("isHost"));
var partyName = partyExists(id, isHost);
var url = "https://dazzling-torch-8949.firebaseio.com/" + partyName;
var nowPlayingRef = new Firebase(url + "/now-playing");
var currentRef = new Firebase(url + "/playlist");
document.title = 'TurnTunes - ' + partyName;
$('.partyNameText').append('('+partyName+')');

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

    songQueue.enqueue(childSnapshot.val());
    var length = songQueue.getLength();
    if (length) {
      $("#empty-plist").addClass('hide');
    }
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

    $('.playlist').append('<li class="list-group-item"><span class="label label-default label-pill pull-xs-right">' + songCount + '</span>' + song + '</li>');
    songCount++;
});

nowPlayingRef.on("value", function (snapshot) {
    var newSong = snapshot.val();
    if (newSong != null) {
        $('#song-play').attr('src', newSong.url);
        $(".np-title").text(newSong.song);
        $(".np-img").attr('src', newSong.img);
    }

}, function (errorObject) {});

/*******************************************************
  Party UI
*******************************************************/
if (isHost == 1) {
  //$('#skip-btn').show();
  var mainRef = new Firebase(url);
  mainRef.update({
    "platform": "web"
  });
  $("#song-play").attr('controls', 'controls');
} else {
  $('#skip-btn').remove();
}

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
