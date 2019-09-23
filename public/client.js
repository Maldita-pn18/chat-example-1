$(function () {
    var nickname = $('#nickname'); //user input nickname
    $('#logIn').click(function () {
        nickname = nickname.val();
        console.log(nickname);

        $('header').show();
        $('.container').show();
        $('center').hide();
        $('title').html(nickname);
        
        var socket = io();
        var users = []; //fixed list of users online 

        /*code block for getting online users*/
        socket.emit('online', nickname);

        socket.on('friends', function(onlFr){ //receiving array of online users from the server
            
            for(var i = 0; i < onlFr.length; i++){
                if(onlFr[i]!=nickname && !users.includes(onlFr[i])){ //check if the online users is not in the array above 
                    users.push(onlFr[i])
                    $('#onlines').append($('<li>').text(onlFr[i]) );
                }
            }
            window.scrollTo(0, document.body.scrollHeight);
        })
        /*end of getting online users*/
        
        $('#send').click(function(){
            socket.emit('chat message', { "message" : $('#groupmessage').val(), "sender" : nickname } );
            $('#groupmessage').val('');
        })

        //display typing status in the convo box
        socket.on('typing status', function(status){
            console.log(status.message)
            if(status.message.length === 0){
                $('#message').append($('<p>').addClass('status').text(status.sender+" is typing..."));
            }
            window.scrollTo(0, document.body.scrollHeight);
        });
        //typing status ends

        socket.on('chat message', function (msg) {
            console.log(msg);
            var messageCount = msg.count;
            console.log(messageCount);
            // var chatmessages = "";
            if(msg.sender == nickname){
                // chatmessages += msg.message;
                $('#message').append($('<div>').css({"width":"100%","float":"right"}).attr("id",messageCount.toString()))
                $('#'+messageCount).append($('<div>').css({"textAlign":"right","padding":"5px","overFlow":"auto","float":"right",
                "borderRadius":"15px","paddingRight":"20px","border":"1px solid black",
                "width":"50%","background":"#9fff80"}).html(msg.message));
            }else{
                // chatmessages += (msg.sender+" : "+msg.message)
                $('#message').append($('<div>').css({"width":"100%","float":"left"}).attr("id",messageCount.toString()))
                $('#'+messageCount).append($('<p>').css({"textAlign":"left","padding":"5px","overFlow":"auto","float":"left",
                "borderRadius":"15px","paddingLeft":"20px","border":"1px solid black","marginBottom":"0px",
                "width":"50%","backgroundColor":"white"}).text(msg.sender+" : "+msg.message));
            }
            $('.status').remove();
            window.scrollTo(0, document.body.scrollHeight);
        });

    })
});