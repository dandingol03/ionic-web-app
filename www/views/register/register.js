/**
 * Created by yiming on 16/10/27.
 */
/**
 * Created by danding on 16/9/6.
 */
angular.module('starter')

  .controller('registerController',function($scope,$state,$ionicLoading,$http,$ionicPopup,$timeout,$rootScope
    ,$cordovaFile,$cordovaFileTransfer,$ionicActionSheet,$cordovaCamera,Proxy
    ,$WebSocket,ModalService){


    $scope.userInfo={};
    $scope.code=0;



    $scope.getCode=function () {
      $http({
        method:"GET",
        url:Proxy.local()+'/securityCode?'+"phoneNum=" + $scope.userInfo.mobile,
        headers: {
          'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
          'Content-Type': 'application/x-www-form-urlencoded'
        }

      }).then(function(res) {
        var json=res.data;
        if(json.re==1){
          $scope.code=json.data;
          alert('验证码='+code);
        }
        else{
          alert('验证码发送失败');
        }

      })
    }


    $scope.register=function(){
      if($scope.code==$scope.userInfo.code){
        $http({
          method:"POST",
          url:Proxy.local()+'/register?'+'username='+$scope.userInfo.username+'&&password='+$scope.userInfo.password+'&&mobilePhone='+$scope.userInfo.mobile,
          headers: {
            'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
            'Content-Type': 'application/x-www-form-urlencoded'
          }

        }).then(function(res) {
          var json = res.data;
          if(json.re==1){
            alert('注册成功');
            $state.go('login');
          }
          else{
            alert('注册失败');
          }
        })
      }
      else{
        alert('手机验证码输入错误');
      }

    }




    $scope.baidu=function(){
      $http({
        method:'GET',
        url:"/proxy/send",
        headers:{
          'Access-Control-Allow-Origin':'*'
        }}).
      success(function (response) {
        console.log('success');
      }).error(function(err) {
        console.log('...');
      });
    }


  });
