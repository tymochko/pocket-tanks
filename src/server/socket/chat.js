let mongoose = require('mongoose');
const messageLimit = 5;

export function chat(client) {
	client.on('connection', function(socket) {
		let col = mongoose.connection.db.collection('messages');

		(col.find().sort({ $natural: -1 }).limit(messageLimit)).toArray(
			function(err, res) {
			    if( err )
			    	throw err;
			    socket.emit('outputMessage', res);
		});

		socket.on('inputMessage', insertData);

		function insertData(data){
			let name = data.name;
		    let message = data.message;
		    let time=data.time;

		    let whitespace = /^\s*$/;

		    if(!whitespace.test(name) || !whitespace.test(message))
		    {
		        col.insert(
		        	{
		        		name,
		        		message,
		        		time
		        	}, function() {
		            	client.emit('outputMessage', [ data ]);
		        });
		    }
		}
	});
}