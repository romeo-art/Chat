
var myname = "";
var id = "";
var socket = io();
var typing = 0;
var typingpm = 0;
var stilltying= false;
var listOfUsers = [];
var typer = "";
var firsttyper = true;
var conversations = [];
var typingtext = " is typing...";
var mesId = 0;



$(document).ready(function() {

  var socket = io();
    $('#inputName').submit(function(){
      for (var i=0;i<10;++i) {
        id += (Math.floor((Math.random() * 9) + 0)).toString();
      }
     

      socket.on('user login', function(msg){
        if (!listOfUsers.includes(msg.name+": "+msg.id) && msg.id!=id) {
          listOfUsers.push(msg.name+": "+msg.id);
          $('#onlineUsers').append("<div class='otherUser' id='"+msg.id+msg.name+"'><h3 id='User'>"+msg.name+ "</h3></div>");
          socket.emit('user login', {id:id,name:myname});
        }
      });


      socket.on('private message', function(msg) {
        if (msg.receipient==myname+id) {
          if (!conversations.includes(msg.name+msg.id)) {
            conversations.push(msg.name+msg.id);
            privateChat(msg.name+msg.id, msg.name, msg.message);
          } else {
            $("#"+msg.name+msg.id).find("#typingpm").remove();
            $("#"+msg.name+msg.id).find("#pm").append("<div class='pmdivh'><div class='pmdiv' id='ntm'><p id='PM'><b>"+msg.name+"</b>: "+msg.message+"</p></div></div>");
            $("#"+msg.name+msg.id).show();
          }
        } else if (msg.name+msg.id == myname+id) {
          $("#"+msg.receipient).find("#pm").append("<div class='pmdivh'><div class='pmdiv' id='mm'><p id='PM'><b>Me</b>: "+msg.message+"</p></div></div>");
        }
      });




      socket.on('logout', function(msg) {
        $("#"+msg.id+msg.name).find("#User").css({"color":"lightgrey"});
        $("#"+msg.id+msg.name).find("#User").text(msg.name+" left!");
        setInterval(function(){ $("#"+msg.id+msg.name).remove(); }, 3000);
        if (msg.id == id && msg.name == myname) {
          location.reload();
        }
      });


      socket.on('chat message', function(msg){
        $("#messagesHolder").scrollTop($("#messagesHolder")[0].scrollHeight);
        if (msg.id == id && msg.name == myname) {
          publicChat('myMess', "<b>Me</b>: "+msg.message);
        } else {
          typer = "";
          firsttyper = true;
          typingtext = " is typing...";
          $("#typing").remove();
          publicChat('othersMess', "<b>"+msg.name+"</b>: "+msg.message);
        }
      });

      myname = $("#username").val().split(" ").join("_");
      if (!myname.includes(": ")) { 
        $(".myname").text(myname);
        socket.emit('user login', {id: id, name: myname});
        $("#title").text(myname);
        $("#inputName").hide();
        $(".container").show();
      } else {
        alert("Invalid username!");
      }
      return false;
    });
    
      $('#chatbox').submit(function(e){
        e.preventDefault();
        if ($('#m').val() != "") {
          socket.emit('chat message', {id:id,name: myname,message: $('#m').val()});
          $('#m').val('');
        }
      });        
});





$(document).ready(function() {
  $("#logout").click(function() {
    socket.emit('logout',  {id:id,name:myname});
  });
});

$(window).unload(function(){
  socket.emit('logout', {id:id,name:myname});
});

$(window).on('beforeunload', function(){
  socket.emit('logout', {id:id,name:myname});
});
 
 function publicChat(divType,message) {
   $('#messages').append("<div id='mesDivHolder'><div class='newMes' id='"+divType+"'><h5 id='me'>"+message + "</h5></div><div>");
 }
