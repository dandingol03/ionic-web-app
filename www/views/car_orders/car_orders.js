angular.module('starter')

  .controller('carOrdersController',function($scope,$state,$http, $location,$stateParams){

    //customer 用户

    $scope.orders=[
      {name:"ABC",carNum:"鲁A00003",sum:200},
      {name:"ABC",carNum:"鲁A00003",sum:200},
      {name:"ABC",carNum:"鲁A00003",sum:200}
                   ];//车险选好公司后,生成的订单
    $scope.selected=JSON.parse($stateParams.selected);

    $scope.goto=function(url){
      $location.path(url);
    };

    $scope.go_back=function(){
      window.history.back();
    }

    $scope.setDetail=function(order){
      order.detail=!order.detail;
    }


  });
