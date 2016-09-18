angular.module('starter')

  .controller('lifeInsuranceOrdersController',function($scope,$state,$http, $location){

    $scope.go_back=function(){
      window.history.back();
    }

    $scope.goto=function(url){
      $location.path(url);
    };

    $scope.tabIndex=0;
    $scope.tab_change=function(i){
      $scope.tabIndex=i;
    }



  });
