$(function () {
    var nickname = $('#nickname'); //user input nickname
    $('#logIn').click(function () {
        nickname = nickname.val();

        $('header').show();
        $('.container').show();
        $('center').hide();
        $('title').html(nickname);
        
        var socket = io();
        var users = []; //fixed list of users online 
        var onlineCount = 0;

        /*code block for getting online users*/
        socket.emit('online', nickname);

        socket.on('friends', function(onlFr){ //receiving array of online users from the server
            
            for(var i = 0; i < onlFr.length; i++){
                if(onlFr[i]!=nickname && !users.includes(onlFr[i])){ //check if the online users is not in the array above 
                    users.push(onlFr[i]);
                    ++onlineCount;
                    $('#onlines').append($('<div>').css({"width":"100%",'textAlign':'left',
                    'marginBottom':'-1px','height':'24px','borderTop':'1px solid gray',
                    'borderBottom':'1px solid gray'}).attr('id',onlineCount));
                    $('#'+onlineCount).on('mouseover',function(){
                        $(this).css({'backgroundColor':'#e6e6e6'});
                    });
                    $('#'+onlineCount).on('mouseout',function(){
                        $(this).css({'backgroundColor':'white'});
                    });

                    $('#'+onlineCount).append($('<p>').css({'color':'green',
                    'marginRight':'10px','marginLeft':'10px','fontWeight':'bold'}).text('•'));

                    $('#'+onlineCount).append($('<p>').css({"marginTop":"-40px","marginLeft":"20px"}).text(onlFr[i]));
                }
            }
            window.scrollTo(0, document.body.scrollHeight);
        })
        $('#groupmessage').on('keypress', function(){
            socket.emit('typing',{'sender':nickname,'message':$('#groupmessage').val()});
        });
        /*end of getting online users*/
        
        $('#send').click(function(){
            socket.emit('chat message', { "message" : $('#groupmessage').val(), "sender" : nickname } );
            $('#groupmessage').val('');
        })

        //display typing status in the convo box
        socket.on('typing status', function(status){
            if(status.message.length === 0){
                $('#message').append($('<p>').addClass('status').text(status.sender+" is typing..."));
            }
            window.scrollTo(0, document.body.scrollHeight);
        });
        //typing status ends

        socket.on('chat message', function (msg) {
            var messageCount = msg.count;
            // var chatmessages = "";
            if(msg.sender == nickname && msg.message !== ""){
                // chatmessages += msg.message;
                console.log(msg.message.substring())
                $('#message').append($('<div>').css({"width":"100%","float":"right"}).attr("id",messageCount.toString()))
                $('#'+messageCount).append($('<div>').css({"textAlign":"right","padding":"5px","overFlow":"auto","float":"right",
                "borderRadius":"15px","paddingRight":"20px","border":"1px solid black",
                "width":"50%","background":"#9fff80"}).html(msg.message));
            }else if(msg.message !== ""){
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