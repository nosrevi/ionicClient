angular.module('starter.controllers', ['starter.services', 'ngOpenFB'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, ngFB) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.fbLogin = function () {
    ngFB.login({scope: 'email,read_stream,publish_actions'}).then(
      function (response) {
        if (response.status === 'connected') {
          console.log('Facebook login succeeded');
          $scope.closeLogin();
        } else {
          alert('Facebook login failed');
        }
      });
  };
})

.controller('SessionsCtrl', function($scope, Session) {
  $scope.sessions = Session.query();
})

.controller('SessionCtrl', function($scope, $stateParams, Session, ngFB) {
  $scope.session = Session.get({sessionId: $stateParams.sessionId});
  $scope.share = function (event) {
    ngFB.api({
      method: 'POST',
      path: '/me/feed',
      params: {
          message: "I'll be attending: '" + $scope.session.title + "' by " +
          $scope.session.speaker
      }
    }).then(
      function () {
          alert('The session was shared on Facebook');
      },
      function () {
          alert('An error occurred while sharing this session on Facebook');
      });
  };
})

.controller('ChatCtrl', function($scope,$ionicScrollDelegate,Chat,Notification) {

  $scope.messages = Chat.getMessages();
  Notification.hide();
  $ionicScrollDelegate.scrollBottom(true);

  $scope.$watch('newMessage', function(newValue, oldValue) {
    if(typeof newValue != 'undefined'){
      if(newValue != ''){
        Chat.typing();
      }
      else{
        Chat.stopTyping();
      }
    }
  });

  $scope.sendMessage = function() {
    if($scope.newMessage){
      Chat.sendMessage($scope.newMessage);
      $scope.newMessage = '';
      $ionicScrollDelegate.scrollBottom(true);
    }
    else{
      alert('Can\'t be empty');
    }
  };

})

.controller('ProfileCtrl', function ($scope, ngFB) {
  ngFB.api({
    path: '/me',
    params: {fields: 'id,name'}
  }).then(
    function (user) {
        $scope.user = user;
    },
    function (error) {
        alert('Facebook error: ' + error.error_description);
    });
});
