/**
 * Created by yiming on 16/10/5.
 */
angular.module('starter')

  .controller('serviceOrdersController',function($scope,$state,$http, $location,
                                                 $rootScope,Proxy){

    $scope.tabIndex=0;

    $scope.goto=function(url){
      $location.path(url);
    };

    $scope.go_back=function(){
      window.history.back();
    };

    $scope.tab_change=function(i)
    {
      $scope.tabIndex=i;
    };

    $scope.orders1 = [];
    $scope.orders2 = [];
    $scope.orders3 = [];

    $http({
      method: "post",
      url: Proxy.local()+"/svr/request",
      headers: {
        'Authorization': "Bearer " + $rootScope.access_token,
      },
      data:
      {
        request:'fetchServiceOrderByCustomerId',
      }
    })
      .then(function (res) {
        var json=res.data;
        if(json.re==1)
          $scope.orders=json.data;
        $scope.orders.map(function(order,i) {
          if(order.orderState==1)
            $scope.orders1.push(order);
          if(order.orderState==2)
            $scope.orders2.push(order);
          if(order.orderState==3)
            $scope.orders3.push(order);

        });
        console.log('success');
      })

    $scope.showOrderDetail=function(order){
      $state.go('service_order_detail',{order:JSON.stringify(order)});
    }


  });
