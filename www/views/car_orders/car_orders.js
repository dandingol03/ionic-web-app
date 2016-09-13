angular.module('starter')

  .controller('carOrdersController',function($scope,$state,$http, $location){

    //车险订单  1.简要:carNum,被投保人

    $scope.goto=function(url){
      $location.path(url);
    };

    $scope.go_back=function(){
      window.history.back();
    }

    $scope.orders=[{carNum:'538900',insuranced:'ddw',
      specials:[],total:'10000$',date:new Date()}];

  });
