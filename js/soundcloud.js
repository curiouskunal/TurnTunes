var clientId = 'e978f526182dc8e9fff2c3802c852c82';

SC.initialize({
  client_id: clientId
});

var searchSC = function (query) {
  SC.get('/tracks', {
    q: query
  }).then(function(tracks) {
    console.log(topResults(tracks));
    topTrack = tracks[0];
    usersRef.push({
      'song': topTrack.title + " - " + topTrack.user.username,
      'img': "http://i.imgur.com/665vfkH.png",//topTrack.artwork_url.replace('-large', '-t500x500'),
      'url': topTrack.stream_url + "?client_id=" + clientId,
      'stream?': topTrack.streamable
    });
  });
};

var topResults = function(results) {
  var topFive = [];
  var currentTrack;
  var artwork;

  for (var i = 0; i < results.length; i++) {
    currentTrack = results[i];

    if (currentTrack.streamable && topFive.length < 5) {
      artwork = currentTrack.artwork_url;

      if (artwork == null) {
        artwork = "http://i.imgur.com/665vfkH.png";
      } else {
        artwork = currentTrack.artwork_url.replace('-large', '-t500x500');
      }

      topFive.push({
        'song': currentTrack.title + " - " + currentTrack.user.username,
        'img': artwork,
        'url': currentTrack.stream_url + "?client_id=" + clientId,
      })
    }
  }

  return topFive;

};
