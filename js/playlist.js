/*******************************************************
  Globals
*******************************************************/
var songQueue = new Queue();
var songCount = 1;
var playing = false;
var partyName = window.location.search.split("id")[1];
var isHost = sessionStorage.getItem("isHost");
var url = "https://dazzling-torch-8949.firebaseio.com/" + partyName;
var nowPlayingRef = new Firebase(url + "/now-playing");
var currentRef = new Firebase(url + "/playlist");


/*******************************************************
  Party UI
*******************************************************/
if (isHost == 1) {
    $('#skip-btn').show();
    $("#song-play").attr('controls', 'controls');
}

$(".brand").click(function () {
    window.location.href = "index.html";
});

currentRef.on('child_added', function (childSnapshot) {
    var key = childSnapshot.key();
    var song = childSnapshot.val().song;
    var url = childSnapshot.val().url;

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
    if (e.keyCode == 13) {
        $(this).trigger("enterKey");
    }
});

$('#song-play').on('ended', function () {
    if (songQueue.peek()) {
        var newSong = songQueue.dequeue();
        if (isHost) {
            nowPlayingRef.set({
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

$('#skip-btn').on('click', function () {
    var newSong = songQueue.dequeue();

    nowPlayingRef.set({
        'song': newSong.song,
        'img': newSong.img,
        'url': newSong.url
    });
});
