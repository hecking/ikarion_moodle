/*
var display;

function SocketIOFeedback(){
	 display = this.displayFee  dback;
}

SocketIOFeedback.prototype.connect = function(address, clientID){
	var socket = io.connect(address);
	
	socket.on(clientID.toString(), function (msg) {
	      display(msg);
	});

}     

SocketIOFeedback.prototype.displayFeedback = function(feedback){
	console.log(feedback);
    window.alert(feedback);
}
*/



var SocketIOFeedback = (function(){

	var SocketIOFeedback = function(){
	};

 	function connect(address, clientID){
		var socket = io.connect(address);
		
		socket.on(clientID.toString(), function (msg) {
		      displayFeedback(msg);
		});
	}     

	function displayFeedback(feedback){
		console.log(feedback);
	    window.alert(JSON.stringify(feedback));
	}

	SocketIOFeedback.prototype = {
        constructor: SocketIOFeedback,
        connect: connect
    };

	return SocketIOFeedback;	

})();


/*
var SocketIOFeedback = (function(){

	function connect(address, clientID){
		var socket = io.connect(address);
		
		socket.on(clientID.toString(), function (msg) {
		      displayFeedback(msg);
		});
	} 

	function displayFeedback(feedback){
		console.log(feedback);
	    window.alert(feedback);
	}

	return{
		connect:connect
	};
})();
*/

/*
var SocketIOFeedback = function(){

	function connect(address, clientID){
		var socket = io.connect(address);
		
		socket.on(clientID.toString(), function (msg) {
		      displayFeedback(msg);
		});
	} 

	function displayFeedback(feedback){
		console.log(feedback);
	    window.alert(feedback);
	}

	return{
		connect:connect
	};
}();
*/