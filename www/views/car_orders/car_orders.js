angular.module('starter')

  .controller('carOrdersController',function($scope,$state,$http, $location,$rootScope){

    //车险订单  0.已生成;1.待支付
    $scope.tabIndex=0;

    $scope.orders=$rootScope.car_orders;

    $scope.prices=$rootScope.car_insurance.prices;



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

    $scope.setDetail=function(item){
      if(item.detail!=true)
        item.detail=true;
      else
        item.detail=false;
    }

    $scope.toggle=function(item,field)
    {
      if(item[field]!=true)
        item[field]=true;
      else
        item[field]=false;
    }

    $scope.editDetail=function(order) {

    };

    $scope.goDetail=function(order)
    {
      $state.go('car_order_detail',{order:JSON.stringify(order)});
    }

  });
