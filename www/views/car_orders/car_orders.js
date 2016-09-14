angular.module('starter')

  .controller('carOrdersController',function($scope,$state,$http, $location,$rootScope){

    //车险订单  0.报价中;1.已生成;2.待支付
    $scope.tabIndex=0;

    $scope.orders=$rootScope.car_orders;

    $scope.goto=function(url){
      $location.path(url);
    };

    $scope.go_back=function(){
      window.history.back();
    }

    $scope.tab_change=function(i)
    {
      $scope.tabIndex=i;
    }

    $scope.setDetail=function(order){
      order.detail=!order.detail;
    }

    $scope.goDetail=function(order)
    {
      $state.go('car_order_detail',{order:JSON.stringify(order)});
    }

  });
