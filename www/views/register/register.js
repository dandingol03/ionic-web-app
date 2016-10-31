/**
 * Created by yiming on 16/10/27.
 */
/**
 * Created by danding on 16/9/6.
 */
angular.module('starter')

  .controller('registerController',function($scope,$state,$ionicLoading,$http,$ionicPopup,$timeout,$rootScope
    ,$cordovaFile,$cordovaFileTransfer,$ionicActionSheet,$cordovaCamera,Proxy
    ){


    $scope.userInfo={};
    $scope.code=0;

    $scope.validate=function(item,field,pattern) {
      if(pattern!==undefined&&pattern!==null)
      {
        var reg=eval(pattern);
        var re=reg.exec(item[field]);
        if(re!==undefined&&re!==null)
        {
          item[field+'_error']=false;
        }
        else{
          item[field+'_error']=true;
        }
      }
    };



    $scope.getCode=function () {
      $http({
        method:"GET",
        url:Proxy.remote()+'/securityCode?'+"phoneNum=" + $scope.userInfo.mobile,
        headers: {
          'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
          'Content-Type': 'application/x-www-form-urlencoded'
        }

      }).then(function(res) {
        var json=res.data;
        if(json.re==1){
          $scope.code=json.data;
          alert('验证码='+$scope.code);
        }
        else{
          alert('error=\r\n'+json.data);
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





  });
