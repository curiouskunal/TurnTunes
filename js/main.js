/*******************************************************
  Database & Host Name Functions
*******************************************************/
var firebaseRef = new Firebase('https://dazzling-torch-8949.firebaseio.com/');
var currentRef;

function RandomWord() {
    var requestStr = "http://randomword.setgetgo.com/get.php?len=4";

    $.ajax({
        type: "GET",
        url: requestStr,
        dataType: "jsonp",
        jsonpCallback: 'RandomWordComplete'
    });
}

function RandomWordComplete(data) {
    sessionStorage.setItem("hostName", data.Word.toLowerCase());
}

RandomWord();
/*******************************************************
  Party Name Functions
*******************************************************/
function verifyParty(party, host) {
  firebaseRef.once("value", function(snapshot) {
    var exists = snapshot.child(party).exists();
    //This is to check for party name if the user is hosting a party
    if (exists && host) {
      while (exists) {
        console.log("here: ", party);
        RandomWord();
        dest = sessionStorage.getItem("hostName");
        exists = snapshot.child(dest).exists();
      }
      verifyParty(dest, host);
    } else if (host) {
      loadParty(party, host);
    }
    //This is to validate the join party name, so users only join existing party
    if (exists && !host) {
      loadParty(party, host);
    } else if (!host) {
      alert('Party does not exist');
      $('.join-input').val("");
    }
  });
}

function loadParty(party, host) {
  var temp = firebaseRef.child(dest);
  currentRef = temp;
  sessionStorage.setItem("currentRef", currentRef);
  sessionStorage.setItem("isHost", host);
  window.open("party.html?id=" + party,"_self");
}

/*******************************************************
  Main Page UI
*******************************************************/
$("#host-btn").click(function () {
  dest = sessionStorage.getItem("hostName");
  verifyParty(dest, 1);
});

$('.join-input').keypress(function (e) {
    if (e.which == 13) {
        dest = $('.join-input').val().toLowerCase();
        if (dest == "") {
            alert("Please specify a party name");
        } else {
          verifyParty(dest, 0);
        }
    }
});

$('#join-btn').on('click', function () {
  if ($(".join-input").css('visibility') == 'hidden')
       $(".join-input").css('visibility', 'visible').focus();
   else
       $(".join-input").css('visibility', 'hidden');

});
