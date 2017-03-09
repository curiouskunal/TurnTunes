/*******************************************************
 Globals
 *******************************************************/
var songQueue;
songQueue = new Queue();
var songCount = 1;
var playing = false;
var id = String(window.location.search.split("id=")[1]).toLowerCase();// Room ID
var isHost = parseInt(sessionStorage.getItem("isHost"));              // Type: int with val of 1 or  0
var partyName = partyExists(id, isHost);                              // sets partyName if ID is a valid RoomID 
var url = "https://dazzling-torch-8949.firebaseio.com/" + partyName;  // Database URL
var nowPlayingRef = new Firebase(url + "/now-playing");               // Reference to now playing in Database
var currentRef = new Firebase(url + "/playlist");                     // Reference to current room
var usersRef = new Firebase(url + "/users");                          // reference to list of users in room
var curSong = 0;                                                      // current song reference in playlist

document.title = 'TurnTunes';          // HTML page tile
$('.partyNameText').append(partyName); // adds room ID to party.HTML page 

/*******************************************************
  Party Authentication
********************************************************/

// This function checks if the the room ID exists
function partyExists(party, host) {
  var firebaseRef = new Firebase("https://dazzling-torch-8949.firebaseio.com/"); // create new database at the url
  
  // get instantaneous view of current database using asynchronous data base "wait"
  firebaseRef.once("value", function(snapshot) { 
    var exists = snapshot.child(party).exists(); // if the roomID exists returns 1
                                                                                  
    if (!exists && !host) { //if party name doesn't exist AND you aren't the host
      alert("Party does not exist. You will be redirected to the homepage.");
      window.open("index.html", "_self"); // break to homepage
    }
  });
  return party;
}


/*******************************************************
  Firebase Data Changes
*******************************************************/
// This function will be called every time theres a song chosen
// it will: add to the playlist , incrementing the song count
//          hide or show skip song button according to playlist length
currentRef.on('child_added', function (childSnapshot) {
    var key = childSnapshot.key();            // snapshot key
    var song = childSnapshot.val().song;      // stores value of the newly added song

    var song_id = childSnapshot.val().song_id;// data base id of the newly added song
    
    songQueue.enqueue(childSnapshot.val());   // adds the newly added song to the playlist queue
    
    var length = songQueue.getLength(); //song queue length

    // if the queue has songs in it, hide "add songs to playlist" message
    if (length) { 
      $("#empty-plist").addClass('hide'); // hides HTML id by using hide class's CSS style
    }

    //To apply the border-color when songs are added during edge cases
    var isPlaying = "";
    if (curSong === 0)
      isPlaying = "current-s ong";
    else if (curSong === songCount - 1)
      isPlaying = "next-song";
    else if (!isHost && songCount === curSong)
      isPlaying = "current-song";

    // Adding song name and number to the playlist on the party HTML page 
    $('.playlist').prepend('<li class="list-group-item ' + isPlaying + '" id="song-' + songCount + '"><span class="label label-default label-pill pull-xs-right">' + songCount + '</span>' + song + '</li>');

    // start playing the added song if queue has 1 song and you are the host 
    if (length == 1 && isHost) {
        // if there is no song playing, play song
        if (!($('#song-play').attr('src')) || !playing) {
            playing = true;                   // start playing song
            var newSong = songQueue.dequeue();// remove the song from playlist queue once started playing
            pushNowPlaying(newSong);          // set newSong as the "Now Playing" song
        // when playing last song in queue hide skip button
        } else if (playing) {
          $('#skip-btn').removeClass('hide'); // hides HTML id by using hide class's CSS style 
        }
    // when playlist queue length is 2    
    } else if (length == 2) {
      $('#skip-btn').removeClass('hide'); // Shows skip button when queue length is greater than two
    }
    songCount++;
});

// get instantaneous view of current playlist database using asynchronous data base "wait"
nowPlayingRef.on("value", function (snapshot) {
    var newSong = snapshot.val();
    if (newSong != null) {
        $('#song-play').attr('src', newSong.url);     // set song url to party.html HTML ID
        $(".np-title").text(newSong.song);            // set song tile to party.html HTML class
        $(".np-img").attr('src', newSong.img);        // set song artwork to party.html HTML class
        changeCurrentSong(newSong);                   // set current song to new song
        curSong = newSong.song_id;                    // store new song's ID to global var
        document.title = newSong.song + ' - TurnTunes'// set HTML tile to song name
    }
}, function (errorObject) {}); // data base write / read error handing 

/*******************************************************
  User Functions
*******************************************************/
// when user database changes (connect / disconnect)
usersRef.on("value", function (snapshot) {
  var count = snapshot.val();
  $('.userCountText').text(count); // update the class for number of connected users on party.html
});

// increment number of users on database by 1
function addUser() {
  usersRef.transaction(function (current_value) {
  return (current_value || 0) + 1;
  });
}
// decrement number of users on database by 1
function removeUser() {
  usersRef.transaction(function (current_value) {
  return (current_value || 0) - 1;
  });
}

/*******************************************************
  Party UI Changes
*******************************************************/
// changing class CSS based on song position in song queue
function changeCurrentSong(song) {
  var oldId = curSong + 1;
  $('#song-' + oldId).removeClass('next-song');
  $('#song-' + curSong).removeClass('current-song');
  $('#song-' + song.song_id).addClass('current-song');
  $('.current-song').removeClass('next-song');
  $('.current-song').prev('li').addClass('next-song');
}

/*******************************************************
  Party UI
*******************************************************/
// When document has fully loaded
$(document).ready(function() {
  
  addUser();

  var url = window.location.href;// store browser url
  var title = document.title;    // store current page title
  var text = "Come vibe with me."// social media post message

  // When Facebook icon is clicked
  $('.fb').click(function() {
      // open Facebook share dialog box in new window
      window.open('http://www.facebook.com/sharer/sharer.php?u=' + url + '&title=' + title, 'yourWindowName', 'width=600,height=300');
  });

  // when Twitter icon is clicked
  $('.tweet').click(function() {
    // open Twitter share dialog box in new window
      window.open('http://twitter.com/intent/tweet?status=' + text + '+' + url, 'yourWindowName', 'width=600,height=250');
  });

  $('i.copy').tooltip(); // initializes i.copy as a tooltip

  // copy browser url to clipboard when clicked using tooltip
  $('.url-share-button').on('click', function() {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val("http://turntunes.com/party.html?id=" + partyName).select();
    document.execCommand("copy");
    $temp.remove();
    $('i.copy').attr('title', 'Link Copied!').tooltip('fixTitle').tooltip('show');
    setTimeout(function() {
        $('i.copy').attr('title', 'Copy Link').tooltip('fixTitle').tooltip();
    }, 500);
  });

  // if you are the host add media controls attributes to HTML ID
  if (isHost == 1) {
    $("#song-play").attr('controls', 'controls');
  } else {
    // removes skip button if not host
    $('#skip-btn').remove();
  }
});

// when disconnect 
window.onunload = function(){
  removeUser();
  sessionStorage.clear();
};

// open homepage when click on the header logo
$(".brand").click(function () {
    window.open("index.html", "_self");
});

// when enter is pressed when in search bar
$('.search-input').bind("enterKey", function (e) {
    var song = $(this).val().toLowerCase(); // set input to all lowercase
    if (song != "") {
        searchSC(song); // search for song on SoundCloud database if non blank
        $(this).val("");// reset search to empty string
    }//
    $('.search-result').remove(); // hide search results drop down menu
});

// when click is pressed on search bar
$("#search-btn").on('click', function () {
    var song = $('.search-input').val().toLowerCase(); // set to lowercase
    if (song != "") {
        searchSC(song);            // search for song on SoundCloud Database if input is not empty
        $('.search-input').val("");// reset search to empty string
    }
    $('.search-result').remove(); // hide search results drop down menu
});

//  when no keys are pressed in search bar
$('.search-input').keyup(function (e) {
    var inp = String.fromCharCode(event.keyCode);
    // if enter is pressed
    if (e.keyCode == 13) {
        $(this).trigger("enterKey");
    // if input only contains valid characters
    } else if (/[a-zA-Z0-9- ]/.test(inp) || event.keyCode == 8) { 
      var song = $(this).val().toLowerCase(); // set to lowercase
      if (song != "")
        searchSC(song); // search for song on SoundCloud Database if input is not empty
    }
});

// when any key is pressed hide search results drop down menu
$('.search-input').keydown(function (e) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9- ]/.test(inp) || event.keyCode == 8) {
      $('.search-result').remove(); 
    }
});

// When the song ends playing
$('#song-play').on('ended', function () {
    //Hide the currently playing color scheme
    var songId = songCount - 1;
    $('#song-' + songId).removeClass('current-song');
    if (songQueue.peek()) {
        var newSong = songQueue.dequeue();
        if (isHost) {
            pushNowPlaying(newSong);
        }
        // if there are songs in the song queue hide HTML id by using hide class's CSS style 
        if (!songQueue.getLength()) {
          $('#skip-btn').addClass('hide');
        }
    } else {
        playing = false; // stop playing music
    }
});


// plays next song when "skip song" is clicked , if queue size is 1 then hide skip button
$('#skip-btn').on('click', function () {
    var newSong = songQueue.dequeue(); // sets new song to next queue item
    
    // if there are songs in the song queue hide HTML id by using hide class's CSS style 
    if (!songQueue.getLength()) {
      $('#skip-btn').addClass('hide'); 
    }
    pushNowPlaying(newSong); // plays next song 
});

// clear the search bar and hide the search results when escape key is pressed or you click anywhere else on the page
$('body').on('click keyup', function(e) { 
  if (e.type === "click" || e.keyCode == 27) { 
    $('.search-input').val("");
    $('.search-result').remove();
  }
});
