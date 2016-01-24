var searchSongs = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'track'
        },
        success: function (response) {
          usersRef.push({
            'song': query,
            'url': response.tracks.items[0].preview_url,
            'votes': 1
          });
          console.log(response);
          console.log(response.tracks.items[0].preview_url);
        }
    });
};
