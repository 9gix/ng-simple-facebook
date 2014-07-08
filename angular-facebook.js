'use strict';

angular.module('facebook', [])
.provider('Facebook', function(){
  var ngFacebook = function(){};
  var settings = {
    scopes: 'email',
    appId: null,
    version: 'v2.0',
  };

  this.init = function(conf){
    angular.extend(settings, conf);
  };

  this.$get = ['$rootScope', '$q', function($rootScope, $q){

    var NgFacebook = function(){};
    var deferred = $q.defer();

    NgFacebook.prototype.init = function(){
      FB.init(settings);
    };

    NgFacebook.prototype.login = function(){
      FB.login(this.handleLogin, {
        scope: settings.scopes,
      });
      return deferred.promise;
    };

    NgFacebook.prototype.logout = function(){
      /**
       * This will actually sign out the user from the facebook
      * which may not be the intended behaviour.
      * Nonetheless this is the recommened flow from the facebook sdk */
      var deferred = $q.defer();
      FB.getLoginStatus(function(resp){
        if (resp.authResponse){
          FB.logout(function(response){
            return deferred.resolve(response);
          });
        }
      });
      return deferred.promise;
    };

    NgFacebook.prototype.getUser = function(){
      var deferred = $q.defer();
      FB.api('/me', function(response){
        if (response && !response.error){
          $rootScope.$apply(function(){
            deferred.resolve(response);
          });
        } else {
          deferred.reject(response.error.message);
        }
      });
      return deferred.promise;
    };

    NgFacebook.prototype.handleLogin = function(response){
      if (response && response.status === 'connected'){
        $rootScope.$apply(function(){
          deferred.resolve(response.authResponse);
        });
      } else {
        deferred.reject('error');
      }
    };

    return new NgFacebook();
  }];
})
.run(function($window, Facebook){
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  $window.fbAsyncInit = function(){
    Facebook.init();
  };
});
