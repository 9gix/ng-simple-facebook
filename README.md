ng-simple-facebook
==================

A simple angularjs facebook login, using angular promises.

Usage
-----

```
.config(function(FacebookProvider){
  FacebookProvider.init({
    appId: '1234567890',
    scopes: 'email, public_profile',
  });
})
.controller(function(Facebook){
  $scope.facebookLogin = function(){
    var fbToken = '';
    Facebook.login()
    .then(function(authResult){
      fbToken = authResult.accessToken;
      return Facebook.getUser();
    })
    .then(function(me){ 
      // result from getUser()
      var email = me.email;
      var uid = me.id;
    });
  };
});

```
