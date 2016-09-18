/**
 * Created by apple-1 on 16/9/13.
 */
angular.module('starter')
  .controller('uploadPhotoController',function($scope,$state,$http,$rootScope,$ionicActionSheet,
                                               $cordovaFileTransfer,$cordovaFile,$cordovaCamera,$cordovaImagePicker){

    $scope.picture='ionic.jpg';
    $scope.go_back=function(){
      window.history.back();
    };
    $scope.title="上传证件";

    $scope.certificates={};
    $scope.certificates=[//应该从服务器取
      {type:'perIdCard',name:'jinx',age:33,id:1234567},
      {type:'driverCard',name:'obama',age:13,id:342424},
      {type:'drivingLicense',name:'lacs',age:23,id:5352234}
    ];

    $scope.image={};

    //1.附件,通过图库
    $scope.pickImage=function(img_type){
      var options = {
        maximumImagesCount: 1,
        width: 800,
        height: 800,
        quality: 80
      };

      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          $scope.image[img_type]=results[0];
          alert('img url=' + results[0]);
        }, function (error) {
          alert("error="+error);
          // error getting photos
        });
    };

    //2.附件,通过照片
    $scope.takePhoto=function(img_type){
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.PNG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation:true
      };

      $cordovaCamera.getPicture(options).then(function(imageURI) {
        $scope.image[img_type] = imageURI;
        alert('image url=' + $scope.image[img_type]);
      }, function(err) {
        // error
      });
    };




    //添加附件
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



    //上传照片
    //1.img_type:enum
    //=>perIdCard,perDriver,carLicense
    $scope.uploadCertificate=function(imgName) {
      var absPath = $scope.image[imgName];
      alert('path=\r\n' + absPath);
      var type='';
      if(absPath.indexOf('.jpg')!=-1)
        type='jpg';
      else if(absPath.indexOf('.png')!=-1)
        type='png';
      else{}
      var server='http://192.168.1.102:3000/svr/request?request=uploadPhoto&imageName='+imgName+'&imageType='+type;
      var options = {
        fileKey:'file',
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        }
      };

      $cordovaFileTransfer.upload(server, $scope.image[img_type], options)
        .then(function(result) {
          // Success!
          alert('upload success');
        }, function(err) {
          var str='';
          for(var field in err)
            str+=field+':'+err[field];
          alert('encounter error=====\r\n'+str);
        }, function (progress) {
          // constant progress updates
        });


      //$cordovaFile.readAsBinaryString(cordova.file.externalRootDirectory, $scope.picture)
      //  .then(function (success) {
      //    alert('content of image=' + success);
      //    carInfo.carPhoto = success;
      //    carInfo.ownerIdPhoto = success;
      //    $http({
      //      method: "POST",
      //      url: "/proxy/node_server/svr/request",
      //      headers: {
      //        'Authorization': "Bearer " + access_token,
      //      },
      //      data: {
      //        request: 'uploadCertificate',
      //        info: carInfo
      //      }
      //    }).
      //      success(function (response) {
      //        console.log('success');
      //      }).
      //      error(function (err) {
      //        var str = '';
      //        for (var field in err)
      //          str += field + ':' + err[field];
      //        console.log('error=' + str);
      //      });
      //  }, function (error) {
      //    // error
      //    var err = '';
      //    for (var field in error)
      //      err += field + ':' + error[field];
      //    alert('error=' + err);
      //  });


    }
  });
