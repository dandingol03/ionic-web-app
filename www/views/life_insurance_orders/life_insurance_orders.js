angular.module('starter')

/**
 * 本页面不开启缓存
 */
  .controller('lifeInsuranceOrdersController',function($scope,$state,$http,
                                                       $location,$rootScope,$stateParams){

    $scope.go_back=function(){
      window.history.back();
    }

    if($stateParams.tabIndex!==undefined&&$stateParams.tabIndex!==null&&$stateParams.tabIndex!='')
      $scope.tabIndex = parseInt($stateParams.tabIndex);
    else
      $scope.tabIndex=0;
    $scope.tab_change=function(i){
      $scope.tabIndex=i;
    }

    $scope.toggle=function (item,field) {
      if(item[field]!=true)
        item[field]=true;
      else
        item[field]=false;
    }

    $scope.orders=[];
    $scope.plans=[];


    $scope.goDetail=function(plan){
      $state.go('lifePlanDetail',{plan:JSON.stringify(plan)});
    }


    //获取估价方案
    if($rootScope.lifeInsurance!==undefined&&$rootScope.lifeInsurance!==null
      &&$rootScope.lifeInsurance.plans!==undefined&&$rootScope.lifeInsurance.plans!==null)
    {
      $scope.plans=$rootScope.lifeInsurance.plans;
    }else{
      $http({
        method: "POST",
        url: "/proxy/node_server/svr/request",
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
        console.log('error=\r\n'+str);
      });
    }



    $scope.test();
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
          data: {
            request: 'userUpdateLifeOrder',
            info: {
              orderId: $rootScope.lifeInsurance.orderId,
              plans: plans
            }
          }
        })
      } else {//如果未产生如何改动
        $http({
          method: "POST",
          url: "/proxy/node_server/svr/request",
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token
          },
          data: {
            request: 'userApplyUnchangedLifeOrder',
            info: {
              orderId: $rootScope.lifeInsurance.orderId,
              planIds: planIds
            }
          }
        }).then(function (json) {
          if (json.re == 1) {
            //TODO:取消保存的寿险方案列表,从服务器获取寿险方案列表时匹配userSelect字段


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
