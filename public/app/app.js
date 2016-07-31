var app = angular.module('mainApp',['ngRoute']).run(function($rootScope,$http,$location){
	$rootScope.current_user ;
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
	$scope.gochat = function(){
		if($scope.user){
			
			socket.emit('new uservalue',$scope.user,function(data){
				if(data){
					$rootScope.current_user = $scope.user;
				}
			});
		}
	};

	$scope.send=function(){
		socket.emit('send message',$scope.usermessage);
		$scope.usermessage = '';
	}

	socket.on('new message',function(data){
		console.log(data);
		$(function(){
			if(data.user == $rootScope.current_user)
			$('#chatWindow').append('<div  class="float-left" id="chatname">'+data.user+'</div><div id="message" class = "left float-left">'+data.message+'</div>');
			else
			$('#chatWindow').append('<div id="message" class = "right float-right">'+data.message+'</div><div id="chatname" class="float-right">'+data.user+'</div>');				
		})
	});

	socket.on('users',function(data){
		$scope.usersOnline = data;
	});
});

app.controller('submitController',function($http,$scope){

	$scope.submitForm = function(){
		var user={
		username: $scope.username,
		password: $scope.password
	};
	
//console.log(user.username);
		$http.post("/submit",user).success(function(data){
			console.log(data);
		});
		//$location.path('/list');
	}	
});


app.controller('loginController',function($http,$scope,$rootScope,$location){

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
				$scope.password='';
			}
		});
		
	}
	$scope.logout = function(){
		$location.path('/login');
		$rootScope.authen = false;
		$rootScope.current = null ;	
	}	

	
});