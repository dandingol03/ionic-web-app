/**
 * Created by apple-2 on 16/8/23.
 */
angular.module('starter')
  .controller('passwordModifyController',function($scope,$state,$http,$rootScope){

    $scope.carInfo={};

    $scope.go_back=function(){
      window.history.back();
    };

    $scope.go_to=function(state){
      $state.go(state);
    };

    $scope.save=function(){
      $http({
        method: "POST",

        url: "/proxy/node_server/request",

        headers: {
          'Authorization': "Bearer " + $rootScope.access_token,
        },
        data:
        {
          request:'passwordModify',
          info:$scope.carInfo
        }
      })
    }

  });
