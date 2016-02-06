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
  Main Page UI
*******************************************************/
$("#host-btn").click(function () {
    var partyExists = false;
    dest = sessionStorage.getItem("hostName");
    firebaseRef.once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var key = childSnapshot.key();
            if (String(key) === dest) {
                RandomWord();
                partyExists = true;
            }
        });

        if (!partyExists) {
            window.location.href = "party.html?id=" + dest;
            var temp = firebaseRef.child(dest);
            currentRef = temp;
            currentRef.set({});
            sessionStorage.setItem("currentRef", currentRef);
            sessionStorage.setItem("isHost", 1);
            return false;
        };
    });

});

$('.join-input').keypress(function (e) {
    if (e.which == 13) {
        dest = $('.join-input').val();
        if (dest == "") {
            alert("Please specify a party name");
        }
        window.location.href = "party.html?id=" + dest;
        var temp = firebaseRef.child(dest);
        currentRef = temp;
        sessionStorage.setItem("currentRef", currentRef);
        sessionStorage.setItem("isHost", 0);
        return false;
    }
});

$('#join-btn').on('click', function () {
  if ($(".join-input").css('visibility') == 'hidden')
       $(".join-input").css('visibility', 'visible').focus();
   else
       $(".join-input").css('visibility', 'hidden');

});
