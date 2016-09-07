angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope,$http, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});


    $http.get("http://202.194.14.106:9030/insurance/get_lifeinsurance_list").
      then(function(res) {
        if(res.data!==undefined&&res.data!==null)
        {
            var life_insurances=res.data.life_insurances;
            if(Object.prototype.toString.call(life_insurances)!='[object Array]')
              life_insurances=JSON.parse(life_insurances);
          life_insurances.map(function(insurance,i) {
            alert(insurance);
          });
        }
      }).catch(function(err) {
        alert('err=' + err);
      });

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {

  $scope.chat = Chats.get($stateParams.chatId);

})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
