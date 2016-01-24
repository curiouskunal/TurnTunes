var searchSongs = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'song'
        },
        success: function (response) {
              console.log(response);
        }
    });
};
