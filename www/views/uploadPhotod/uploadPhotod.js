/**
 * Created by apple-1 on 16/9/13.
 */
angular.module('starter')
  .controller('uploadPhotodController',function($scope,$state,$http,$rootScope,$ionicActionSheet,$cordovaFileTransfer,$cordovaFile,$cordovaCamera,$cordovaImagePicker){

    $scope.picture='ionic.jpg';
    $scope.go_back=function(){
      window.history.back();
    };
    $scope.title="上传证件";

    $scope.certificates={};
    $scope.certificates=[//应该从服务器取
      {typeName:'身份证',name:'jinx',age:33,id:1234567},
      {typeName:'驾驶证',name:'obama',age:13,id:342424},
      {typeName:'户口本',name:'lacs',age:23,id:5352234}
    ];



    $scope.addAttachment=function(img_type)
    {
      $ionicActionSheet.show({
        buttons: [
          {text:'图库'},
          {text:'拍照'}
        ],
        cancelText: '关闭',
        cancel: function() {
          return true;
        },
        buttonClicked: function(index) {

          switch (index){
            case 0:
              $scope.pickImage(img_type);
              break;
            case 1:
              $scope.takePhoto(img_type);
              break;
            default:
              break;
          }
          return true;
        }
      });
    }


    $scope.uploadCertificate=function() {
      $cordovaFile.readAsBinaryString(cordova.file.externalRootDirectory, $scope.picture)
        .then(function (success) {
          alert('content of image=' + success);
          carInfo.carPhoto = success;
          carInfo.ownerIdPhoto = success;
          $http({
            method: "POST",
            url: "/pm/svr/request",
            headers: {
              'Authorization': "Bearer " + access_token,
            },
            data: {
              request: 'uploadCertificate',
              info: carInfo
            }
          }).
            success(function (response) {
              console.log('success');
            }).
            error(function (err) {
              var str = '';
              for (var field in err)
                str += field + ':' + err[field];
              console.log('error=' + str);
            });
        }, function (error) {
          // error
          var err = '';
          for (var field in error)
            err += field + ':' + error[field];
          alert('error=' + err);
        });
    }
  });
