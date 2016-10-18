angular.module('starter')

  .controller('carOrdersController',function($scope,$state,$http,
                                             $location, $rootScope,Proxy){



    //已完成订单
    $http({
      method: "POST",
      url: Proxy.local()+"/svr/request",
      headers: {
        'Authorization': "Bearer " + $rootScope.access_token
      },
      data:
      {
        request:'getCarOrdersInHistory'
      }
    }).then(function(res) {
      var json=res.data;
      if(json.re==1) {
          $scope.historyOrders=json.data;
      }
    }).catch(function(err) {
      var str='';
      for(var field in err)
        str+=err[field];
      console.error('error=\r\n' + str);
    });

    //获取估价列表
    $http({
      method: "POST",
      url: Proxy.local()+"/svr/request",
      headers: {
        'Authorization': "Bearer " + $rootScope.access_token
      },
      data:
      {
        request:'getCarOrderInPricedState'
      }
    }).then(function(res) {
      var json=res.data;
      if(json.re==1) {
        $scope.orderPricedList=json.data;
        if($scope.orderPricedList!==undefined&&$scope.orderPricedList!==null)
        {}
      }
    }).catch(function(err) {
      var str='';
      for(var field in err)
        str+=err[field];
      console.error('error=\r\n' + str);
    });



    //车险订单  0.已生成;1.待支付
    $scope.tabIndex=0;

    $scope.priceIndex=-1;


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

    $scope.setterPrice=function(i,item) {
      if($scope.priceIndex==i)
      {
        $scope.priceIndex=-1;
        item.checked=null;
      }
      else
      {
        $scope.priceIndex=i;
        item.checked=true;
      }
    };

    $scope.goDetail=function(order)
    {
      $state.go('car_order_prices',{order:JSON.stringify(order)});
    }

    //提交已选方案
    $scope.apply=function(){
      var selected_price=null;

      $scope.orderPricedList.map(function(order) {
        order.prices.map(function(price,i) {
          if(price.checked==true)
            selected_price=price;
        });
      });

      $http({
        method: "POST",
        url: Proxy.local()+"/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        },
        data:
        {
          request:'applyCarOrderPrice',
          info:{
            price:selected_price
          }
        }
      }).then(function(res) {
        var json=res.data;
        if(json.re==1) {

        }
      }).catch(function(err) {
        var str='';
        for(var field in err)
          str+=err[field];
        console.error('error=\r\n' + str);
      })
    }



  });
