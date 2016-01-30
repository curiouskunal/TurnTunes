var usersRef = new Firebase('https://dazzling-torch-8949.firebaseio.com/grape/playlist');
var nowPlaying = new Firebase('https://dazzling-torch-8949.firebaseio.com/grape/now-playing');
var songQueue = new Queue(); // The class was taken from this site http://code.stephenmorley.org/javascript/queues/
var playing = false;
var songCount = 1;

var isHost = window.location.search.substring(6) == 'd74fdde2944f475adc4a85e349d4ee7b';

if (isHost) {
    $('#skip-btn').show();
    $("#song-play").attr('controls', 'controls');
}

//Firebase data functions
usersRef.on('child_added', function(childSnapshot) {
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
            if (isHost) {
                nowPlaying.set({
                    'song': newSong.song,
                    'img': newSong.img,
                    'url': newSong.url
                });
            }
        }
    }

    $('.playlist').append('<li class="list-group-item"><span class="label label-default label-pill pull-xs-right">' + songCount + '</span>' + song + '</li>');
    songCount++;
});

nowPlaying.on("value", function(snapshot) {
    var newSong = snapshot.val();
    $('#song-play').attr('src', newSong.url);
    $(".np-title").text(newSong.song);
    $(".np-img").attr('src', newSong.img);

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

$('.join-input').keypress(function(e) {
    if (e.which == 13) {
        dest = $('.join-input').val();
        if (dest.toLowerCase() == "butter") {
            usersRef.remove();
            nowPlaying.remove();
            $('#skip-btn').show();
            window.location.href = "party.html?host=d74fdde2944f475adc4a85e349d4ee7b";
        } else {
            $(this).val("");
            alert("Incorrect Password");
        }

        return false;
    }
});

$('#join-btn').on('click', function() {
    window.location.href = "party.html";
    return false;
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
