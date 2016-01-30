var usersRef = new Firebase('https://dazzling-torch-8949.firebaseio.com/grape/playlist');
var nowPlaying = new Firebase('https://dazzling-torch-8949.firebaseio.com/grape/now-playing');
var songQueue = new Queue(); // The class was taken from this site http://code.stephenmorley.org/javascript/queues/
var playing = false;
var songCount = 1;
var firebaseRef = new Firebase('https://dazzling-torch-8949.firebaseio.com/');
var currentRef;

var isHost = window.location.search.search("htrue");

if (isHost !== -1) {
    $('#skip-btn').show();
    $("#song-play").attr('controls', 'controls');
}

nowPlaying.on("value", function(snapshot) {
    var newSong = snapshot.val();
    if (newSong != null) {
      $('#song-play').attr('src', newSong.url);
      $(".np-title").text(newSong.song);
      $(".np-img").attr('src', newSong.img);
  }

}, function(errorObject) {});


// Main Page UI functions
$("#host-btn").click(function() {
    if ($(".join-input").css('visibility') == 'hidden')
        $(".join-input").css('visibility', 'visible').focus();
    else
        $(".join-input").css('visibility', 'hidden');
});

$(".brand").click(function() {
    window.location.href = "index.html";
});

//Playlist page UI functions
$('.add-input').bind("enterKey", function(e) {
    var song = $(this).val().toLowerCase();
    if (song != "") {
        searchSC(song);
        $(this).val("");
    }
    $('.search-result').remove();
});

$("#add-btn").on('click', function() {
    var song = $('.add-input').val().toLowerCase();
    if (song != "") {
        searchSC(song);
        $('.add-input').val("");
    }
    $('.search-result').remove();
});

$('.add-input').keyup(function(e) {
    if (e.keyCode == 13) {
        $(this).trigger("enterKey");
    }
});

$('#song-play').on('ended', function() {
    if (songQueue.peek()) {
        var newSong = songQueue.dequeue();
        if (isHost) {
            nowPlaying.set({
                'song': newSong.song,
                'img': newSong.img,
                'url': newSong.url
            });
        }
        $(this).attr('src', newSong.url);
        $(".np-title").text(newSong.song);
        $(".np-img").attr('src', newSong.img)
    } else {
        playing = false;
    }

});

$('#skip-btn').on('click', function() {
    var newSong = songQueue.dequeue();
    nowPlaying.set({
        'song': newSong.song,
        'img': newSong.img,
        'url': newSong.url
    });
});

// Main Page UI functions

$('.join-input').keypress(function(e) {
    if (e.which == 13) {
        dest = $('.join-input').val();
        if (dest == ""){
          alert("Please specify a party name");
        }
        usersRef.remove();
        nowPlaying.remove();
        window.location.href = "party.html?host=" + dest + "htrue";
        var temp = firebaseRef.child(dest);
        currentRef = temp;
        currentRef.set ({
        });
        localStorage.setItem("currentRef", currentRef);
        return false;
    }
});

$('.join-party').keypress(function(e) {
    if (e.which == 13) {
        dest = $('.join-party').val();
        if (dest == ""){
          alert("Please specify a party name");
        }
        window.location.href = "party.html?host=" + dest;
        var temp = firebaseRef.child(dest);
        currentRef = temp;
        localStorage.setItem("currentRef", currentRef);
        return false;
    }
});

$('#join-btn').on('click', function() {
  if ($(".join-party").css('visibility') == 'hidden')
      $(".join-party").css('visibility', 'visible').focus();
  else
      $(".join-party").css('visibility', 'hidden');
});
