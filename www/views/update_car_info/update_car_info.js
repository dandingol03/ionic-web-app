/**
 * Created by apple-1 on 16/9/13.
 */
angular.module('starter')
  .controller('updateCarInfoController',function($scope,$state,$http,$rootScope,$ionicActionSheet,
                                               $cordovaFileTransfer,$cordovaFile,
                                                 $cordovaCamera,$cordovaImagePicker,Proxy,
                                                 $ionicModal,ionicDatePicker,$ionicSlideBoxDelegate){


    $scope.licenseIndexChange=function(i) {
      $scope.licenseIndex=i;
      $ionicSlideBoxDelegate.$getByHandle('carInfo-slide').slide(i);
    };

    $scope.licenseSlideChanged=function(i){
      $scope.licenseIndex=i;

    }

    $scope.go_back=function(){
      window.history.back();
    };

    $scope.carInfo={};

    $scope.fetchRelative=function(item,field,matched) {
      $http({
        method: "POST",
        url: Proxy.local()+'/svr/request',
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        },
        data:
        {
          request:'getRelativePersons'
        }
      }).then(function(res) {
        var json=res.data;
        if(json.re==1) {
          if(json.data!=undefined&&json.data!=null){
            $scope.relatives=json.data;

            $scope.open_selectRelativeModal(item,field,matched);
          }
        }else{
          $scope.open_selectRelativeModal(item,field,matched);
        }

      }).catch(function(err) {
        var str='';
        for(var field in err)
          str+=err[field];
        console.error('error=\r\n' + str);
      });
    };


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

                var car=cars[index];
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

    $scope.selectCarInfoWithPerName=function(){
      $http({
        method: "POST",
        url: Proxy.local()+"/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        },
        data:
        {
          request:'getRelativePersons'
        }
      }).then(function(res) {
        var json=res.data;
        if(json.re==1) {
          var persons=json.data;
          var buttons=[];
          persons.map(function(person,i) {
            var ele=person;
            ele.text='<b>'+person.perName+'</b>';
            buttons.push(ele);
          });
          var personSheet = $ionicActionSheet.show({
            buttons: buttons,
            titleText: '<b>选择人员</b>',
            cancelText: 'Cancel',
            cancel: function() {
              // add cancel code..
            },
            buttonClicked: function(index) {
              var person=persons[index];
              if(person!==undefined&&person!==null) {
                $http({
                  method: "POST",
                  url: Proxy.local()+"/svr/request",
                  headers: {
                    'Authorization': "Bearer " + $rootScope.access_token
                  },
                  data:
                  {
                    request:'getCarInfoByPersonId',
                    info:{
                      personId:person.personId
                    }
                  }
                }).then(function(res) {
                  var json=res.data;
                  var cars=json.data;
                  $scope.carInfo=cars[0];

                });
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


    /***  悬浮窗  ***/
    $scope.carNumHint='hidden list';
    $scope.focusInCarNum=function(){
      $scope.carNumHint='list';
    }
    $scope.blurCarNum= function () {
      $scope.carNumHint = 'hidden list';
    }

    $scope.factoryNumHint='hidden list';
    $scope.focusInFactoryNum=function(){
      $scope.factoryNumHint='list';
    }
    $scope.blurFactoryNum=function(){
      $scope.factoryNumHint='hidden list';
    }

    $scope.engineNumHint='hidden list';
    $scope.focusInEngineNum=function(){
      $scope.engineNumHint='list';
    }
    $scope.blurEngineNum=function(){
      $scope.engineNumHint='hidden list';
    }

    $scope.frameNumHint='hidden list';
    $scope.focusInFrameNum=function(){
      $scope.frameNumHint='list';
    }
    $scope.blurFrameNum=function(){
      $scope.frameNumHint='hidden list';
    }

    $scope.slideDescriptionHint='list';
    /***  悬浮窗  ***/


    //车险行驶证框下标
    if($rootScope.dashboard.licenseIndex!==undefined&&$rootScope.dashboard.licenseIndex!==null)
      $scope.licenseIndex=$rootScope.dashboard.licenseIndex;
    else
      $scope.licenseIndex=0;


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
      }).then(function (res) {
           var json=res.data;
           if(json.re==1) {
          //
          //   var confirmPopup = $ionicPopup.confirm({
          //     title: '缺少行驶证照片',
          //     template: '请问是否选择上传行驶证',
          //     okText:'上传',
          //     cancelText:'取消'
          //   });
          //   confirmPopup.then(function(res) {
          //     if(res) {
          //       $scope.open_uploadLicenseCardModal();
          //     } else {
          //       console.log('You are not sure');
          //     }
          //   });

             $state.go('tabs.dashboard');

           }
          //
          //   console.log('update carInfo completely');


        });
    }

    /*** show demo modal ***/
    $ionicModal.fromTemplateUrl('views/modal/show_demo_modal.html',{
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
    $ionicModal.fromTemplateUrl('views/modal/show_demo_modal1.html',{
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
    $ionicModal.fromTemplateUrl('views/modal/show_demo_modal2.html',{
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
    $ionicModal.fromTemplateUrl('views/modal/show_demo_modal3.html',{
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

    /*** bind upload_licenseCard_modal***/
    $ionicModal.fromTemplateUrl('views/modal/upload_licenseCard_modal.html',{
      scope:  $scope,
      animation: 'animated '+' bounceInUp',
      hideDelay:920
    }).then(function(modal) {
      $scope.upload_licenseCard_modal = modal;
    });

    $scope.open_uploadLicenseCardModal= function(){
      $scope.upload_licenseCard_modal.show();
    };

    $scope.close_uploadLicenseCardModal= function() {
      $scope.upload_licenseCard_modal.hide();
    };
    /*** bind upload_licenseCard_modal ***/


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
    $scope.pickImage=function(item,field){
      var options = {
        maximumImagesCount: 1,
        width: 800,
        height: 800,
        quality: 80
      };

      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          item[field]=results[0];
          alert('img url=' + results[0]);
        }, function (error) {
          alert("error="+error);
          // error getting photos
        });
    };

    //2.附件,通过照片
    $scope.takePhoto=function(item,field){
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.PNG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation:true
      };

      $cordovaCamera.getPicture(options).then(function(imageURI) {
        item[field] = imageURI;
        alert('image url=' + item[field]);
      }, function(err) {
        // error
      });
    };

    //添加附件
    $scope.addAttachment=function(item,field)
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
              $scope.pickImage(item,field);
              break;
            case 1:
              $scope.takePhoto(item,field);
              break;
            default:
              break;
          }
          return true;
        }
      });
    }






  });
