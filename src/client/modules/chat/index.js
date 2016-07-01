var angular = require('angular');
var ngRoute = require('angular-route');
var $ = require('jquery');
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
}



function str_replace(search, replace, subject) {
	return subject.split(search).join(replace);
} 

var replaceSmileys=function(text) {
	function sm(codes, img_name) { 
		function rsm(from, to) {
			path = "public/images/smileys/";
				text = str_replace(from, '<img class="smiley" src="'+path + to + '" />', text);
		}
		codes = codes.split(',');
		for(index in codes) {
			rsm(codes[index], img_name);
		}
	}
	
		sm('O:-),O=)', 'aa.gif');
          sm(':-),:),=)', 'ab.gif');
          sm(':-(,:(,;(', 'ac.gif');
          sm(';),;-)', 'glad.gif');
          sm(':-P,:P', 'ae.gif');
          sm('8-),8)', 'af.gif');
          sm(':-D,:D', 'ag.gif');
          sm(':-[', 'ah.gif');
          sm('=-O', 'ai.gif');
          sm(':-*,:*', 'aj.gif');
          sm(":\'(,:\'-(", 'ak.gif');
          sm(':-X,:-x', 'al.gif');
          sm('>:o', 'am.gif');
          sm(':-|', 'an.gif');
          sm(':-\\,:-/,:/,:\\', 'ao.gif');
          sm('*JOKINGLY*', 'ap.gif');
          sm(']:->', 'aq.gif');
          sm('[:-}', 'ar.gif');
          sm('*KISSED*', 'as.gif');
          sm(':-!', 'at.gif');
          sm('*TIRED*', 'au.gif');
          sm('*STOP*', 'av.gif');
          sm('*KISSING*', 'aw.gif');
          sm('@}->--', 'ax.gif');
          sm('*THUMBS UP*', 'ay.gif');
          sm('*DRINK*', 'az.gif');
          sm('*IN LOVE*', 'ba.gif');
          sm('@=', 'bb.gif');
          sm('*HELP*', 'bc.gif');
          sm("\\m/", 'bd.gif');
          sm('%)', 'be.gif');
          sm('*OK*', 'bf.gif');
          sm('*WASSUP*,*SUP*', 'bg.gif');
          sm('*SORRY*', 'bh.gif');
          sm('*BRAVO*', 'bi.gif');
          sm('*ROFL*,*LOL*', 'bj.gif');
          sm('*PARDON*', 'bk.gif');
          sm('*NO*', 'bl.gif');
          sm('*CRAZY*', 'bm.gif');
          sm('*DONT_KNOW*,*UNKNOWN*', 'bn.gif');
          sm('*DANCE*', 'bo.gif');
          sm('*YAHOO*,*YAHOO!*', 'bp.gif');
          sm('*sex*, *SEKS*', 'bs.gif');
          sm('*narkoman*', 'bs1.gif');
          sm('*eye_blue*', 'bs2.gif');
          sm('*crazy_girl*', 'bs3.gif');
          sm('*sorry_girl*', 'bs4.gif');
          sm('*sad_girl*', 'bs5.gif');
          sm('*s_girl*', 'bs6.gif');
          sm('*list*', 'bs7.gif');
          sm('*slip*', 'bs8.gif');
          sm('*bos*', 'bs9.gif');
          sm('*oxotnik*', 'bt.gif');
          sm('*elf*', 'bt2.gif');
          sm('*goblin*', 'bt3.gif');
          sm('*angry*', 'bt4.gif');
          sm('*angry_fuck*', 'bt5.gif');
          sm('*devil_girl*', 'bt6.gif');
          sm('*read*', 'bt7.gif');
          sm('*lol2*', 'bt8.gif');
          sm('*men_girl*', 'bt9.gif');
          sm('*dance_happy*', 'bw.gif');
          sm('*FUCK*', 'bw2.gif');
          sm('*alkoholik*', 'ca.gif');
          sm('*poveshen*', 'ca1.gif');
          sm('*jarko*', 'ca2.gif');
          sm('*lol_stena*', 'ca3.gif');
          sm('*lol_stena2*', 'ca4.gif');
          sm('*kills*', 'ca5.gif');
          sm('*crazy2*', 'ca6.gif');
          sm('*holliday*', 'ca7.gif');
          sm('*very_sad*', 'ca8.gif');
          sm('*popkorm*', 'ca9.gif');
          sm('*tormoz*', 'cb.gif');
          sm('*tomato*', 'cb1.gif');
          sm('*chay*', 'cb2.gif');
          sm('*haha*,*rolf*', 'cb3.gif');
          sm('*haha_lol*', 'cb4.gif');
          sm('*angry_lol*', 'cb5.gif');
          sm('*coffee*', 'cb6.gif');
          sm('*cry_girl*', 'cb7.gif');
          sm('*girl_O_o*', 'cb8.gif');
          sm('*JOKINGLY_girl*', 'cb9.gif');
          sm('*love_comp*', 'cc.gif');
          sm('*friends*', 'cc1.gif');
          sm('*girl_haha*', 'cc2.gif');
          sm('*happy_men_girl*', 'cc3.gif');
          sm('*kiss_man_girl*', 'cc4.gif');
          sm('*man_girl_haha*', 'cc5.gif');
          sm('*kiss_loves*', 'cc6.gif');
          sm('*loves_loves*', 'cc7.gif');
          sm('*dance_disk*', 'cc8.gif');
          sm('*ban_crazy*', 'cc9.gif');
          sm('*cry_man*', 'cd.gif');
          sm('*orc*', 'cd1.gif');
          sm('*idi_nak*', 'cd2.gif');
          sm('*???*', 'cd3.gif');
          sm('*!!!*', 'cd4.gif');
          sm('-_-', 'D83DDE11.png');
          sm(':|', 'D83DDE10.png');

	return text;
}