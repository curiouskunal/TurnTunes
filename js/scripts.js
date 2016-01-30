var usersRef = new Firebase('https://dazzling-torch-8949.firebaseio.com/grape');
var firebaseRef = new Firebase('https://dazzling-torch-8949.firebaseio.com/');
var songQueue = new Queue(); // The class was taken from this site http://code.stephenmorley.org/javascript/queues/
var playing = false;
var songCount = 1;
var currentRef;

//firebaseRef.set({
  //title: "Turn Tunes",
  //author: "TurnTunes Inc.",
//});

/*usersReff.push ({
  'song': "song",
  'img': "image",
  'url': "track"
});
usersReff.push ({
  'song': "song",
  'img': "image",
  'url': "track"
});
usersReff.push ({
  'song': "song",
  'img': "image",
  'url': "track"
});*/

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
        if (dest == ""){
          alert("Please specify a party name");
        }
        window.location.href = "party.html?host=" + dest;
        /*if (dest.toLowerCase() == "butter") {
            usersRef.remove();
            $('#skip-btn').show();
            window.location.href = "party.html?host=d74fdde2944f475adc4a85e349d4ee7b";
        } else {
            $(this).val("");
            alert("Incorrect Password");
        }*/
        var temp = firebaseRef.child(dest);
        currentRef = temp;
        currentRef.set ({
        });
        localStorage.setItem("currentRef", currentRef);
        return false;
    }
});

$('.join-party').keypress(function(e) {
    if (e.which == 13) {
        dest = $('.join-party').val();
        if (dest == ""){
          alert("Please specify a party name");
        }
        window.location.href = "party.html?host=" + dest;
        var temp = firebaseRef.child(dest);
        currentRef = temp;
        localStorage.setItem("currentRef", currentRef);
        return false;
    }
});

var isHost = window.location.search.substring(6);

if (isHost == 'd74fdde2944f475adc4a85e349d4ee7b') {
    $('#skip-btn').show();
    $("#song-play").attr('controls', 'controls');
}

$('#join-btn').on('click', function() {
  if ($(".join-party").css('visibility') == 'hidden')
      $(".join-party").css('visibility', 'visible').focus();
  else
      $(".join-party").css('visibility', 'hidden');
    //window.location.href = "party.html";
    //return false;
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
        $(this).attr('src', newSong.url);
        $(".np-title").text(newSong.song);
        $(".np-img").attr('src', newSong.img)
    } else {
        playing = false;
    }
});

$('#skip-btn').on('click', function() {
    var newSong = songQueue.dequeue();
    $('#song-play').attr('src', newSong.url);
    $(".np-title").text(newSong.song);
    $(".np-img").attr('src', newSong.img)
});
