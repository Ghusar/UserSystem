var app = angular.module('mainApp',['ngRoute']).run(function($rootScope,$http,$location){
	$rootScope.authen = false;
	$rootScope.current = '';
	$rootScope.user='';
	$rootScope.current_user='';
	$rootScope.current_user_messages='';
	$rootScope.socket;
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
	.when('/beforechat',{
		controller:'userController',
		templateUrl:'../../views/beforechat.html'
	})
	.otherwise({redirectTo:'/home'});
});

app.controller('userController',function($scope,$location,$rootScope){
	$rootScope.socket = io.connect();
	$scope.gochat = function(){
		$rootScope.socket.emit('new uservalue',$scope.user,function(data){
			console.log(data);
			if(data){
				//$scope.gochatting = true;
				//console.log('aya ksjfslfjl');
				$location.path('/chat');	
			}
		});
	};
	$rootScope.socket.on('users',function(data){
		console.log("data naya banda aya ya gaya"+data);
		$rootScope.user = data;
		//console.log("scope "+$scope.user);
	});

	$rootScope.socket.on('current_user',function(data){
		$rootScope.current_user = data;
	});
});

app.controller('chatController',function($scope,$location,$rootScope){
	///if(!$rootScope.current_user)
	
	$rootScope.current_user_messages = document.getElementById('message');
	//$scope.gochating = false;
	console.log("aya re ");

	
	//var message = document.getElementById('message');
	
	$rootScope.socket.on('new message',function(data){
		console.log("ek bar aja data "+data);
		$rootScope.current_user_messages.innerHTML+="<strong>"+data.user+"</strong>"+":" +data.message+ '<br />';
		console.log($rootScope.current_user_messages);
	});

	

	
	
	
	$scope.send = function(){
		//console.log("aya reer ");
		//console.log($scope.usermessage);
		$rootScope.socket.emit('send message',$scope.usermessage);
		$scope.usermessage = '';
	};
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