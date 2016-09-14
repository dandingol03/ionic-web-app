/**
 * Created by apple-2 on 16/8/23.
 */
angular.module('starter')
  .controller('myInfoController',function($scope,$state,$http){

    $scope.go_back=function(){
      window.history.back();
    };

    $scope.go_to=function(state){
      $state.go(state);
    };


    $scope.detail=false;
    $scope.setDetail=function(){
      $scope.detail=!$scope.detail;
    }

  });
