var usersRef = new Firebase('https://dazzling-torch-8949.firebaseio.com/butter');
var songQueue = new Queue(); // The class was taken from this site http://code.stephenmorley.org/javascript/queues/

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

//Firebase data functions
usersRef.on('child_added', function(childSnapshot) {
  var song = toTitleCase(childSnapshot.val().song);
  var votes = childSnapshot.val().votes;
  songQueue.enqueue(song);
  var length = songQueue.getLength();
  if (length == 1) {
  	$("#empty-plist").hide();
  }
  $('.playlist').append('<li class="list-group-item"><span class="label label-default label-pill pull-xs-right">'+votes+'</span>'+song+'<i class="upvote fa fa-thumbs-up" align="right"></i</li>');
  
});

// Main Page UI functions
$("#join-btn").click(function() {




 if ( $(".join-input").css('visibility') == 'hidden' )
    $(".join-input").css('visibility','visible').focus();
  else
    $(".join-input").css('visibility','hidden');
});

$(".brand").click(function(){
  window.location.href =  "index.html";
});

$('.join-input').keypress(function (e) {
  if (e.which == 13) {
    dest = $('.join-input').val();
    window.location.href =  dest.toLowerCase() + ".html";
    return false;
  }
});

$('#host-btn').on('click', function() {
  usersRef.remove();
  window.location.href =  "butter.html"; //Hardcoded into butter for now
  return false;
});

//Playlist page UI functions
$('.add-input').bind("enterKey",function(e){
   var song = $(this).val().toLowerCase();
   usersRef.push({
     'song': song,
     'votes': 1
   });
   searchSongs(song);
   $(this).val("");
});

$('.add-input').keyup(function(e){
    if(e.keyCode == 13) {
        $(this).trigger("enterKey");
    }
});

// function updateVotes(curSong) {
//   var newSong = true;
//   usersRef.on("value", function(snapshot) {
//     snapshot.forEach(function(childSnapshot) {
//       var key = childSnapshot.key();
//       var childData = childSnapshot.val();
//       console.log(childData.song + " = " + curSong);
//       var num = parseInt(childData.votes) + 1;
//       console.log(childData.votes + " = " + num);
//       if (childData.song === curSong) {
//         console.log("Im in here!");
//         usersRef.child(key).set({
//           'song': childData.song,
//           'votes': parseInt(childData.votes) + 1
//         });
//         newSong = false;
//         return newSong;
//       }
//     });
//     if (!newSong) return newSong;
//   });
//   console.log("here?");
//   return newSong;
// }
