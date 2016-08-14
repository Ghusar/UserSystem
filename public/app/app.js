var app = angular.module('mainApp',['ngRoute']).run(function($rootScope,$http,$location){
	$rootScope.current=null;
	$rootScope.authen = false;
	$rootScope.msg = [];
	socket = io();
});

app.config(function($routeProvider){
	$routeProvider
	.when('/login',{
		controller:'loginController',
		templateUrl:'../../views/login.html'
	})
	.when('/submit',{
		controller:'submitController',
		templateUrl:'../../views/submit.html'
	})
	.when('/home',{
		//controller:'mainController',
		templateUrl:'../../views/home.html'
	})
	.when('/about',{
		//controller:'mainController',
		templateUrl:'../../views/about.html'
	})
	.when('/chat',{
		controller:'chatController',
		templateUrl:'../../views/chat.html'
	})
	.otherwise({redirectTo:'/home'});
});

app.controller('chatController',function($scope,$location,$rootScope){
	//$scope.apply();
	$scope.er = '';
	$scope.class = '';
		if($rootScope.current){
			
			socket.emit('new uservalue',$rootScope.current);
		}
		//$scope.$apply();

	//$scope.privateChat = function(username){
		//socket.emit('private chat',{msg:$scope.pmsg,user:username});
	//}

	$scope.send=function(){
		if($scope.usermessage!='')
		socket.emit('send message',$scope.usermessage);
		$scope.usermessage = '';
		//$scope.$apply();
	}

	socket.on('new message',function(data){
		console.log(data);
		$rootScope.msg.push(data);
		/*$(function(){
			if(data.user == $rootScope.current_user)
			$('#chatWindow').append('<div  class="float-left" id="chatname">'+data.user+'</div><div id="message" class = "left float-left">'+data.message+'</div>');
			else
			$('#chatWindow').append('<div id="message" class = "right float-right">'+data.message+'</div><div id="chatname" class="float-right">'+data.user+'</div>');				
		})*/

		
			var chatwindow = $('#chatWindow');
			var height = chatWindow.scrollHeight;
			chatWindow.scrollTop(height);
	});

	socket.on('users',function(data){
		$scope.usersOnline = data;
	});

	$scope.$on('$destroy',function(){
		socket.removeListener();
	});
	
});

app.controller('submitController',function($http,$scope,$location,$rootScope){

	$scope.err = '';
	$scope.clear = function(){
		$scope.err = '';
		$scope.class = '';
	}
	$scope.submitForm = function(){
			var user={
		username: $scope.username,
		password: $scope.password
	};
	
//console.log(user.username);
		if($scope.password!=$scope.password2){
			$scope.err = "your passwords dont match";
			$scope.class='alert alert-danger';
			$scope.password2='';
		}
		else{
		$http.post("/submit",user).success(function(data){
			console.log(data);
			if(data.user){
				$rootScope.authen = true;
				$rootScope.current = data.user;
				$location.path('/home');
			}
			else
			{
				$scope.class='alert alert-danger';
				$scope.err = data.message;
			}
		},function(data){
			console.log("failed");
		});
	}
		//$location.path('/list');
	}	
});


app.controller('loginController',function($http,$scope,$rootScope,$location){
	$scope.clear = function(){
		$scope.err = '';
		$scope.class = '';
	}

	$scope.submitForm = function(){
		var user={
		username: $scope.username,
		password: $scope.password
	};
	
//console.log(user.username);
		$http.post("/login",user).success(function(data){
			console.log(data);
			if(data.user){
				$rootScope.authen = true;
				$rootScope.current = data.user;
				$location.path('/home');
			}
			else{
				$scope.err = data.message;
				$scope.class='alert alert-danger';
				$scope.password='';
			}
		});
		
	}
	$scope.logout = function(){
		socket.emit('disconnect');
		$location.path('/login');
		$rootScope.authen = false;
		$rootScope.current = null ;	
	}	

	
});