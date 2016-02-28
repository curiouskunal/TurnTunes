var url = window.location.href;
var title = document.title;
var text = "Come vibe with me."

$('.fb').click(function() {
    window.open('http://www.facebook.com/sharer/sharer.php?u=' + url + '&title=' + title, 'yourWindowName', 'width=600,height=300');
});

$('.tweet').click(function() {
    window.open('http://twitter.com/intent/tweet?status=' + text + '+' + url, 'yourWindowName', 'width=600,height=250');
});

$('i.copy').tooltip();

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
