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

    $scope.takeOrders = function(){
      $http({
        method: "post",
        url: "/proxy/node_server/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token,
        },
        data:
        {
          request:'updateServiceOrderStateAndServicePersonId',
          info:{
            orderNum:$scope.order.orderNum,
            orderState:2
          }
        }
      }).then(function (res) {
        var json=res.data;
        if(json.re==1) {
          $http({
            method: "post",
            url: "/proxy/node_server/svr/request",
            headers: {
              'Authorization': "Bearer " + $rootScope.access_token,
            },
            data:
            {
              request:'servicePersonTakeOrder',
              info:{
                customerId:$scope.order.customerId
              }
            }
          }).then(function(res) {
            var json=res.data;
            if(json.re==1) {
              console.log('service order has been generated');
            }
          }).catch(function(err) {
            var str='';
            for(var field in err)
              str+=err[field];
            console.error('error=\r\n' + str);
          });


        }

      })

    };


    $scope.cancleOrder = function(state){
      $http({
        method: "post",
        url: "/proxy/node_server/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token,
        },
        data:
        {
          request:'updateServiceOrderState',
          info:{
            orderNum:$scope.order.orderNum,
            orderState:state,
            orderId:$scope.order.orderId
          }
        }
      })


    }




  });
