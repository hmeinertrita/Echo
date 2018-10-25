var count = [0,0,0,0];
const socket = io();
$(document).ready(()=> {
  var input = $('#input');

  input.on('keyup', function(event){
    var keycode = (event.originalEvent.keyCode ? event.originalEvent.keyCode : event.originalEvent.which);

    //const index = keycode%4; //vertex depends on key pressed
    const index = Math.floor(Math.random()*4); //random vertex
    const minBump = 20;
    const multiplier = 0.5;
    const splashMultiplier = 1/3;
    const bump = keycode*multiplier > minBump ? keycode*multiplier : minBump;

    count[index] += bump;
    for (var i=0; i<4; i++) {
      if(i !== index) {
        count[i] += bump * splashMultiplier;
      }
    }
  });

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
    $('.sidebar__avatar').attr('src', 'images/'+profile.avatar);
  });
});

function update() {
  window.requestAnimationFrame(update);
  for (var i = 0; i < 4; i++) {
    updateVertex(count[i], i);
    if (count[i] > 0) {
      var div = 20;
      var sub = count[i]/div>1 ? count[i]/div : 1;
      count[i]-=sub;
    }
    else if (count[i] < 0) {
      count[i]=0;
    }
  }
}

update();
