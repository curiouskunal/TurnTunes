var searchSongs = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'track'
        },
        success: function (response) {
          usersRef.push({
            'song': response.tracks.items[0].name + " - " + response.tracks.items[0].artists[0].name,
            'url': response.tracks.items[0].preview_url,
            'img': response.tracks.items[0].album.images[2].url,
            'album': response.tracks.items[0].album.name,
            'votes': 1
          });
        }
    });
};
