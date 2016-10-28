/**
 * Created by danding on 16/9/6.
 */
angular.module('starter')

  .controller('loginController',function($scope,$state,$ionicLoading,$http,$ionicPopup,$timeout,$rootScope
    ,$cordovaFile,$cordovaFileTransfer,$ionicActionSheet,$cordovaCamera,Proxy
      ,$WebSocket,ModalService){



    $scope.formUser = {};

    $scope.user={};

    $WebSocket.registeCallback(function(msg) {
      console.log('//-----ws\r\n' + msg);
    });

    /**
     * websocket测试
     */
    //$WebSocket.connect();



//*******************测试百悟短信验证码*********************//

    $scope.baiwu = function(){

      $http({
        method:'POST',
        url:"/proxy/send",
        headers:{
          'Content-Type':'application/json'
        },
        data:{  corp_id:'hy6550',
          corp_pwd:'mm2289',
          corp_service:'1069003256550',
          mobile:'18253160627',
          msg_content:'hello,xyd',
          corp_msg_id:'',
          ext:'' // your data” }
        }}).
      success(function (response) {
        console.log('success');
      }).
      error(function (err) {
        var str='';
        for(var field in err)
          str+=field+':'+err[field];
        console.log('error='+str);
      });
    }


//*******************测试百悟短信验证码*********************//





    $scope.securityCode_generate=function(){

      $http.get('/securityCode?cellphone='+$scope.user.username,{
        headers:{
          'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function(res) {
        console.log('scurity code generated');
      }).catch(function (err) {
        var error='';
        for(var field in err) {
          error+=field+':'+err[field]+'\r\n';
        }
        alert('error=' + error);
      });
    };

    $scope.insuranceder={};

    $scope.initModal=function() {
      ModalService.initModal($scope,$scope.insuranceder);
    }

    $scope.openModal=function(){
      $scope.insuranceder.modal.show();
    }


    //注册
    $scope.goRegister = function(){
      $state.go('register');
    }






    $scope.doLogin=function(){
      if($rootScope.registrationId==undefined||$rootScope.registrationId==null||$rootScope.registrationId=='')
      {

        if(window.plugins!==undefined&&window.plugins!==null) {
          try {
            window.plugins.jPushPlugin.getRegistrationID($rootScope.onGetRegistradionID);
            $scope.login();
          } catch (e) {
            alert(e);

          }
        }
        else{
          $scope.login();
        }
      }else{
        $scope.login();
      }
    }


    //登录
    $scope.login = function(){

      $http({
        method:"POST",
        data:"grant_type=password&password=" + $scope.user.password + "&username=" + $scope.user.username,
        url:Proxy.local()+'/login',
        headers: {
          'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
          'Content-Type': 'application/x-www-form-urlencoded'
        }


      }).then(function(res){

        var json=res.data;
        var access_token=json.access_token;
        //send login message to server
        //$WebSocket.send({
        //  action:'login',
        //  msgid:$WebSocket.getMsgId(),
        //  timems:new Date(),
        //  token:access_token
        //  });
        if(access_token!==undefined&&access_token!==null)
        {
          $rootScope.access_token=access_token;
          if(window.cordova!=undefined && window.cordova!=null) {
          }
          alert('registrationId=\r\n' + $rootScope.registrationId);
          return  $http({
              method: "POST",
              url: Proxy.local()+"/svr/request",
              headers: {
                'Authorization': "Bearer " + $rootScope.access_token
              },
              data: {
                request: 'activatePersonOnline',
                info:{
                  registrationId:$rootScope.registrationId!==undefined&&$rootScope.registrationId!==null?$rootScope.registrationId:''
                }
            }
          });
        }
        else
          return ({re: -1});
      }).then(function(res) {
        var json=res.data;
        if(json.re==1||json.result=='ok')
        {
          $state.go('tabs.dashboard');
        }
      }).catch(function(err){
        var error='';
        for(var field in err)
        {
          error+=err[field]+'\r\n';
        }
        alert('error=' + error);
      });

    }

    $scope.doSend=function(){
      $WebSocket.send({
        action:'msg',
        msgid:$WebSocket.getMsgId(),
        timems:new Date(),
        msg:'first message',
        to:{
          groupid:'presale'
        }
      });
    }


    //文件下载
    $scope.download=function(){
      var url='http://192.168.0.199:9030/get/photo/home.jpg';
      var targetPath=cordova.file.documentsDirectory + "home.jpg";
      var trustHosts = true;
      var options = {};
      $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
        .then(function(result) {
          alert('success');
        }, function(err) {
          // Error
          alert('error');
        }, function (progress) {
          $timeout(function () {
            $scope.downloadProgress = (progress.loaded / progress.total) * 100;
          });
        });
    }


    //文件上传
    $scope.upload=function(){
      var server='http://192.168.0.199:9030/upload/photo/image.jpg';
      var options = {};
      options.fileKey = "file";
      $cordovaFileTransfer.upload(server, $scope.photo, options)
        .then(function(result) {
          // Success!
          alert('upload success');
        }, function(err) {
          // Error
          alert('encounter error');
        }, function (progress) {
          // constant progress updates
        });
    }



    $scope.test=function() {
      $http.get("http://202.194.14.106:3000/insurance/get_lifeinsurance_list").
      then(function(res) {
        if(res.data!==undefined&&res.data!==null)
        {
          var life_insurances=res.data.life_insurances;
          if(Object.prototype.toString.call(life_insurances)!='[object Array]')
            life_insurances=JSON.parse(life_insurances);
          life_insurances.map(function(insurance,i) {
            alert(insurance);
          });
        }
      }).catch(function(err) {
        alert('err=' + err);
      });

    }

    //拍照
    $scope.addPicture = function(type) {

      $ionicActionSheet.show({
        buttons: [
          { text: '拍照' },
          { text: '从相册选择' }
        ],
        titleText: '选择照片',
        cancelText: '取消',
        cancel: function() {
          return true;
        },
        buttonClicked: function(index) {
          if(index == 0){

            var options = {
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: 1,
              saveToPhotoAlbum: true
            };


          }else if(index == 1){
            var options = {
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: 0
            };
          }

          $cordovaCamera.getPicture(options).then(function(imageURI) {
            $scope.photo= imageURI;
            alert('url of photo =\r\n' + imageURI);
          }, function(err) {
            // error
            alert('errpr=' + err);
          });
          return true;
        }
      });
    }

    $scope.uploadPhoto=function(){

      $cordovaFileTransfer.upload(server, $scope.photo,options)
        .then(function(result) {
          var response=result.response;
          var json=eval('('+response+')');
          if(json.type!==undefined&&json.type!==null)
          {
            $ionicLoading.show({
              template: json.content,
              duration: 2000
            });
            //TODO:将本用户更新照片的消息通过websocket发送给其他用户

          }else{
            $ionicLoading.show({
              template: "field type doesn't exist in response",
              duration: 2000
            });
          }

        }, function(err) {
          // Error
          alert("err:"+err);
        }, function (progress) {
          // constant progress updates
        });

    }


    $scope.uploadCarAndOwnerInfo=function()
    {
      $http.get("http://localhost:9030/insurance/get_lifeinsurance_list",
        {
          data:
          {
            request:'uploadCarAndOwnerInfo',
            info:
            {
              carPhoto:$scope.photo,
              ownerIdPhoto:$scope.photo
            }
          }
        }).
      then(function(res) {
        if(res.data!==undefined&&res.data!==null)
        {
          var life_insurances=res.data.life_insurances;
          if(Object.prototype.toString.call(life_insurances)!='[object Array]')
            life_insurances=JSON.parse(life_insurances);
          life_insurances.map(function(insurance,i) {
            alert(insurance);
          });
        }
      }).catch(function(err) {
        alert('err=' + err);
      });
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
