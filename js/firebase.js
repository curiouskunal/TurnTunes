var url = localStorage.getItem("currentRef");

currentRef = new Firebase(url);

console.log(currentRef);


currentRef.on('child_added', function(childSnapshot) {
    //console.log(currentRef);
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

    $('.playlist').append('<li class="list-group-item"><span class="label label-default label-pill pull-xs-right">' + songCount + '</span>' + song + '</li>');
    songCount++;
});
