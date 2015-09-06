(function(){
	angular.module('Ripple')
	.config(function($routeProvider){
		$routeProvider
		// when('/search', {
		// 	templateUrl: '../templates/searchView.html'
		// })
		.when('/', {
			templateUrl: '../templates/home.html'
		})
		.when('/login', {
			templateUrl: '../templates/login.html'
		})
		.when('/verify/:userId', {
			templateUrl: '../templates/verify.html'
		})
		.otherwise({
			redirectTo: '/'
		})
	}).
	run(function($rootScope, $location){
		// http://fdietz.github.io/recipes-with-angular-js/urls-routing-and-partials/listening-on-route-changes-to-implement-a-login-mechanism.html
	    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
	      if ($rootScope.user.isLoggedIn === false && next.$$route.originalPath.indexOf("verify") === -1) {
	      	console.log($rootScope.user);
	        // no logged user, redirect to /login

	        $location.path("/login");

	      }
	      else if ($rootScope.user.isLoggedIn === true && next.$$route.originalPath.indexOf("login") > -1){
			$location.path("/");
	      }
	    });
	});
})();
