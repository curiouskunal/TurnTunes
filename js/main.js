/*******************************************************
  Globals
*******************************************************/
var firebaseRef = new Firebase('https://dazzling-torch-8949.firebaseio.com/');
var currentRef;

/*******************************************************
  Main Page UI
*******************************************************/
$("#host-btn").click(function() {
     $(".host-input").fadeToggle().focus();
});

$('.host-input').keypress(function(e) {
  var partyExists = false;

  if (e.which == 13) {
      dest = $('.host-input').val().replace(/[^a-zA-Z ]/g, "");
      console.log(dest);

      if (dest === ""){
        alert("Please specify a party name");
      }

      firebaseRef.once("value", function(snapshot) {
      // The callback function will only get called once since we return true
        snapshot.forEach(function(childSnapshot) {
          var key = childSnapshot.key();
          if (String(key) === dest){
            alert("This party name is taken");
            partyExists = true;
          }
        });

        if (!partyExists){
            window.location.href = "party.html?host=" + dest;
            var temp = firebaseRef.child(dest);
            currentRef = temp;
            currentRef.set ({
            });
            sessionStorage.setItem("currentRef", currentRef);
            sessionStorage.setItem("isHost", true);
            return false;
          };
      });
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
        sessionStorage.setItem("currentRef", currentRef);
        sessionStorage.setItem("isHost", false);
        return false;
    }
});

$('#join-btn').on('click', function() {
  $(".join-party").fadeToggle().focus();
});
