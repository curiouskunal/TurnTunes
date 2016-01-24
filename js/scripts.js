var usersRef = new Firebase('https://dazzling-torch-8949.firebaseio.com/kokulsparty');

$("#join-btn").click(function() {
 $(".join-input").fadeToggle();
});

$('#host-btn').on('click', function() {
  var usersRef = new Firebase('https://dazzling-torch-8949.firebaseio.com/kokulsparty');
});

$('.join-input').bind("enterKey",function(e){
   var song = $(this).val();
  //  if (updateVotes(song)) {
  //    console.log("why am i here?");
     usersRef.push({
       'song': song,
       'votes': 1
     });
   //}
   $(this).val("");
});

$('.join-input').keyup(function(e){
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
