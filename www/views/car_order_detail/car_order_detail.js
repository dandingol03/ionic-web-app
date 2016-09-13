angular.module('starter')

  .controller('carOrderDetailController',function($scope,$state,$http, $location,$rootScope,$stateParams){

    //车险订单  0.报价中;1.已生成;2.待支付

    $scope.order=$rootScope.order;

    $scope.order=
    {
      carId:1142051104,
      custmomerId:201513569,
      benefiterId:201513570,
      items: [
        {productName:'第三者责任险',insuranceType:'国内',productId:1},
        {productName:'车辆损失险',insuranceType:'进口',productId:4}
      ],
      insuranceFeeTotal:'40000$',
      orderDate:'2015-09-21'
    };

    if(Object.prototype.toString.call($scope.order)=='[object String]')
      $scope.order = JSON.parse($scope.order);

    $scope.goto=function(url){
      $location.path(url);
    };

    $scope.go_back=function(){
      window.history.back();
    }




  });
