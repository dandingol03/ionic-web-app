/**
 * Created by danding on 16/9/6.
 */
angular.module('starter')

  .controller('loginController',function($scope,$state,$ionicLoading,$http
    ,$ionicPopup,$timeout,$cordovaFileTransfer,$ionicActionSheet,$cordovaCamera){



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

      $http({
        method:"POST",
        data:"grant_type=password&password=" + $scope.user.password + "&username=" + $scope.user.username,
        url:"/login",
        headers: {
          'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
          'Content-Type': 'application/x-www-form-urlencoded'
        }

      }).success(function(response){
        console.log('login success');
      }).error(function(err){
        console.log('error');
      });


      if(window.cordova!==undefined&&window.cordova!==null)
      {
        var url='http://211.87.225.197:3000/get/photo/home.jpg';
        var targetPath=cordova.file.externalRootDirectory+'home.jpg';
        $cordovaFileTransfer.download(url, targetPath, {}, true)
          .then(function(result) {
            alert('home图片');
            // Success!
          }, function(err) {
            var str='';
            for(var field in err)
              str+=err[field]+'\n';
            alert('error='+str);
            // Error
          }, function (progress) {
          });
      }


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

    //添加照片

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

    $scope.uploadCarAndOwnerInfo=function()
    {
        $http.get('')
    }



  });
