$(document).ready(() => {
  $('#message-form').submit(function(e) {
    var data = {mess: $('#input').val()};
    socket.emit('recieve', data.mess);
    $('#new-messages').prepend($('<li class="-new-message">').text(data.mess));
    $('#input').val('');
    e.preventDefault();
  });

  $('#AddConversationForm').submit(function(e) {
    var data = {id: $('#AddConversationInput').val()};
    $.post('/add', data, () => {});
    e.preventDefault();
  });

  $.get({
    url: '/conversations',
    data: {},
    success: (data) => {
      console.log(data);
      for (var i = 0; i < data.convos.length; i++) {
        $('#ConversationSelect').append($('<option value="'+i+'">').text(data.convos[i]));
      }
    }
  });
  $('#ConversationSelect').change(function(e) {
    $.post('/setconversation', {id: $('#ConversationSelect').val()}, () => {});
  });

  $('#AddConversationForm').submit(function(e) {
    var data = {id: $('#AddConversationInput').val()};
    e.preventDefault();
  });


  $.get('/recentlogs',{},data => {
    data.logs.forEach(msg => {
      $('#old-messages').append($('<li class="-old-message">').text(msg));
    });
    var box = document.getElementById("messages");
    $("#messages").scrollTop(box.scrollHeight-box.clientHeight);
  })

  socket.on('log', function(msg){
    $('#new-messages').prepend($('<li>').text(msg));
    var box = document.getElementById("messages");
    if ($("#messages").scrollTop() > box.scrollHeight-box.clientHeight-96) {
      $("#messages").scrollTop(box.scrollHeight-box.clientHeight);
    }
  });

  socket.on('profile', function(profile){
    $('.sidebar__name').text(profile.nickname);
    $('.sidebar__avatar').attr('src', 'images/avatar.png?timestamp=' + new Date().getTime());
  });
});
