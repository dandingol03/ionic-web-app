angular.module('starter')

  .controller('carOrdersController',function($scope,$state,$http, $location){

    //customer 用户

    $scope.goto=function(url){
      $location.path(url);
    };

    $scope.go_back=function(){
      window.history.back();
    }

    $scope.orders=[{carNum:'538900',insuranced:'ddw',
      specials:[],total:'10000$',date:new Date()}];

  });
