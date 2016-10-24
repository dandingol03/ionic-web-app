/**
 * Created by apple-1 on 2016/10/24.
 */
angular.module('starter')
  .controller('contact_informationController',function($scope,$state,$http,$rootScope,$ionicPopup){


  $scope.search=function() {
  $http({
    method: "POST",
    url: "/proxy/node_server/svr/request",
    headers: {
      'Authorization': "Bearer " + $rootScope.access_token
    },
    data: {
      request: 'getPersonInfo',
      info: {
        personId: $scope.personId
      }
    }
  }).then(function (res) {
    if (res.data !== undefined && res.data !== null) {
      $scope.data = res.data;
    }
    else {
    }
    return true;
  }).then(function (res) {

    $scope.contactions[0].name = $scope.data.data[0].mobilePhone;
    $scope.contactions[1].name = $scope.data.data[0].EMAIL;
    $scope.contactions[2].name = $scope.data.data[0].perAddress;
  }).catch(function (err) {
    console.log('server fetch error');
  });
}
    $scope.search();

    $scope.updateInfo=function(type) {
      $scope.data = {};
      switch (type){
        case 'telephone':
          $scope.data.type='mobilePhone';
          break;
        case 'address':
          $scope.data.type='perAddress';
          break;
        case 'email':
          $scope.data.type='EMAIL';
          break;

        default :
          break;

      }
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.info">',
        title: '请输入修改信息：',
        subTitle: 'Please input your new message!',
        scope: $scope,
        buttons: [
          { text: '取消' },
          {
            text: '<b>保存</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.info) {
                //不允许用户关闭，除非他键入wifi密码
                e.preventDefault();
              } else {

                $http({
                  method: "POST",
                  url: "/proxy/node_server/svr/request",
                  headers: {
                    'Authorization': "Bearer " + $rootScope.access_token
                  },
                  data: {
                    request: 'updatePersonInfo',
                    info:{
                      personId:$scope.personId,
                      data:$scope.data
                    }
                  }
                }).then(function (res) {
                  $scope.search();
                  return true;
                }).catch(function (err) {
                  console.log('server fetch error');

                });

              }
            }
          },
        ]
      });

      myPopup.then(function(res) {
        console.log('Tapped!', res);
      });

    };

    $scope.go_back=function(){
      window.history.back();
    };

    $scope.go_to=function(state){
      $state.go(state);
    };

    $scope.contactions={};
    $scope.contactions=[//应该从服务器取
      {type:'telephone',name:''},
      {type:'email',name:''},
      {type:'address',name:''}
    ];


  })
