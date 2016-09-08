/**
 * Created by apple-2 on 16/8/23.
 */
angular.module('starter')
  .controller('myController',function($scope,$state,$http){

    $scope.go_back=function(){
      window.history.back();
    };

    $scope.go_to=function(state){
      $state.go(state);
    };

    $scope.infos=[];

    $http.get("http://202.194.14.106:9030/insurance/my_pageinfo")
      .then(function(response) {
        var data=response.data;
        if(data.infos!==undefined&&data.infos!==null)
        {
          var infos=data.infos;
          if(Object.prototype.toString.call(infos)!='[object Array]')
            infos=JSON.parse(infos);
          $scope.infos=infos;
        }
      });



  });
