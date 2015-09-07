(function(){
	var config = {
		baseUrl//: 'http://localhost:3000'
		: 'http://ripplemusicapp.herokuapp.com/'
	}

	// CONTROLLERS
	angular.module('Ripple').controller('appController', ['$rootScope', '$scope', '$http', '$window', '$cookies', function($rootScope, $scope, $http, $window, $cookies){
		var app = this;

		$rootScope.location = {};

		var userCookie = $cookies.getObject('user');
		if (userCookie) {
			$rootScope.user = userCookie;
			$rootScope.user.isLoggedIn = true;
			$rootScope.location.latitude = userCookie.latitude;
			$rootScope.location.longitude = userCookie.longitude;
			console.log($rootScope.user.email);
		}
		else {	  
			$rootScope.user = {
			  	isLoggedIn: false
			  };
		}

	  $scope.login = function(){

	  }

	  $scope.getSearching = function(){
	  	if (!$scope.searching) {
	  		return false;
	  	}
	  	return $scope.searching;
	  }

	  $scope.setSearching = function(searching) {
	  	$scope.searching = searching;
	  	$scope.accountOpen = false;
	  }

	  $scope.getAccountOpen = function(){
	  	console.log('hey');
	  	if (!$scope.accountOpen) {
	  		return false;
	  	}
	  	return $scope.accountOpen;
	  }

	  $scope.setAccountOpen = function(status) {
	  	$scope.accountOpen = status;
	  	$scope.searching = 0;
	  }

	  $scope.showFeed = function() {
	  	$scope.accountOpen = false;
	  	$scope.searching = 0;
	  }

	  $scope.setLocation = function(location){
	  	$rootScope.location.latitude = location.coords.latitude;
	  	$rootScope.location.longitude = location.coords.longitude;	
	  	// NOW load songs
	  	if (!$scope.feed || !$scope.feed.drops || $scope.feed.drops.length < 1) {
	  		$scope.loadDrops();
	  	}
	  }

      getCoor = function(position){
          $scope.$apply(function(){
      	  // console.log(position);
        	  $scope.setLocation(position);
          });
      }

      errorCoor = function(error){
  		  console.log(error);
      }

	  $scope.isLoggedIn = function(){
	  	if ($scope.user.email) {
	  		return true;
	  	}
	  	else {
	  		return false;
	  	}
	  }

	  $scope.getDrops = function(){
	  	if (!$scope.feed || !$scope.feed.drops || $scope.feed.drops.length === 0){
		  	console.log('get drops');
		  	if (navigator.geolocation && !$rootScope.location.longitude) {
		  		// $rootScope.location.latitude = 32.859406799999995;
		  		// $rootScope.location.longitude = -96.75857649999999;
		  		// $scope.loadDrops();
			  	navigator.geolocation.getCurrentPosition(getCoor, errorCoor, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});
			}
			else if ($rootScope.location.longitude) {
				$scope.loadDrops();
			}
			else if(!navigator.geolocation) {
				alert ('cannot get location');
			}
		}

	  }

	  $scope.loadDrops = function(){
		$http({method: 'GET', url: config.baseUrl + '/api/drops?latitude=' + $rootScope.location.latitude 
			+ '&longitude=' + $rootScope.location.longitude}).
			success(function(data){
				$scope.feed.drops = data;
				// console.log(data);

			}).
			error(function(err){
				console.log(err);
				$scope.feed.error = err;
			});
	  }

	  $scope.createWidgets = function() {
			$scope.feed.widgets = $scope.feed.drops.map(function(drop, i){
				var scid = drop.soundcloud_track_id;
				//console.log(document.getElementById(scid));
				var widget = SC.Widget(scid);
				return widget; 
			});
			$scope.feed.widgets.forEach(function(widget, i){
				widget.bind(SC.Widget.Events.FINISH, $scope.playNext.bind(this, i));
			});
	  }

	  $scope.playNext = function(i){
			var nextTrack = i+1;
			if (i === $scope.feed.drops.length - 1) {
				nextTrack = 0;
			}
			$scope.feed.widgets[nextTrack].play();
		}

	$scope.elementLoaded = function(){
		$scope.elementsLoaded += 1;
		if ($scope.elementsLoaded === $scope.feed.drops.length) {
			$scope.createWidgets();
		}
	}

	  $scope.searching = 0;
	  $scope.accountOpen = false;
	  $scope.feed = {
	  	widgets: []
	  };
	  $scope.elementsLoaded = 0;

	}]);

	angular.module('Ripple').controller('feedController', ['$http', '$scope', function($http, $scope){
		var feed = this;
		var app = $scope.$parent;
	}]);

	angular.module('Ripple').controller('dropController', ['$scope', '$http', '$sce', '$rootScope', function($scope, $http, $sce, $rootScope){
		$scope.getIframeSrc = function(songid) {
			return $sce.trustAsResourceUrl("https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + songid);
		}

		$scope.isOriginalDropper = function(type){
			if (type === 'drop') {
				return false;
			}
			else {
				return $scope.$parent.drop.previous_dropper_ids.indexOf($rootScope.user._id) != -1;
			}
			return false;
		}

		$scope.dropSong = function(type){
			var body = {};
			var song;
			var app;
			var user;
			var feed;
			var routePath = "create";

			if (type === "redrop") { // feed
				song = $scope.$parent.drop;
				app = $scope.$parent.$parent.$parent;
				user = $rootScope.user;
				feed = app.feed;
				console.log(song);
				body.lastDropId = song._id;
				song.previous_dropper_ids.push(user._id);
				body.previousDropperIds = song.previous_dropper_ids;
				body.soundcloudTrackId = song.soundcloud_track_id;
				body.trackName = song.name;
				body.artist = song.artist
				routePath = "redrop";
			}
			else { // search
				song = $scope.$parent.result;
				app = $scope.$parent.$parent.$parent;
				user = $rootScope.user;
				feed = app.feed;
				body.trackName = song.title;
				body.soundcloudTrackId = song.id;
				body.artist = song.label_name;
			}

			// craft the request body:
			body.userId = user._id;
			body.streamUrl = song.stream_url;
			body.artworkUrl = song.artwork_url;
			body.streamable = song.streamable;
			body.latitude = $rootScope.location.latitude;
			body.longitude = $rootScope.location.longitude;


			$http({method: 'POST', url: config.baseUrl + '/api/drops/' + routePath, data: body}).
			success(function(result){
				if (type === "drop") {
					$scope.$parent.$parent.$parent.setSearching(false);
	  				$scope.$parent.$parent.$parent.feed.drops.unshift(result);
	  				$scope.$parent.$parent.$parent.feed.widgets.unshift(widget);
	  				var widget = SC.Widget(result.soundcloud_track_id);
	  				widget.bind(SC.Widget.Events.FINISH, $scope.$parent.$parent.$parent.playNext(0));

					// check for duplicate
				}
				else if (type === "redrop") {
					console.log("it's a redrop");
					// remove the song from the feed
					console.log(result);
					var index = 0;
					$scope.$parent.$parent.$parent.feed.drops = feed.drops.filter(function(feedsong, i){
						if (feedsong._id === song._id) {
							index = i;
						}
						return feedsong._id !== song._id;
					});
					$scope.$parent.$parent.$parent.feed.widgets.splice(index, 1);

					$scope.$parent.$parent.$parent.feed.drops.unshift(result);
	  				$scope.$parent.$parent.$parent.feed.widgets.unshift(widget);
	  				var widget = SC.Widget(result.soundcloud_track_id);
	  				widget.bind(SC.Widget.Events.FINISH, $scope.$parent.$parent.$parent.playNext(0));
					// $scope.$apply();
					// assign points
					$http({method: 'POST', url: config.baseUrl + '/api/users/credit', data: {userId: song.user_id, points: 10}}).
					success(function(data){
						console.log('points awarded');
					}).
					error(function(err){
						console.log("failed to assign points");
					});
					// how the fuck am I managing duplicates...
				}
			}).
			error(function(err){
				console.log(err);
			});
		}

	}]);

	angular.module('Ripple').controller('accountController', ['$http', '$rootScope', '$cookies', '$window', function($http, $rootScope, $cookies, $window){
		var ctrl = this;
		ctrl.userDrops = [];

		$http({method: 'GET', url: config.baseUrl + '/api/drops/' + $rootScope.user._id}).
		success(function(result){
			console.log(result);
			ctrl.userDrops = result;
		}).
		error(function(err){
			console.log(err);
		});

		this.logout = function(){
			$rootScope.user = {};
			$cookies.remove('user');
			$window.location = '/#/login';
		};

		this.noDropsMessage = "You have not dropped any songs. Search one now and ride the Ripple!"

	}]);

	angular.module('Ripple').controller('searchController', ['$scope', '$http', function($scope, $http){
		SC.initialize({
			client_id: 'dafab2de81f874d25715f0e225e7c71a'
		});
		var user = $scope.user;
		var ctrl = this;
		$scope.searchResults = [];

		$scope.search = function(query, elem){			
			SC.get('/tracks', { q: query, limit: 10 }, function(tracks) {
				// will insert top 10 songs returned by SoundCloud into search modal
				if (tracks.length == 0){
					// no results
				}
				else {
					console.log($scope);
					$scope.$parent.searchResults = _.remove(tracks, function(track){
						var index = _.findIndex($scope.$parent.feed.drops, function(drop){
							return drop.soundcloud_track_id === track.id.toString();
						});
						return index === -1;
					});
					$scope.$parent.setSearching(true);
					$scope.$apply();
					$scope.searchQuery = null;
				}
			});
		}
	}]);

	angular.module('Ripple').controller('loginPageController', function(){
		this.newUser = false;
		var ctrl = this;

		this.setNewUser = function(){
			ctrl.newUser = true;
		};

		if (navigator.geolocation){
			navigator.geolocation.getCurrentPosition(getCoor, errorCoor, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});
		}


	    getCoor = function(position){
	        $scope.$apply(function(){
	      	// console.log(position);
	        	setLocation(position);
	        });
	    }

	    errorCoor = function(error){
	  		console.log(error);
	    }
	    
	    setLocation = function(location){
	    	$rootScope.location = {};
		  	$rootScope.location.latitude = location.coords.latitude;
		  	$rootScope.location.longitude = location.coords.longitude;
	  	}
	});

	angular.module('Ripple').controller('loginFormController', ['$rootScope', '$http', '$window', '$scope', '$cookies', function($rootScope, $http, $window, $scope, $cookies){
		this.loginInfo = {};

		this.login = function(){
			$http({method: 'POST', url: config.baseUrl + '/api/users/login', data: this.loginInfo}).
			success(function(data){
				// console.log($scope);
				if (data) {
					var expDate = new Date();
					expDate.setDate(expDate.getDate + 180);

					$rootScope.user = data;
					$rootScope.user.isLoggedIn = true;
					$cookies.putObject('user', $rootScope.user, {expires: expDate});
					$window.location.href = '/#/';
				}
				else {
					alert('Login Failed');
				}
			}).
			error(function(err){
				alert('Login failed');
			});
			this.loginInfo = {};
		}
	}]);

	angular.module("Ripple").controller('registerFormController', ['$rootScope', '$http', '$window', '$cookies', function($rootScope, $http, $window, $cookies){
		this.registerInfo = {};
		var ctrl = this;

		this.register = function(){
			console.log(ctrl.registerInfo);
			var submitData = ctrl.registerInfo;
			console.log($rootScope);
			submitData.latitude = $rootScope.location.latitude;
			submitData.longitude = $rootScope.location.longitude;

			$http({method: 'POST', url: config.baseUrl + '/api/users/register', data: submitData}).
			success(function(data){
				console.log(data);
				if (data) {
					if (data.errmsg) {
						alert('Account Creation Failed');
					}
					else {
						alert('check your email to verify your account');
					}
				}
				else {
					alert('Account Creation Failed');
				}
			}).
			error(function(err){
				alert('Error Creating Account');
			});
			this.registerInfo = {};
		}
	}]);

	angular.module("Ripple").controller('homeController', ['$scope', '$rootScope', '$cookies', '$window', function($scope, $rootScope, $cookies, $window){

		this.init = function(){
			var appScope = $scope.$parent.$parent;
			appScope.getDrops();
		};

		this.email = $rootScope.user.email;
	}]);

	angular.module("Ripple").controller('verifyController', ['$rootScope', '$http', '$routeParams', '$window', '$cookies', function($rootScope, $http, $routeParams, $window, $cookies){
		this.start = function(){
			$http({method: 'GET', url: config.baseUrl + '/api/users/' + $routeParams.userId }).
			success(function(data){
				var expDate = new Date();
				expDate.setDate(expDate.getDate + 180);
				
				$rootScope.user = data;
				$rootScope.user.isLoggedIn = true;
				$cookies.putObject('user', $rootScope.user, {expires: expDate});
				$window.location = '/#/'
			}).
			error(function(err){
				console.log(err);
			});
		}
	}]);
})();