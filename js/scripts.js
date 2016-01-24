$("#join-btn").click(function() {
 $(".join-input").fadeToggle();
});

$('.join-input').keypress(function (e) {
  if (e.which == 13) {
    dest = $('.join-input').val();
    window.location.href =  dest + ".html";
    return false;    
  }
});