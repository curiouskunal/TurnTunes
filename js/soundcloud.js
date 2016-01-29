var clientId = 'e978f526182dc8e9fff2c3802c852c82';

SC.initialize({
  client_id: clientId
});

var searchSC = function (query) {
  SC.get('/tracks', {
    q: query
  }).then(function(tracks) {
    topTrack = tracks[0];
    usersRef.push({
      'song': topTrack.title + " - " + topTrack.user.username,
      'img': topTrack.artwork_url.replace('-large', '-t500x500'),
      'url': topTrack.stream_url + "?client_id=" + clientId,
      'stream?': topTrack.streamable
    });
  });
};
