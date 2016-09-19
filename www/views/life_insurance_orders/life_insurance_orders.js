angular.module('starter')

  .controller('lifeInsuranceOrdersController',function($scope,$state,$http, $location,$rootScope){

    $scope.go_back=function(){
      window.history.back();
    }

    $scope.goto=function(url){
      $location.path(url);
    };

    $scope.tabIndex=0;
    $scope.tab_change=function(i){
      $scope.tabIndex=i;
    }

    $scope.plans=[];



    $scope.test=function(){
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
        $scope.plans=res.data;


      }).catch(function(err) {
        var str='';
        for(var field in err)
          str+=err[field];
        console.log('error=\r\n'+str);
      });

    };


    $scope.test();


  });
