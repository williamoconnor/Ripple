(function(){
	var config = {
		baseUrl: 'http://localhost:3000'
	}
	// DIRECTIVES
	angular.module('Ripple').directive('drop', function(){
		return {
			restrict: 'E',
			templateUrl: '../templates/drop.html',
			scope: {
				songid: "=",
				droptype: "="
			},
			controller: "dropController",
			controllerAs: "dropCtrl",
			link: function(scope, element, attrs) {
				if (attrs.droptype === "'redrop'" && scope.$parent.drop) {
					var app = scope.$parent.$parent.$parent.$parent.$parent;
					var timeout = setTimeout(function(){
					    // do stuff
					    app.createWidgets()
					    // scope.$apply();
					}, 3000); 
				}
				// console.log(element[0].childNodes[0].children[1]);
				// element[0].childNodes[0].children[1].on( app.elementLoaded());
				// app.elementLoaded();
			}
		}
	});

	angular.module('Ripple').directive('searchBox', function(){
		return {
			restrict: 'E',
			templateUrl: '../templates/searchBox.html',
			controller: 'searchController',
			controllerAs: 'searchCtrl'
		};
	});

	angular.module('Ripple').directive('feed', function(){
		return {
			restrict: 'E',
			templateUrl: '../templates/feed.html',
			// link: function(scope, element, attrs){
			// 	console.log(scope.$parent.$parent.$parent.feed.drops);
			// }
		};
	});

	angular.module('Ripple').directive('searchResults', function(){
		return {
			restrict: 'E',
			templateUrl: '../templates/searchView.html'
		};
	});

	angular.module('Ripple').directive('loginForm', function(){
		return {
			restrict: 'E',
			templateUrl: '../templates/loginForm.html'
		};
	});

	angular.module('Ripple').directive('registerForm', function(){
		return {
			restrict: 'E',
			templateUrl: '../templates/registerForm.html'
		};
	});

	angular.module('Ripple').directive('accountView', function(){
		return {
			restrict: 'E',
			templateUrl: '../templates/accountView.html'
		};
	});

	angular.module('Ripple').directive('noDrops', function(){
		return {
			restrict: 'E',
			templateUrl: '../templates/noDrops.html'
		};
	});

})();