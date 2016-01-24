var x = "";
var searchSongs = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'track'
        },
        success: function (response) {
          x = response;
              console.log(response);
              console.log(response.tracks.items[0].preview_url);
        }
    });
};
