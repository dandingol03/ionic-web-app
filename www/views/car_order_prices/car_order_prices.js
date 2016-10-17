/**
 * Created by yiming on 16/10/15.
 */
angular.module('starter')

/**
 * 本页面不开启缓存
 */
  .controller('carOrderPricesController',function($scope,$state,$http,
                                            $location,$rootScope,$stateParams,
                                            $ionicPopup,Proxy){

    $scope.order=$stateParams.order;

    if(Object.prototype.toString.call($scope.order)=='[object String]')
      $scope.order=JSON.parse($scope.order);



    $scope.go_back=function(){
      window.history.back();
    }


    $scope.tab_change=function(i){
      $scope.tabIndex=i;
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



    //提交车险已选报价
    $scope.apply=function(){
      var selected_price=null;
      var order=$scope.order;
      order.prices.map(function(price,i) {
        if(price.checked==true)
          selected_price=price;
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
          //TODO:give a tip to customer to inform car order has been generated
        }
      }).catch(function(err) {
        var str='';
        for(var field in err)
          str+=err[field];
        console.error('error=\r\n' + str);
      })
    }


    //重选套餐
    $scope.reset_specials=function(){
      $rootScope.Insurance={};
      var carOrderState = -1;

      $http({
        method: "POST",
        url: Proxy.local()+"/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        },
        data:
        {
          request:'updateCarOrderState',
          info:{
            orderState:carOrderState,
            orderId:$scope.order.orderId
          }
        }
      }).then(function(res) {

        if(res.data.re==1){
          $http({
            method: "POST",
            url: Proxy.local()+"/svr/request",
            headers: {
              'Authorization': "Bearer " + $rootScope.access_token
            },
            data:
            {
              request:'getCarInfo',
              info:{
                order:$scope.order
              }
            }
          }).then(function(res) {
            if(res.data.re==1){
              var carInfo = res.data;
              $state.go('car_insurance',{carInfo:JSON.stringify(carInfo)});

            }
          })
        }

      })

    }


  });
