var clientId = 'e978f526182dc8e9fff2c3802c852c82';
var resultObj = [];

SC.initialize({
    client_id: clientId
});

var pushTrack = function(track) {
    currentRef.push({
        'song': track.song,
        'img': track.img,
        'url': track.url
    });
};

var pushNowPlaying = function(track) {
  if (isHost) {
    nowPlayingRef.set({
      'song': track.song,
      'img': track.img,
      'url': track.url
    });
  }
}

var searchSC = function(query) {
    SC.get('/tracks', {
        q: query
    }).then(function(tracks) {
        topResults(tracks);
    });
};

var topResults = function(results) {
    var streamable = [];
    var currentResult, currentTrack, artwork, fullTitle, title;

    $('.search-result').remove();
    for (var i = 0; i < results.length; i++) {
        currentResult = results[i];

        if (currentResult.streamable) {
            artwork = currentResult.artwork_url;
            title = currentResult.title;
            fullTitle = title + " - " + currentResult.user.username;

            if (artwork == null) {
                artwork = "img/cover-art.png";
            } else {
                artwork = currentResult.artwork_url.replace('-large', '-t500x500');
            }

            currentTrack = {
                "song": title,
                "img": artwork,
                "url": currentResult.stream_url + "?client_id=" + clientId
            };

            streamable.push(currentTrack);
            $('.search').append('<li data-track="' + i + '" class="search-result list-group-item">' + fullTitle + '</li>');
            resultObj[i] = currentTrack;
        }
    }

    return streamable;

};

$(document).on('click', '.search-result', function() {
    var trackIndex = $(this).data('track');
    pushTrack(resultObj[trackIndex]);
    resultObj = [];
    $('.search-input').val("");
    $('.search-result').remove();
});
