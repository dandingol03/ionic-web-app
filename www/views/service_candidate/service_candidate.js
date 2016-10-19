/**
 * Created by yiming on 16/10/5.
 */
/**
 * Created by yiming on 16/9/13.
 */
angular.module('starter')

  .controller('serviceCandidateController',function($scope,$stateParams,
                                                    $http,$rootScope,$ionicPopup){

    $scope.confirms=$rootScope.waitConfirms;

    if(Object.prototype.toString.call($scope.confirms)=='[object String]')
      $scope.confirms = JSON.parse($scope.confirms);

    $scope.select=function(item,cluster) {
      item.checked=true;
      cluster.map(function(candidate,i) {
        if(candidate.unitName!=item.unitName)
          candidate.checked=false;
      })
    };

    $scope.popup=function(item){
      var tpl='<div><span>联系电话:</span><span>'+item.mobile+'</span></div>'
      var  confirmCandidatePopup = $ionicPopup.confirm({
        title: '确认选择该家维修厂作为服务人员',
        template: tpl
      });
      confirmCandidatePopup.then(function(res) {
        if(res) {
            //TODO:
        }else{}
      })
    }

    $scope.go_back=function(){
      window.history.back();
    };

  });
