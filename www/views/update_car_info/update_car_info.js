/**
 * Created by apple-1 on 16/9/13.
 */
angular.module('starter')
  .controller('updateCarInfoController',function($scope,$state,$http,$rootScope,$ionicActionSheet,
                                               $cordovaFileTransfer,$cordovaFile,
                                                 $cordovaCamera,$cordovaImagePicker,Proxy,
                                                 $ionicModal,ionicDatePicker){


    $scope.go_back=function(){
      window.history.back();
    };

    $scope.carInfo={};

    //查询已绑定车辆,并显示车牌信息
    $scope.selectCarInfoByCarNum=function(item){
      $http({
        method: "POST",
        url: Proxy.local()+"/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        },
        data:
        {
          request:'fetchInsuranceCarInfoByCustomerId'
        }
      }).then(function(res) {
        var json=res.data;
        if(json.re==1) {
          var cars=json.data;
          var buttons=[];
          cars.map(function(car,i) {
            var ele=car;
            ele.text='<b>'+car.carNum+'</b>';
            buttons.push(ele);
          });
          var carSheet = $ionicActionSheet.show({
            buttons: buttons,
            titleText: '<b>选择车辆信息</b>',
            cancelText: 'Cancel',
            cancel: function() {
              // add cancel code..
            },
            buttonClicked: function(index) {
              if(index==0) {
                //TODO:create new car info
                $state.go('update_car_info');
              }else{
                var car=cars[index-1];
                if(item!==undefined&&item!==null)
                {
                  item.carId=car.carId;
                }else{
                  $scope.carInfo.carNum=car.carNum;
                  $scope.carInfo.ownerName=car.ownerName;
                  $scope.carInfo.ownerIdCard=car.ownerIdCard;
                  $scope.carInfo.issueDate=car.issueDate;
                  $scope.carInfo.factoryNum=car.factoryNum;
                  $scope.carInfo.engineNum=car.engineNum;
                  $scope.carInfo.frameNum=car.frameNum;
                }
              }
              return true;
            },
            cssClass:'center'
          });
        }
      }).catch(function(err) {
        var str='';
        for(var field in err)
          str+=err[field];
        console.error('error=\r\n' + str);
      });
    }


    $scope.postCarInfo=function(){
      $http({
        method: "POST",
        url: Proxy.local()+"/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        },
        data:
        {
          request:'uploadCarAndOwnerInfo',
          info:$scope.carInfo
        }
      }).
        then(function (res) {
          var json=res.data;
          if(json.re==1) {
            console.log('update carInfo completely');
          }
        });
    }

    /*** show demo modal ***/
    $ionicModal.fromTemplateUrl('/views/modal/show_demo_modal.html',{
      scope:  $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.show_demo_modal = modal;
    });

    $scope.openDemoModal= function(){
      $scope.show_demo_modal.show();
    };

    $scope.closeDemoModal= function() {
      $scope.show_demo_modal.hide();
    };
    /*** show demo modal ***/

    /*** show demo modal1 ***/
    $ionicModal.fromTemplateUrl('/views/modal/show_demo_modal1.html',{
      scope:  $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.show_demo_modal1 = modal;
    });

    $scope.openDemoModal1= function(){
      $scope.show_demo_modal1.show();
    };

    $scope.closeDemoModal1= function() {
      $scope.show_demo_modal1.hide();
    };
    /*** show demo modal1 ***/

    /*** show demo modal2 ***/
    $ionicModal.fromTemplateUrl('/views/modal/show_demo_modal2.html',{
      scope:  $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.show_demo_modal2 = modal;
    });

    $scope.openDemoModal2= function(){
      $scope.show_demo_modal2.show();
    };

    $scope.closeDemoModal2= function() {
      $scope.show_demo_modal2.hide();
    };
    /*** show demo modal2 ***/

    /*** show demo modal3 ***/
    $ionicModal.fromTemplateUrl('/views/modal/show_demo_modal3.html',{
      scope:  $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.show_demo_modal3 = modal;
    });

    $scope.openDemoModal3= function(){
      $scope.show_demo_modal3.show();
    };

    $scope.closeDemoModal3= function() {
      $scope.show_demo_modal3.hide();
    };
    /*** show demo modal3 ***/
    $scope.showDemoPicture = function() {
      if ($scope.isShowPicture == true) {
        $scope.openDemoModal();
      };
    };
    $scope.showDemoPicture1 = function() {
      if ($scope.isShowPicture1 == true) {
        $scope.openDemoModal1();
      };
    };
    $scope.showDemoPicture2 = function() {
      if ($scope.isShowPicture2 == true) {
        $scope.openDemoModal2();
      };
    };
    $scope.showDemoPicture3 = function() {
      if ($scope.isShowPicture3 == true) {
        $scope.openDemoModal3();
      };
    };
    $scope.isShowPicture = false;
    $scope.isShowPicture1 = false;
    $scope.isShowPicture2 = false;
    $scope.isShowPicture3= false;
    $scope.setIsShowPicture = function(){
      $scope.isShowPicture = true;
      $scope.showDemoPicture();
    };
    $scope.setIsShowPicture1 = function(){
      $scope.isShowPicture1 = true;
      $scope.showDemoPicture1();
    };
    $scope.setIsShowPicture2 = function(){
      $scope.isShowPicture2 = true;
      $scope.showDemoPicture2();
    };
    $scope.setIsShowPicture3 = function(){
      $scope.isShowPicture3 = true;
      $scope.showDemoPicture3();
    };


    $scope.datepick = function(item,field){
      var ipObj1 = {
        callback: function (val) {  //Mandatory

          var date=new Date(val);
          var month=parseInt(date.getMonth())+1;
          item[field]=date.getFullYear()+'-'+month+'-'+date.getDate();
        },
        disabledDates: [            //Optional
          new Date(2016, 2, 16),
          new Date(2015, 3, 16),
          new Date(2015, 4, 16),
          new Date(2015, 5, 16),
          new Date('Wednesday, August 12, 2015'),
          new Date("08-16-2016"),
          new Date(1439676000000)
        ],
        from: new Date(1949, 10, 1), //Optional
        to: new Date(2040, 10, 30), //Optional
        inputDate: new Date(),      //Optional
        mondayFirst: false,          //Optional
        disableWeekdays: [0],       //Optional
        closeOnSelect: false,       //Optional
        templateType: 'popup'     //Optional
      };
      ionicDatePicker.openDatePicker(ipObj1);
    };




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



  });
