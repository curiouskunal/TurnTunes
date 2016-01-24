$("#join-btn").click(function() {




 if ( $(".join-input").css('visibility') == 'hidden' )
    $(".join-input").css('visibility','visible').focus();
  else
    $(".join-input").css('visibility','hidden');
});

$(".brand").click(function(){
  window.location.href =  "index.html";
})
$('.join-input').keypress(function (e) {
  if (e.which == 13) {
    dest = $('.join-input').val();
    window.location.href =  dest + ".html";
    return false;    
  }
});