angular.module('starter')

  .controller('carOrdersController',function($scope,$state,$http, $location,$rootScope){

    //车险订单  0.已生成;1.待支付
    $scope.tabIndex=0;

    $scope.priceIndex=-1;


    $scope.orders=$rootScope.car_orders;

    $scope.prices=$rootScope.car_insurance.prices;

    //获取估价列表
    $http({
      method: "POST",
      url: "/proxy/node_server/svr/request",
      headers: {
        'Authorization': "Bearer " + $rootScope.access_token
      },
      data:
      {
        request:'getCarOrderPriceItems',
        orderId:39
      }
    }).then(function(res) {
      var json=res.data;
      if(json.re==1)
      {
        $scope.orderPriceItems=json.data;

      }
    }).catch(function(err) {
      var str='';
      for(var field in err)
      {
        str+=err[field];
      }
      console.error('error=\r\n' + str);
    });



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

    $scope.setterPrice=function(i) {
      if($scope.priceIndex==i)
        $scope.priceIndex=-1;
      else
        $scope.priceIndex=i;
    };

    $scope.editDetail=function(order) {

    };

    $scope.goDetail=function(order)
    {
      $state.go('car_order_detail',{order:JSON.stringify(order)});
    }

  });
