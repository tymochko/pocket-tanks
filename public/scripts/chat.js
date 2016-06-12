 (function(){
        var host=Config.host;
        var port=Config.port;

        var getNode = function(s){
            return document.querySelector(s);
 
        },
 
        status = getNode('.chat-status span'),
        messages = getNode('.chat-messages'),
        textarea = getNode('.chat textarea'),
        chatName = getNode('.chat-name'),
 
        StatusDefault = status.textContent,
 
        setStatus= function(s){
            status.textContent = s;
            if(s!== StatusDefault)
            {
                var delay = setTimeout(function(){
                    setStatus(StatusDefault);
                },3000);
            }
        };
 
        var socket = io.connect(host+':'+port);

        if(socket !== undefined)
        {
            socket.on('output', function(data){
               var date=new Date();
               if(data.length)
               {
                for(var x=data.length-1;x>=0; x=x-1)
                {
                    var message = document.createElement('div');
                    var message_name=document.createElement('p');
                    var message_time=document.createElement('p');
                    message.setAttribute('class','chat-message');
                    message_name.setAttribute('class','chat-name-message');
                    message_time.setAttribute('class','chat-time');
                    message_name.innerHTML=data[x].name + ' :  '+replaceSmileys(data[x].message);
                    message_time.textContent=data[x].time;
                    message.setAttribute('style', 'float: right')
                    message.appendChild(message_name);
                    message.appendChild(message_time);
                    messages.appendChild(message);
                    messages.insertBefore(message, messages.lastChild);
                   $(messages).animate({scrollTop: 10000},'slow');
                }
 
               }
            });
 
            socket.on('status',function(data){
                setStatus((typeof data === 'object')? data.message: data);

                if(data.clear === true )
                {
                    textarea.value = '';
                }
            });
 
            textarea.addEventListener('keydown', function(event){
                var self = this,
                name = chatName.value;
                var date=new Date();
 
                if(event.which === 13 && event.shiftKey == false)
                {
                    socket.emit('input',{
                        name: name,
                        message:self.value,
                        time: date.toUTCString()
                    });
 
                    event.preventDefault();
                }
            });      
        }   
})();