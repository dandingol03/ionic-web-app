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


    $scope.toggle=function (item,field) {
      if(item[field]!=true)//勾选
      {
        item[field]=true;
        if(field=='checked')
        {
          $scope.changedState=true;
        }
      }
      else
      {
        item[field]=false;

        if(field=='checked')
        {

        }

        if(field=='checked')
        {
          var flag=false;
          $scope.plans.map(function(plan,i) {
            if(plan.checked==true&&plan.modified==true)
              flag=true;
          });
          if(!flag)
            $scope.changedState=false;
        }
      }

    }

    $scope.orders=[];
    $scope.pricingOrders=[];
    $scope.unPaidOrders=[];
    $scope.finishOrders=[];
    $scope.plans=[];


    $scope.goDetail=function(plan){
      $state.go('lifePlanDetail',{plan:JSON.stringify(plan)});
    }



    //提交已选方案
    $scope.apply=function() {
      var plans = [];
      var planIds = [];
      var flag = false;
      $scope.plans.map(function (plan, i) {
        if (plan.checked == true) {
          plans.push(plan);
          planIds.push(plan.planId);
          if (plan.modified == true)
            flag = true;
        }
      });
      //如果已经进行修改
      if (flag == true) {
        $http({
          method: "POST",
          url: "/proxy/node_server/svr/request",
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token
          },
          data:
          {
            request:'userUpdateLifeOrder',
            info:{
              orderId:1,
              plans:plans
            }
          }
        }).then(function(res) {
          var json=res.data;
          console.log('...');
        }).catch(function(err) {
          var str='';
          for(var field in err)
            str+=err[field];
          console.error('error=\r\n' + str);
        });
      }else {//如果未产生如何改动

        $http({
          method: "POST",
          url: "/proxy/node_server/svr/request",
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token
          },
          data: {
            request: 'userApplyUnchangedLifeOrder',
            info: {
              orderId: 1,
              planIds: planIds
            }
          }
        }).then(function (json) {
          if (json.re == 1) {
            //TODO:取消保存的寿险方案列表,从服务器获取寿险方案列表时匹配userSelect字段
            var alertPopup = $ionicPopup.alert({
              title: '修改方案已提交',
              template: '等待后台工作人员重新报价'
            });


          }
        }).catch(function (err) {
          var str = '';
          for (var field in err)
            str += err[field];
          console.error('error=\r\n' + str);
        });
      }

    }



  });
