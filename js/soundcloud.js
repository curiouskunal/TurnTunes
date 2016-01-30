var clientId = 'e978f526182dc8e9fff2c3802c852c82';
var resultObj = [];

SC.initialize({
    client_id: clientId
});

var pushTrack = function(track) {
    usersRef.push({
        'song': track.song,
        'img': track.img,
        'url': track.url
    });
};

var searchSC = function(query) {
    SC.get('/tracks', {
        q: query
    }).then(function(tracks) {
        topResults(tracks);
    });
};

var topResults = function(results) {
    var topFive = [];
    var currentTrack;
    var artwork, title;
    var legitTrack;

    for (var i = 0; i < results.length; i++) {
        currentTrack = results[i];

        if (currentTrack.streamable && topFive.length < 5) {
            artwork = currentTrack.artwork_url;
            title = currentTrack.title + " - " + currentTrack.user.username;

            if (artwork == null) {
                artwork = "http://i.imgur.com/665vfkH.png";
            } else {
                artwork = currentTrack.artwork_url.replace('-large', '-t500x500');
            }

            legitTrack = {
              "song": title,
              "img": artwork,
              "url": currentTrack.stream_url + "?client_id=" + clientId
            };

            topFive.push(legitTrack);
            $('.search').append('<li data-track="'+i+'" class="search-result list-group-item">' + title + '</li>');
            resultObj[i] = legitTrack;
        }
    }

    return topFive;

};

$(document).on('click', '.search-result', function() {
    var trackIndex = $(this).data('track');
    pushTrack(resultObj[trackIndex]);
    resultObj = [];
    $('.search-result').remove();
});
