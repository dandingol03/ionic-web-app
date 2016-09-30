/**
 * Created by danding on 16/9/6.
 */
angular.module('starter')

  .controller('chatterController',function($scope,$http,$rootScope){


    //搜索可用聊天客服
    $http({
      method: "post",
      url: "http://192.168.1.106:3000/svr/request",
      headers: {
        'Authorization': "Bearer " + $rootScope.access_token,
      },
      data:
      {
        request:'searchFreeServicePerson'
      }
    }).then(function(res) {
      var json=res.data;
      if(json.re==1) {
        console.log('...');
      }
    }).catch(function(err) {
      var str='';
      for(var field in err)
        str+=err[field];
      console.error('err=\r\n' + str);
    });

    $scope.messages=[
      {
        userId: '534b8e5aaa5e7afc1b23e69b',
        date: new Date(),
        text: 'Lorem ipsum dolor sit amet, ' +
        'consectetur adipiscing elit, ' +
        'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      },
      {
        userId: '134b8e5aa53e2afc1b23e78b',
        date: new Date(),
        text: 'i hate this guy, tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'
      }];

    $scope.input={

    };

    $scope.sendMsg=function(){
      if($scope.input.message!==undefined&&$scope.input.message!==null)
      {
        $http({
          method: "post",
          url: "http://192.168.1.106:3000/svr/request",
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token,
          },
          data:
          {
            request:'pushTextMsg',
            info:{
              msg:$scope.input.message,
              type:'customer'
            }
          }
        })
      }
    }


    $scope.viewProfile=function(msg){
      console.log('...');
    }


  });
