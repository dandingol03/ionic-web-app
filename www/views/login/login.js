/**
 * Created by danding on 16/9/6.
 */
angular.module('starter')

  .controller('loginController',function($scope,$state,$ionicLoading,$http
    ,$ionicPopup,$timeout,$cordovaFile,$cordovaFileTransfer,
    $ionicActionSheet,$cordovaCamera,$rootScope){



    $scope.formUser = {};

    var inputData = {
      grant_type: 'password',
      username: '123456789',
      password: "1234"
    };

    $scope.user={};





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


    //登录
    $scope.login = function(){

      var access_token=null;

      $http({
        method:"POST",
        data:"grant_type=password&password=" + $scope.user.password + "&username=" + $scope.user.username,
        url:"/proxy/node_server/login",
        headers: {
          'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
          'Content-Type': 'application/x-www-form-urlencoded'
        }

      }).success(function(response){

        var access_token=response.access_token;
        if(access_token!==undefined&&access_token!==null)
        {
          //var targetPath=cordova.file.externalRootDirectory+'ionic.jpg';


          var carInfo = {
            carNum : "5",
            engineNum : "2",
            frameNum : "3",
            factoryNum : "4",
            firstRegisterTime : "2016-01-01",
            ownerName : "6",
            ownerIdCard : "7",
            ownerAddress : "8",
            carPhoto: null,
            ownerIdPhoto: null
          };

          $rootScope.access_token=access_token;
          $state.go('tabs.dashboard');


          $scope.photo='';


          /**
           * $cordovaFile 读取文件
           */
          //$cordovaFile.readAsBinaryString(cordova.file.externalRootDirectory, 'ionic.jpg')
          //  .then(function (success) {
          //    alert('content of image=' + success);
          //    carInfo.carPhoto=success;
          //    carInfo.ownerIdPhoto=success;
          //    $http({
          //      method: "POST",
          //      url: "http://192.168.1.102:3000/svr/request",
          //      headers: {
          //        'Authorization': "Bearer " + access_token,
          //      },
          //      data:
          //      {
          //        request:'uploadCarAndOwnerInfo',
          //        info:carInfo
          //      }
          //    }).
          //      success(function (response) {
          //        console.log('success');
          //      }).
          //      error(function (err) {
          //        var str='';
          //        for(var field in err)
          //          str+=field+':'+err[field];
          //        console.log('error='+str);
          //      });
          //  }, function (error) {
          //    // error
          //    var err='';
          //    for(var field in error)
          //    err+=field+':'+error[field];
          //    alert('error=' + err);
          //  });




        }


      }).error(function(err){
        var error='';
        for(var field in err)
        {
          error+=err[field]+'\r\n';
        }
        alert('error=' + error);
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

    //文件下载
    $scope.download=function(){
      var url='http://192.168.0.199:9030/get/photo/home.jpg';
      var targetPath=cordova.file.externalRootDirectory + "/home.jpg";
      var trustHosts = true;
      var options = {};
      $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
        .then(function(result) {
          alert('success');
        }, function(err) {
          // Error
          var str='';
          for(var field in err)
          {
            str+=field+':'+err[field];
          }
          alert('error=====\r\n'+str);
        }, function (progress) {

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
      $http.get("http://202.194.14.106:9030/insurance/get_lifeinsurance_list").
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



  });
