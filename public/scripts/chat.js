'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function () {
    var getNode = function getNode(s) {
        return document.querySelector(s);
    },


    //Get required nodes
    status = getNode('.chat-status span'),
        messages = getNode('.chat-messages'),
        textarea = getNode('.chat textarea'),
        chatName = getNode('.chat-name'),
        StatusDefault = status.textContent,
        setStatus = function setStatus(s) {
        status.textContent = s;

        if (s !== StatusDefault) {
            var delay = setTimeout(function () {
                setStatus(StatusDefault);
            }, 3000);
        }
    };

    try {
        var socket = io.connect('http://127.0.0.1:8080');
    } catch (e) {
        //set status to warn user
    }

    if (socket !== undefined) {
        //Lisen for output
        socket.on('output', function (data) {
            var date = new Date();
            if (data.length) {
                for (var x = 0; x < data.length; x = x + 1) {
                    var message = document.createElement('div');

                    //var img=document.createElement('img');
                    //img.src=replaceSmileys(data[x].message)
                    message.setAttribute('class', 'chat-message');
                    //message.appendChild('img');
                    //message.textContent = data[x].name + ': ';

                    message.innerHTML = '<p class="chat-name-message" style="display:inline">' + data[x].name + ' :  ' + replaceSmileys(data[x].message) + '</p>' + '<p class="chat-time">' + data[x].time + '</p>';

                    messages.appendChild(message);
                    messages.insertBefore(message, messages.firstChild);
                }
            }
        });

        //listen for s status
        socket.on('status', function (data) {
            setStatus((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' ? data.message : data);

            if (data.clear === true) {
                textarea.value = '';
            }
        });

        //Listen for keydown
        textarea.addEventListener('keydown', function (event) {
            var self = this,
                name = chatName.value;
            var date = new Date();

            if (event.which === 13 && event.shiftKey == false) {
                socket.emit('input', {
                    name: name,
                    message: self.value,
                    time: date.toUTCString()
                });

                event.preventDefault();
            }
        });
    }
})();