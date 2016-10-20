/**
 * Created by yiming on 16/10/5.
 */
/**
 * Created by yiming on 16/9/13.
 */
angular.module('starter')

  .controller('serviceOrderDetailController',function($scope,$stateParams,$http,$rootScope){

    $scope.order=$stateParams.order;

    if(Object.prototype.toString.call($scope.order)=='[object String]')
      $scope.order = JSON.parse($scope.order);

    $scope.go_back=function(){
      window.history.back();
    };


    //取消订单
    $scope.cancleOrder = function(state){
      $http({
        method: "post",
        url: Proxy.local()+"/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token,
        },
        data:
        {
          request:'updateServiceOrderState',
          info:{
            orderState:state,
            order:$scope.order
          }
        }
      })
    }

  });
