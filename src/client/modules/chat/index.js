var angular = require('angular');
var ngRoute = require('angular-route');

module.exports = angular.module('tanks.chat', [
    ngRoute
]).config(RouteConfig);

RouteConfig.$inject = ['$routeProvider'];
function RouteConfig($routeProvider) {
    $routeProvider.when('/chat', {
        controller: ChatController,
        templateUrl: 'chat/chat.html'
    });
};

function ChatController($scope,socket, $sce) {
	$scope.nam=[];
	$scope.mes=[];
	$scope.messageStatus='Ide';
	$scope.inputMessage='';
	$scope.inputName='';
	status=$scope.messageStatus;
	StatusDefault = status;

	setStatus= function(s){
		$scope.messageStatus = s;
		if(s!== StatusDefault)
		{
			var delay = setTimeout(function(){
				setStatus(StatusDefault);
			},3000);
		}
	};

	if(socket !== undefined)
	{
		socket.on('output', function(data){
			var date=new Date();
			if(data.length)
			{
				$scope.sce=$sce;
				for(var x=data.length-1;x>=0; x=x-1){
					$scope.$apply(function () {
						$scope.myHTML += '<div class="chat-message">'+'<p class="chat-name-message" >'+data[x].name+'</p>'+' : '+replaceSmileys(data[x].message)+'<p class="chat-time">'+data[x].time+'</p>'+'</div>';});
				}
				$(document.getElementById('chat')).animate({scrollTop: 1000}, 500);
			}
		});

		socket.on('status',function(data){
			setStatus((typeof data === 'object')? data.message: data);

			if(data.clear === true )
			{
                     $scope.inputMessage = '';
                }
            });

			$scope.myFunc=function(event){
				var inputMessage = $scope.inputMessage,
				name = $scope.inputName;
				var date=new Date();

				socket.emit('input',{
					name: name,
					message:inputMessage,
					time: date.toUTCString()
				});

				$scope.inputMessage='';

				event.preventDefault();
		};
	}
    console.log("required chat!");
}

