angular.module('starter')

/**
 * 本页面不开启缓存
 */
  .controller('lifeInsuranceOrdersController',function($scope,$state,$http,
                                                       $location,$rootScope,$stateParams,
                                                       $ionicPopup,Proxy){

    $scope.changedState= false;

    if($rootScope.lifeInsurance!==undefined&&$rootScope.lifeInsurance!==null
      &&$rootScope.lifeInsurance.plans!==undefined&&$rootScope.lifeInsurance.plans!==null)
    {
      var plans=$rootScope.lifeInsurance.plans;
      plans.map(function (plan, i){
        if(plan.modified==true&plan.checked==true){
          $scope.changedState=true;
        }
      });
    }



    $scope.go_back=function(){
      window.history.back();

    }


    $scope.tab_change=function(i){
      $scope.tabIndex=i;
    }

    $scope.go_back=function(){
      window.history.back();
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


    $scope.goDetail=function(order){
      $state.go('life_plan',{order:JSON.stringify(order)});
    }


    //获取寿险订单
    if($rootScope.lifeInsurance!==undefined&&$rootScope.lifeInsurance!==null
      &&$rootScope.lifeInsurance.orders!==undefined&&$rootScope.lifeInsurance.orders!==null)
    {
      $scope.orders=$rootScope.lifeInsurance.orders;
    }else{
      $http({
        method: "POST",
        url: Proxy.local()+'/svr/request',
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        },
        data:
        {
          request:'getLifeOrders',
        }
      }).then(function(res) {
        var json=res.data;
        if(json.re==1){
          $scope.orders=json.data;
          $scope.orders.map(function(order,i) {
            if(order.orderState==3||order.orderState==3){
              $scope.pricingOrders.push(order);
            }
            if(order.orderState==5){
              $scope.finishOrders.push(order);
            }
          })
        }
      })
    }





    //获取估价方案
    if($rootScope.lifeInsurance!==undefined&&$rootScope.lifeInsurance!==null
      &&$rootScope.lifeInsurance.plans!==undefined&&$rootScope.lifeInsurance.plans!==null)
    {
      $scope.plans=$rootScope.lifeInsurance.plans;
    }else{
      $http({
        method: "POST",
        url: Proxy.local()+'/svr/request',
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        },
        data:
        {
          request:'getOrderPlan',
          orderId:1
        }
      }).then(function(res) {
        $scope.plans=res.data.data;

        var data=res.data.data;
        var plans=[];
        data.map(function(plan,i) {
          var main=null;
          var additions=[];
          plan.items.map(function(proj,j) {
            if(proj.ownerId!==undefined&&proj.ownerId!==null)
              additions.push(proj);
            else
              main=proj;
          })
          plan.main=main;
          plan.additions=additions;
          plans.push(plan);
        });

        $scope.plans=plans;
        if($rootScope.lifeInsurance==undefined||$rootScope.lifeInsurance==null)
          $rootScope.lifeInsurance={};
        $rootScope.lifeInsurance.plans=plans;
      }).catch(function(err) {
        var str='';
        for(var field in err)
          str+=err[field];
        console.error('error=\r\n'+str);
      });
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
          url: Proxy.local()+"/svr/request",
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
          url: Proxy.local()+"/svr/request",
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

    //tabIndex选定
    if($stateParams.tabIndex!==undefined&&$stateParams.tabIndex!==null&&$stateParams.tabIndex!='')
      $scope.tabIndex = parseInt($stateParams.tabIndex);
    else
    {
        $scope.tabIndex=1;
    }

  });
