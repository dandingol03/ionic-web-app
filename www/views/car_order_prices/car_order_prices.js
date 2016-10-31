/**
 * Created by yiming on 16/10/15.
 */
angular.module('starter')

/**
 * 本页面不开启缓存
 */
  .controller('carOrderPricesController',function($scope,$state,$http,
                                            $location,$rootScope,$stateParams,
                                            $ionicPopup,Proxy,$ionicModal){

    $scope.insuranceder={};

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

    $scope.Mutex=function(item,field,cluster) {
      if(item[field])
      {
        item[field]=false;
      }
      else{
        item[field]=true;
        cluster.map(function(cell,i) {
          if(cell.carNum!=item.carNum)
            cell[field]=false;
        })
      }
    };

    /*** bind select_relative modal ***/
    $ionicModal.fromTemplateUrl('views/modal/select_relative.html',{
      scope:  $scope,
      animation: 'animated '+' bounceInUp',
      hideDelay:920
    }).then(function(modal) {
      $scope.select_relative={
        modal:modal
      }
    });

    $scope.open_selectRelativeModal= function(field){
      $scope.select_relative.modal.show();
      $scope.select_relative.field=field;
    };

    $scope.close_selectRelativeModal= function(cluster) {
      if(cluster!==undefined&&cluster!==null)
      {
        cluster.map(function(singleton,i) {
          if(singleton.checked==true)
          {
            $scope[$scope.select_relative.field]=singleton;
          }
        })
      }
      $scope.select_relative.modal.hide();
    };
    /*** bind select_relative modal ***/


    $scope.fetchRelative=function(field) {
      $http({
        method: "POST",
        url: Proxy.local()+'/svr/request',
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        },
        data:
        {
          request:'getRelativePersons'
        }
      }).then(function(res) {
        var json=res.data;
        if(json.re==1) {
          if(json.data!=undefined&&json.data!=null){
            $scope.relatives=json.data;

            $scope.open_selectRelativeModal(field);
          }
        }else{
          $scope.open_selectRelativeModal(field);
        }

      }).catch(function(err) {
        var str='';
        for(var field in err)
          str+=err[field];
        console.error('error=\r\n' + str);
      });
    };


    /*** bind apeend_carOrderPerson_modal***/
    $ionicModal.fromTemplateUrl('views/modal/append_carOrder_person.html',{
      scope:  $scope,
      animation: 'animated '+' bounceInUp',
      hideDelay:920
    }).then(function(modal) {
      $scope.append_carOrderPerson_modal = modal;
    });

    $scope.open_appendCarOrderModal= function(){
      $scope.append_carOrderPerson_modal.show();
    };

    $scope.close_appendCarOrderModal= function() {
      $scope.append_carOrderPerson_modal.hide();
    };
    /*** bind apeend_carOrderPerson_modal ***/

    //提交车险方案
    $scope.apply=function() {
      var selected_price = null;
      var order = $scope.order;
      order.prices.map(function (price, i) {
        if (price.checked == true)
          selected_price = price;
      });

      //TODO:绑定投保人
           $http({
            method: "POST",
            url: Proxy.local() + "/svr/request",
            headers: {
              'Authorization': "Bearer " + $rootScope.access_token
            },
            data: {
              request: 'applyCarOrderPrice',
              info: {
                price: selected_price
              }
            }


      }).then(function (res) {
        var json = res.data;
        if (json.re == 1) {
          alert("dicount="+selected_price.discount);
          return $http({
            method: "POST",
            url: Proxy.local() + "/svr/request",
            headers: {
              'Authorization': "Bearer " + $rootScope.access_token
            },
            data: {
              request: 'updateInsuranceCarOrder',
              info: {
                orderId:$scope.order.orderId,
                fields:{
                  insurerId:31,
                  companyId:selected_price.companyId,
                  discount:selected_price.discount,
                  benefit:selected_price.benefit,
                  insuranceFeeTotal:selected_price.insuranceFeeTotal,
                  contractFee:selected_price.contractFee,
                  commission:selected_price.commission,
                  score:selected_price.score,
                  exchangeMoney:selected_price.exchangeMoney,
                  orderDate:new Date()
                }
              }
            }
          });

        }
      }).then(function(res) {
        var json=res.data;
        if(json.re==1) {
          $state.go('tabs.dashboard');
        }
      }).catch(function (err) {
        var str = '';
        for (var field in err)
          str += err[field];
        console.error('erro=\r\n' + str);
      });

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
              var json = res.data;
              var carInfo=json.data;
              $state.go('car_insurance',{carInfo:JSON.stringify(carInfo)});
            }
          })
        }
      })

    }


  });

