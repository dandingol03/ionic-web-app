angular.module('starter')

  .controller('dashboardController',function($scope,$state,$http, $location,
                                             $rootScope,$ionicModal,$timeout,
                                             $cordovaCamera,ionicDatePicker,
                                             $ionicActionSheet,$ionicPopup,$q,$cordovaFile,
                                             BaiduMapService,$ionicLoading,$cordovaMedia,$cordovaCapture,
                                              Proxy,$stateParams,$anchorScroll,
                                             $cordovaFileTransfer,$ionicPopover){




    $http({
      method: "post",
      url: Proxy.local() + "/svr/request",
      headers: {
        'Authorization': "Bearer " + $rootScope.access_token
      },
      data: {
        request: 'getCarManageFees'
      }
    }).then(function (res) {
      var json=res.data;
      if(json.re==1) {
        console.log('...');
      }
    }).catch(function(err) {
      var str='';
      for(var field in err)
        str+=err[field];
      console.error('error=' + str);
    });




    $scope.serviceTypeMap={
      11:'维修-日常保养',
      12:'维修-故障维修',
      13:'维修-事故维修',
      21:'车驾管-审车',
      22:'车驾管-审证',
      23:'车驾管-接送机',
      24:'车驾管-取送车',
      31:'鈑喷'};


    //选择车驾管服务项目
    $scope.services=["代办车辆年审","代办行驶证年审","接送机","取送车","违章查询"];


    $scope.maintain={
      tabs:['日常保养','故障维修','事故维修'],
      tab:'日常保养',
      items:{},
      tabIndex:'',
      serviceType:'',
      insuranceder:{}
    };

    if($rootScope.dashboard.tabIndex!==undefined&&$rootScope.dashboard.tabIndex!==null)
        $scope.tabIndex=$rootScope.dashboard.tabIndex;
    else
        $scope.tabIndex=0;



    //车驾管信息
    $scope.carManage={
      carValidate:$rootScope.carManage.carValidate,
      paperValidate:$rootScope.carManage.paperValidate,
      airportTransfer:$rootScope.carManage.airportTransfer,
      parkCar:$rootScope.carManage.parkCar,
      serviceType:$rootScope.carManage.serviceType
    };

    $scope.dailys = [
      {subServiceId:'1',subServiceTypes:'机油,机滤',serviceType:'11'},
      {subServiceId:'2',subServiceTypes:'检查制动系统,更换刹车片',serviceType:'11'},
      {subServiceId:'3',subServiceTypes:'雨刷片更换',serviceType:'11'},
      {subServiceId:'4',subServiceTypes:'轮胎更换',serviceType:'11'},
      {subServiceId:'5',subServiceTypes:'燃油添加剂',serviceType:'11'},
      {subServiceId:'6',subServiceTypes:'空气滤清器',serviceType:'11'},
      {subServiceId:'7',subServiceTypes:'检查火花塞',serviceType:'11'},
      {subServiceId:'8',subServiceTypes:'检查驱动皮带',serviceType:'11'},
      {subServiceId:'9',subServiceTypes:'更换空调滤芯',serviceType:'11'},
      {subServiceId:'10',subServiceTypes:'更换蓄电池,防冻液',serviceType:'11'}
    ];


    /**
     * 路由参数初始化
     */
    if($stateParams.params!==undefined&&$stateParams.params!==null&&$stateParams.params!=='')
    {
      var params=JSON.parse($stateParams.params);
      if(params.maintenance!==undefined&&params.maintenance!==null)
        $scope.maintain.maintenance=params.maintenance;
      if(params.tabIndex!==undefined&&params.tabIndex!==null)
        $scope.tabIndex=params.tabIndex;
      if(params.subTabIndex!==undefined&&params.subTabIndex!==null)
        $scope.subTabIndex=params.subTabIndex;
      if(params.type=='carValidate')
      {
        console.log('...');
      }else if(params.type=='paperValidate') {
        console.log('...');
      }
      if(params.location!==undefined&&params.location!==null)
      {
        $location.hash(params.location);
        $anchorScroll();
      }
    }else{
      $scope.subTabIndex=0;
    }

    /**
     * $rootScope数据同步
     */
    if($rootScope.dashboard!==undefined&&$rootScope.dashboard!==null)
    {
      if($rootScope.dashboard.tabIndex!==undefined&&$rootScope.dashboard.tabIndex!==null)
        $scope.tabIndex=$rootScope.dashboard.tabIndex;
      if($rootScope.dashboard.subTabIndex!==undefined&&$rootScope.dashboard.subTabIndex!==null)
        $scope.subTabIndex=$rootScope.dashboard.subTabIndex;
      if($rootScope.dashboard.service!==undefined&&$rootScope.dashboard.service!==null)
        $scope.service=$rootScope.dashboard.service;
      else
        $scope.service='代办车辆年审';
      $scope.maintain.description=$rootScope.maintain.description;
      if($rootScope.maintain.unit!==undefined&&$rootScope.maintain.unit!==null)
        $scope.maintain.unit=$rootScope.maintain.unit;
      if($rootScope.maintain.dailys!==undefined&&$rootScope.maintain.dailys!==null)
        $scope.dailys=$rootScope.maintain.dailys;
      if($rootScope.maintain.serviceType!==undefined&&$rootScope.maintain.serviceType!==null)
        $scope.maintain.serviceType=$rootScope.maintain.serviceType;
    }else{
      $scope.subTabIndex=0;
    }



    /***  悬浮窗  ***/
    $ionicPopover.fromTemplateUrl('/views/popover/order_special_popover.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
      $scope.popover.show($event);
    };
    $scope.closePopover = function() {
      $scope.popover.hide();
    };
    /***  悬浮窗  ***/

    $ionicPopover.fromTemplateUrl('btn-popover.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.btnPopover = popover;
    });

    $scope.openBtnPop=function($event){
      $scope.btnPopover.show($event);
    }

    $scope.carNumChange=function(){
      var event=window.event;
      $scope.carHint=true;
      if($scope.btnPopover.isShown()!=true)
        $scope.btnPopover.show(event);
      $timeout(function(){
        $scope.carHint=false;
        $scope.btnPopover.hide();
      },100000);

      console.log('carnum is changing');
    }



    //车辆信息
    $scope.carInfo=
    {};



    $scope.goto=function(url){
      $location.path(url);
    };




    $http({
      method: "post",
      url: Proxy.local()+"/svr/request",
      headers: {
        'Authorization': "Bearer " + $rootScope.access_token,
      },
      data:
      {
        request:'getCarAndOwnerInfo'
      }
    })
      .success(function (res) {
        var json=res.carInfo;
        if(json.re==1) {
          var carInfo=json.data[0];
          $scope.carInfo=carInfo;
          alert("carId="+carInfo.carId);
        }
        console.log('success');
      })



    //获取寿险列表
    $scope.postLifeInfo=function(){
      $http({
        method: "POST",
        url: Proxy.local()+"/svr/request",
        //url: "http://192.168.1.106:3000/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token,
        },
        data:
        {
          request:'getLifeInsuranceList',
        }
      }).
        success(function (response) {
          $scope.lifeInfo=response.lifeInfo[0];
          console.log('success');
        })
    }


    //use factory to improve
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


    //填写车辆信息的示例图片
    $scope.car={};
    $scope.isShowPicture = false;
    $scope.isShowPicture1 = false;
    $scope.isShowPicture2 = false;
    $scope.isShowPicture3 = false;
    $scope.isShowLicenseCard1 = false;
    $scope.isShowLicenseCard2 = false;
    $scope.isShowLicenseCard3 = false;

    $scope.setIsShowPicture = function(){
      $scope.isShowPicture = true;
      $scope.openDemoModal();
    };
    $scope.setIsShowPicture1 = function(){
      $scope.isShowPicture1 = true;
      $scope.openDemoModal1();
    };
    $scope.setIsShowPicture2 = function(){
      $scope.isShowPicture2 = true;
      $scope.openDemoModal2();
    };
    $scope.setIsShowPicture3 = function(){
      $scope.isShowPicture3 = true;
      $scope.openDemoModal3();
    };

    $scope.setIsShowLicenseCard1 = function(){
      $scope.isShowLicenseCard1 = true;
      $scope.openLicenseCard1();
    };
    $scope.setIsShowLicenseCard2 = function(){
      $scope.isShowLicenseCard2 = true;
      $scope.openLicenseCard2();
    };
    $scope.setIsShowLicenseCard3 = function(){
      $scope.isShowLicenseCard3 = true;
      $scope.openLicenseCard3();
    };


    /*** show demo modal ***/
    $ionicModal.fromTemplateUrl('views/modal/show_demo_modal.html',{
      scope:  $scope,
      animation: 'slide-in-bottom'
    }).then(function(modal) {
      $scope.show_demo_modal = modal;
    });

    $scope.openDemoModal= function(){
      try{
        $scope.show_demo_modal.show();
      }catch(e){
        alert('error=\r\n'+ e.toString());
      }

    };

    $scope.closeDemoModal= function() {
      $scope.show_demo_modal.hide();
    };
    /*** show demo modal ***/

    /*** show demo modal1 ***/
    $ionicModal.fromTemplateUrl('views/modal/show_demo_modal1.html',{
      scope:  $scope,
      animation: 'slide-in-bottom'
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
      animation: 'slide-in-bottom'
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
      animation: 'slide-in-bottom'
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

    /*** ShowLicenseCard1 ***/
    $ionicModal.fromTemplateUrl('views/modal/show_license_card_modal1.html',{
      scope:  $scope,
      animation: 'slide-in-bottom'
    }).then(function(modal) {
      $scope.show_license_card_modal1 = modal;
    });

    $scope.openLicenseCard1= function(){
      $scope.show_license_card_modal1.show();
    };

    $scope.closeLicenseCard1= function() {
      $scope.show_license_card_modal1.hide();
    };
    /*** ShowLicenseCard1 ***/

    /*** ShowLicenseCard2 ***/
    $ionicModal.fromTemplateUrl('views/modal/show_license_card_modal2.html',{
      scope:  $scope,
      animation: 'slide-in-bottom'
    }).then(function(modal) {
      $scope.show_license_card_modal2 = modal;
    });

    $scope.openLicenseCard2= function(){
      $scope.show_license_card_modal2.show();
    };

    $scope.closeLicenseCard2= function() {
      $scope.show_license_card_modal2.hide();
    };
    /*** ShowLicenseCard2 ***/

    /*** ShowLicenseCard3 ***/
    $ionicModal.fromTemplateUrl('views/modal/show_license_card_modal3.html',{
      scope:  $scope,
      animation: 'slide-in-bottom'
    }).then(function(modal) {
      $scope.show_license_card_modal3 = modal;
    });

    $scope.openLicenseCard3= function(){
      $scope.show_license_card_modal3.show();
    };

    $scope.closeLicenseCard3= function() {
      $scope.show_license_card_modal3.hide();
    };
    /*** ShowLicenseCard3 ***/


    /*** bind car modal ***/
    $ionicModal.fromTemplateUrl('views/modal/bind_car.html',{
      scope:  $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.bind_car_modal = modal;
    });

    $scope.openCarModal= function(){
      $scope.bind_car_modal.show();

    };

    $scope.closeCarModal= function() {
      $scope.bind_car_modal.hide();
    };
    /*** bind car modal ***/


    /*** bind append_insurer_modal 选择投保人模态框***/
    $ionicModal.fromTemplateUrl('views/modal/append_insurer_modal.html',{
      scope:  $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.append_insurer_modal = modal;
    });

    $scope.open_appendInsurerModal= function(){
      $scope.append_insurer_modal.show();
    };


    $scope.close_appendInsurerModal= function() {
      $scope.append_insurer_modal.hide();
    };
    /*** bind append_insurer_modal ***/


    /*** bind append_insuranceder_modal 选择被保险人模态框***/
    $ionicModal.fromTemplateUrl('views/modal/append_insuranceder_modal.html',{
      scope:  $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.append_insuranceder_modal = modal;
    });

    $scope.open_appendInsurancederModal= function(){
      $scope.append_insuranceder_modal.show();
    };

    $scope.close_appendInsurancederModal= function() {
      $scope.append_insuranceder_modal.hide();
    };
    /*** bind append_insuranceder_modal ***/



    /*** bind append_benefiter_modal 选择受益人模态框***/
    $ionicModal.fromTemplateUrl('views/modal/append_benefiter_modal.html',{
      scope:  $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.append_benifiter_modal = modal;
    });

    $scope.open_appendBenifiterModal= function(){
      $scope.append_benifiter_modal.show();
    };

    $scope.close_appendBenifiterModal= function() {
      $scope.append_benifiter_modal.hide();
    };
    /*** bind append_benefiter_modal ***/





    $scope.check_carInfo=function(){
      if($rootScope.car!==undefined&&$rootScope.car!==null)
      {

      }else{
        $timeout(function(){
          $scope.openModal();
        },300);
      }
    };


    /*** bind upload_ownerIdCard_modal***/
    $ionicModal.fromTemplateUrl('views/modal/upload_ownerIdCard_modal.html',{
      scope:  $scope,
      animation: 'animated '+' bounceInUp',
      hideDelay:920
    }).then(function(modal) {
      $scope.upload_ownerIdCard_modal = modal;
    });

    $scope.open_uploadOwnerIdCardModal= function(){
      $scope.upload_ownerIdCard_modal.show();
    };

    $scope.close_uploadOwnerIdCardModal= function() {
      $scope.upload_ownerIdCard_modal.hide();
    };
    /*** bind upload_ownerIdCard_modal ***/

    $scope.uploadOwnerIdCardPhoto=function(){
      $scope.open_uploadOwnerIdCardModal();
    }

    $scope.uploadOwnerIdCardPhotoConfirm=function(){
      if($scope.carInfo.ownerIdCard1_img!==undefined&&$scope.carInfo.ownerIdCard1_img!==null
          &&$scope.carInfo.ownerIdCard2_img!==undefined&&$scope.carInfo.ownerIdCard2_img)
      {

        console.log('path of ownerIdCard1 =' + $scope.carInfo.ownerIdCard1_img);
        console.log('path of ownerIdCard2 =' + $scope.carInfo.ownerIdCard2_img);



        var suffix='';
        var imageType='perIdCard';
        if($scope.carInfo.ownerIdCard1_img.indexOf('.jpg')!=-1)
          suffix='jpg';
        else if($scope.carInfo.ownerIdCard1_img.indexOf('.png')!=-1)
          suffix='png';
        else{}
        var server=Proxy.local()+'/svr/request?request=uploadPhoto' +
          '&imageType='+imageType+'&suffix='+suffix+'&filename='+'perIdAttachId1';
        var options = {
          fileKey:'file',
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token
          }
        };

        var perIdAttachId1=null;
        var perIdAttachId2=null;




        $cordovaFileTransfer.upload(server, $scope.carInfo.ownerIdCard1_img, options)
          .then(function(res) {
            for(var field in res) {
              alert('field=' + field + '\r\n' + res[field]);
            }
            var su=null
            if($scope.carInfo.ownerIdCard1_img.indexOf('.jpg')!=-1)
              su='jpg';
            else if($scope.carInfo.ownerIdCard1_img.indexOf('.png')!=-1)
              su='png';
            alert('suffix=' + su);
            return $http({
              method: "POST",
              url: Proxy.local()+"/svr/request",
              headers: {
                'Authorization': "Bearer " + $rootScope.access_token,
              },
              data:
              {
                request:'createPhotoAttachment',
                info:{
                  imageType:'perIdCard',
                  filename:'perIdAttachId1',
                  suffix:su,
                  docType:'I1'
                }
              }
            });
          }).then(function(res) {
            var json=res.data;
            if(json.re==1) {
              perIdAttachId1=json.data;
              alert('perIdAttachId1=' + perIdAttachId1);
              var su=null;
              if($scope.carInfo.ownerIdCard2_img.indexOf('.jpg')!=-1)
                su='jpg';
              else if($scope.carInfo.ownerIdCard2_img.indexOf('.png')!=-1)
                su='png';
              server=Proxy.local()+'/svr/request?request=uploadPhoto' +
                '&imageType='+imageType+'&suffix='+su+'&filename='+'perIdAttachId2';
              return  $cordovaFileTransfer.upload(server, $scope.carInfo.ownerIdCard2_img, options);
            }
          }).then(function(res) {
            alert('second image upload success');
            var su=null;
            if($scope.carInfo.ownerIdCard2_img.indexOf('.jpg')!=-1)
              su='jpg';
            else if($scope.carInfo.ownerIdCard2_img.indexOf('.png')!=-1)
              su='png';
            return $http({
              method: "POST",
              url: Proxy.local()+"/svr/request",
              headers: {
                'Authorization': "Bearer " + $rootScope.access_token,
              },
              data:
              {
                request:'createPhotoAttachment',
                info:{
                  imageType:'perIdCard',
                  filename:'perIdAttachId2',
                  suffix:su,
                  docType:'I1'
                }
              }
            });
          }).then(function(res) {
            var json=res.data;
            if(json.re==1) {
              perIdAttachId2=json.data;
              alert('perIdAttachId2=' + perIdAttachId2);
              return $http({
                method: "POST",
                url: Proxy.local()+"/svr/request",
                headers: {
                  'Authorization': "Bearer " + $rootScope.access_token,
                },
                data:
                {
                  request:'createInsuranceInfoPersonInfo',
                  info:{
                    perIdAttachId1:perIdAttachId1,
                    perIdAttachId2:perIdAttachId2
                  }
                }
              });

            }
          }).then(function(res) {
            var json=res.data;
            $scope.close_uploadOwnerIdCardModal();
          }).catch(function(err) {
            var str='';
            for(var field in err) {
                str+=err[field];
            }
            alert('error=\r\n' + str);
          });

      }
      else{
        $ionicPopup.alert({
          title: '',
          template: '请同时上传身份证正反面'
        });
      }
    }

    //上传验车照片
    $scope.uploadCarAttachPhotoConfirm=function(){
      if($scope.carInfo.carAttachId1_img!==undefined&&$scope.carInfo.carAttachId1_img!==null&&
        $scope.carInfo.carAttachId2_img!==undefined&&$scope.carInfo.carAttachId2_img!==null&&
        $scope.carInfo.carAttachId3_img!==undefined&&$scope.carInfo.carAttachId3_img!==null&&
        $scope.carInfo.carAttachId4_img!==undefined&&$scope.carInfo.carAttachId4_img!==null&&
        $scope.carInfo.carAttachId5_img!==undefined&&$scope.carInfo.carAttachId5_img!==null&&
        $scope.carInfo.carAttachId6_img!==undefined&&$scope.carInfo.carAttachId6_img!==null)
      {
        console.log('path of carAttachId1 =' + $scope.carInfo.carAttachId1_img);
        console.log('path of carAttachId2 =' + $scope.carInfo.carAttachId2_img);
        console.log('path of carAttachId3 =' + $scope.carInfo.carAttachId3_img);
        console.log('path of carAttachId4 =' + $scope.carInfo.carAttachId4_img);
        console.log('path of carAttachId5 =' + $scope.carInfo.carAttachId5_img);
        console.log('path of carAttachId6 =' + $scope.carInfo.carAttachId6_img);

        var carId=$scope.carInfo.carId;
        var suffix='';
        var imageType='carPhoto';
        if($scope.carInfo.carAttachId1_img.indexOf('.jpg')!=-1)
          suffix='jpg';
        else if($scope.carInfo.carAttachId1_img.indexOf('.png')!=-1)
          suffix='png';
        else{}
        var server=Proxy.local()+'/svr/request?request=uploadPhoto' +
          '&imageType='+imageType+'&suffix='+suffix+'&filename='+'carAttachId1'+'&carId='+carId;
        var options = {
          fileKey:'file',
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token
          }
        };

        var carAttachId1=null;
        var carAttachId2=null;
        var carAttachId3=null;
        var carAttachId4=null;
        var carAttachId5=null;
        var carAttachId6=null;

        $cordovaFileTransfer.upload(server, $scope.carInfo.carAttachId1_img, options)
          .then(function(res) {
            alert('upload first carAttach success');
            for(var field in res) {
              alert('field=' + field + '\r\n' + res[field]);
            }
            var su=null
            if($scope.carInfo.carAttachId1_img.indexOf('.jpg')!=-1)
              su='jpg';
            else if($scope.carInfo.carAttachId1_img.indexOf('.png')!=-1)
              su='png';
            alert('suffix=' + su);
            return $http({
              method: "POST",
              url: Proxy.local()+"/svr/request",
              headers: {
                'Authorization': "Bearer " + $rootScope.access_token,
              },
              data:
              {
                request:'createPhotoAttachment',
                info:{
                  imageType:'carPhoto',
                  filename:'carAttachId1',
                  suffix:su,
                  docType:'I4',
                  carId:carId
                }
              }
            });
          }).then(function(res) {
            var json=res.data;
            if(json.re==1) {

              carAttachId1=json.data;
              alert('carAttachId1=' + carAttachId1);
              var su=null;
              if($scope.carInfo.carAttachId2_img.indexOf('.jpg')!=-1)
                su='jpg';
              else if($scope.carInfo.carAttachId2_img.indexOf('.png')!=-1)
                su='png';
              server=Proxy.local()+'/svr/request?request=uploadPhoto' +
                '&imageType='+imageType+'&suffix='+su+'&filename='+'carAttachId2'+'&carId='+carId;
              return  $cordovaFileTransfer.upload(server, $scope.carInfo.carAttachId2_img, options);
            }
          }).then(function(res) {
            alert('second carAttach upload success');
            var su=null;
            if($scope.carInfo.carAttachId2_img.indexOf('.jpg')!=-1)
              su='jpg';
            else if($scope.carInfo.carAttachId2_img.indexOf('.png')!=-1)
              su='png';
            return $http({
              method: "POST",
              url: Proxy.local()+"/svr/request",
              headers: {
                'Authorization': "Bearer " + $rootScope.access_token,
              },
              data:
              {
                request:'createPhotoAttachment',
                info:{
                  imageType:'carPhoto',
                  filename:'carAttachId2',
                  suffix:su,
                  docType:'I4',
                  carId:carId
                }
              }
            });
          }).then(function(res) {
            var json=res.data;
            if(json.re==1) {
              carAttachId2=json.data;
              alert('carAttachId2=' + carAttachId2);
              var su=null;
              if($scope.carInfo.carAttachId3_img.indexOf('.jpg')!=-1)
                su='jpg';
              else if($scope.carInfo.carAttachId3_img.indexOf('.png')!=-1)
                su='png';
              server=Proxy.local()+'/svr/request?request=uploadPhoto' +
                '&imageType='+imageType+'&suffix='+su+'&filename='+'carAttachId3'+'&carId='+carId;
              return  $cordovaFileTransfer.upload(server, $scope.carInfo.carAttachId3_img, options);
            }
          }).then(function(res) {
            alert('third image upload successfully');
            var su=null;
            if($scope.carInfo.carAttachId3_img.indexOf('.jpg')!=-1)
              su='jpg';
            else if($scope.carInfo.carAttachId3_img.indexOf('.png')!=-1)
              su='png';
            return $http({
              method: "POST",
              url: Proxy.local()+"/svr/request",
              headers: {
                'Authorization': "Bearer " + $rootScope.access_token,
              },
              data:
              {
                request:'createPhotoAttachment',
                info:{
                  imageType:'carPhoto',
                  filename:'carAttachId3',
                  suffix:su,
                  docType:'I4',
                  carId:carId
                }
              }
            });
          }).then(function(res) {
            var json=res.data;
            if(json.re==1) {
              carAttachId3=json.data;
              var su=null;
              if($scope.carInfo.carAttachId4_img.indexOf('.jpg')!=-1)
                su='jpg';
              else if($scope.carInfo.carAttachId4_img.indexOf('.png')!=-1)
                su='png';
              server=Proxy.local()+'/svr/request?request=uploadPhoto' +
                '&imageType='+imageType+'&suffix='+su+'&filename='+'carAttachId4'+'&carId='+carId;
              return  $cordovaFileTransfer.upload(server, $scope.carInfo.carAttachId4_img, options);
            }
          }).then(function(res) {
            alert('fourth image upload successfully');
            var su=null;
            if($scope.carInfo.carAttachId4_img.indexOf('.jpg')!=-1)
              su='jpg';
            else if($scope.carInfo.carAttachId4_img.indexOf('.png')!=-1)
              su='png';
            return $http({
              method: "POST",
              url: Proxy.local()+"/svr/request",
              headers: {
                'Authorization': "Bearer " + $rootScope.access_token,
              },
              data:
              {
                request:'createPhotoAttachment',
                info:{
                  imageType:'carPhoto',
                  filename:'carAttachId4',
                  suffix:su,
                  docType:'I4',
                  carId:carId
                }
              }
            });
          }).then(function(res) {
            var json=res.data;
            if(json.re==1) {
              carAttachId4=json.data;
              var su=null;
              if($scope.carInfo.carAttachId5_img.indexOf('.jpg')!=-1)
                su='jpg';
              else if($scope.carInfo.carAttachId5_img.indexOf('.png')!=-1)
                su='png';
              server=Proxy.local()+'/svr/request?request=uploadPhoto' +
                '&imageType='+imageType+'&suffix='+su+'&filename='+'carAttachId5'+'&carId='+carId;
              return  $cordovaFileTransfer.upload(server, $scope.carInfo.carAttachId5_img, options);
            }
          }).then(function(res) {
            alert('fifth image upload successfully');
            var su=null;
            if($scope.carInfo.carAttachId5_img.indexOf('.jpg')!=-1)
              su='jpg';
            else if($scope.carInfo.carAttachId5_img.indexOf('.png')!=-1)
              su='png';
            return $http({
              method: "POST",
              url: Proxy.local()+"/svr/request",
              headers: {
                'Authorization': "Bearer " + $rootScope.access_token,
              },
              data:
              {
                request:'createPhotoAttachment',
                info:{
                  imageType:'carPhoto',
                  filename:'carAttachId5',
                  suffix:su,
                  docType:'I4',
                  carId:carId
                }
              }
            });
          }).then(function(res) {
            var json=res.data;
            if(json.re==1) {
              carAttachId5=json.data;
              var su=null;
              if($scope.carInfo.carAttachId6_img.indexOf('.jpg')!=-1)
                su='jpg';
              else if($scope.carInfo.carAttachId6_img.indexOf('.png')!=-1)
                su='png';
              server=Proxy.local()+'/svr/request?request=uploadPhoto' +
                '&imageType='+imageType+'&suffix='+su+'&filename='+'carAttachId6'+'&carId='+carId;
              return  $cordovaFileTransfer.upload(server, $scope.carInfo.carAttachId6_img, options);
            }
          }).then(function(res) {
            alert('sixth image upload successfully');
            var su=null;
            if($scope.carInfo.carAttachId6_img.indexOf('.jpg')!=-1)
              su='jpg';
            else if($scope.carInfo.carAttachId6_img.indexOf('.png')!=-1)
              su='png';
            return $http({
              method: "POST",
              url: Proxy.local()+"/svr/request",
              headers: {
                'Authorization': "Bearer " + $rootScope.access_token,
              },
              data:
              {
                request:'createPhotoAttachment',
                info:{
                  imageType:'carPhoto',
                  filename:'carAttachId6',
                  suffix:su,
                  docType:'I4',
                  carId:carId
                }
              }
            });
          }).then(function(res) {
            var json=res.data;
            if(json.re==1) {
              carAttachId6=json.data;
              var ob={
                carAttachId1:carAttachId1,
                carAttachId2:carAttachId2,
                carAttachId3:carAttachId3,
                carAttachId4:carAttachId4,
                carAttachId5:carAttachId5,
                carAttachId6:carAttachId6
              }
              return $http({
                method: "POST",
                url: Proxy.local()+"/svr/request",
                headers: {
                  'Authorization': "Bearer " + $rootScope.access_token,
                },
                data:
                {
                  request:'updateInsuranceCarInfo',
                  info:{
                    carId:carId,
                    ob:ob
                  }
                }
              });
            }
          }).then(function(res) {
            alert('car attach upload completely');
            $scope.close_uploadCarAttachModal();
            $scope.select_type();
          }).catch(function(err) {
            var str='';
            for(var field in err) {
              str+=err[field];
            }
            alert('error=\r\n' + str);
          });
      }else{
        $ionicPopup.alert({
          title: '',
          template: '请同时上传验车照片6张'
        });
      }
    }

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

    /*** bind upload_carAttach_modal***/
    $ionicModal.fromTemplateUrl('views/modal/upload_carAttach_modal.html',{
      scope:  $scope,
      animation: 'animated '+' bounceInUp',
      hideDelay:920
    }).then(function(modal) {
      $scope.upload_carAttach_modal = modal;
    });

    $scope.open_uploadCarAttachModal= function(){
      $scope.upload_carAttach_modal.show();
    };

    $scope.close_uploadCarAttachModal= function() {
      $scope.upload_carAttach_modal.hide();
    };
    /*** bind upload_carAttach_modal ***/



    $scope.uploadLicenseCardPhotoConfirm=function(){
      if($scope.carInfo.licenseCard1_img!==undefined&&$scope.carInfo.licenseCard1_img!==null
        &&$scope.carInfo.licenseCard2_img!==undefined&&$scope.carInfo.licenseCard2_img!==null
        &&$scope.carInfo.licenseCard3_img!==undefined&&$scope.carInfo.licenseCard3_img!==null)
      {

        console.log('path of licenseCard1 =' + $scope.carInfo.licenseCard1_img);
        console.log('path of licenseCard2 =' + $scope.carInfo.licenseCard2_img);
        console.log('path of licenseCard3 =' + $scope.carInfo.licenseCard3_img);

        var carId=$scope.carInfo.carId;
        var suffix='';
        var imageType='licenseCard';
        if($scope.carInfo.licenseCard1_img.indexOf('.jpg')!=-1)
          suffix='jpg';
        else if($scope.carInfo.licenseCard1_img.indexOf('.png')!=-1)
          suffix='png';
        else{}
        var server=Proxy.local()+'/svr/request?request=uploadPhoto' +
          '&imageType='+imageType+'&suffix='+suffix+'&filename='+'licenseAttachId1'+'&carId='+carId;
        var options = {
          fileKey:'file',
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token
          }
        };

        var licenseAttachId1=null;
        var licenseAttachId2=null;
        var licenseAttachId3=null;

        $cordovaFileTransfer.upload(server, $scope.carInfo.licenseCard1_img, options)
          .then(function(res) {
            alert('upload first license success');
            for(var field in res) {
              alert('field=' + field + '\r\n' + res[field]);
            }
            var su=null
            if($scope.carInfo.licenseCard1_img.indexOf('.jpg')!=-1)
              su='jpg';
            else if($scope.carInfo.licenseCard1_img.indexOf('.png')!=-1)
              su='png';
            alert('suffix=' + su);
            return $http({
              method: "POST",
              url: Proxy.local()+"/svr/request",
              headers: {
                'Authorization': "Bearer " + $rootScope.access_token,
              },
              data:
              {
                request:'createPhotoAttachment',
                info:{
                  imageType:'licenseCard',
                  filename:'licenseAttachId1',
                  suffix:su,
                  docType:'I3',
                  carId:carId
                }
              }
            });
          }).then(function(res) {
            var json=res.data;
            if(json.re==1) {
              licenseAttachId1=json.data;
              alert('licenseAttachId1=' + licenseAttachId1);
              var su=null;
              if($scope.carInfo.licenseCard2_img.indexOf('.jpg')!=-1)
                su='jpg';
              else if($scope.carInfo.licenseCard2_img.indexOf('.png')!=-1)
                su='png';
              server=Proxy.local()+'/svr/request?request=uploadPhoto' +
                '&imageType='+imageType+'&suffix='+su+'&filename='+'licenseAttachId2'+'&carId='+carId;
              return  $cordovaFileTransfer.upload(server, $scope.carInfo.licenseCard2_img, options);
            }
          }).then(function(res) {
            alert('second image upload success');
            var su=null;
            if($scope.carInfo.licenseCard2_img.indexOf('.jpg')!=-1)
              su='jpg';
            else if($scope.carInfo.licenseCard2_img.indexOf('.png')!=-1)
              su='png';
            return $http({
              method: "POST",
              url: Proxy.local()+"/svr/request",
              headers: {
                'Authorization': "Bearer " + $rootScope.access_token,
              },
              data:
              {
                request:'createPhotoAttachment',
                info:{
                  imageType:'licenseCard',
                  filename:'licenseAttachId2',
                  suffix:su,
                  docType:'I3',
                  carId:carId
                }
              }
            });
          }).then(function(res) {
            var json=res.data;
            if(json.re==1) {
              licenseAttachId2=json.data;
              alert('licenseAttachId2=' + licenseAttachId2);
              var su=null;
              if($scope.carInfo.licenseCard3_img.indexOf('.jpg')!=-1)
                su='jpg';
              else if($scope.carInfo.licenseCard3_img.indexOf('.png')!=-1)
                su='png';
              server=Proxy.local()+'/svr/request?request=uploadPhoto' +
                '&imageType='+imageType+'&suffix='+su+'&filename='+'licenseAttachId3'+'&carId='+carId;
              return  $cordovaFileTransfer.upload(server, $scope.carInfo.licenseCard3_img, options);
            }
          }).then(function(res) {
            alert('third image upload successfully');
            var su=null;
            if($scope.carInfo.licenseCard3_img.indexOf('.jpg')!=-1)
              su='jpg';
            else if($scope.carInfo.licenseCard3_img.indexOf('.png')!=-1)
              su='png';
            return $http({
              method: "POST",
              url: Proxy.local()+"/svr/request",
              headers: {
                'Authorization': "Bearer " + $rootScope.access_token,
              },
              data:
              {
                request:'createPhotoAttachment',
                info:{
                  imageType:'licenseCard',
                  filename:'licenseAttachId3',
                  suffix:su,
                  docType:'I3',
                  carId:carId
                }
              }
            });
          }).then(function(res) {
            var json=res.data;
            if(json.re==1) {
              licenseAttachId3=json.data;
              var ob={
                licenseAttachId1:licenseAttachId1,
                licenseAttachId2:licenseAttachId2,
                licenseAttachId3:licenseAttachId3
              }
              return $http({
                method: "POST",
                url: Proxy.local()+"/svr/request",
                headers: {
                  'Authorization': "Bearer " + $rootScope.access_token,
                },
                data:
                {
                  request:'updateInsuranceCarInfo',
                  info:{
                    carId:carId,
                    ob:ob
                  }
                }
              });
            }
          }).then(function(res) {
            alert('it is all done');
            $scope.close_uploadLicenseCardModal();
            //carAttach
            if($scope.carInfo.carAttachId1_img!==undefined&&$scope.carInfo.carAttachId1_img!==null&&
              $scope.carInfo.carAttachId2_img!==undefined&&$scope.carInfo.carAttachId2_img!==null&&
              $scope.carInfo.carAttachId3_img!==undefined&&$scope.carInfo.carAttachId3_img!==null&&
              $scope.carInfo.carAttachId4_img!==undefined&&$scope.carInfo.carAttachId4_img!==null&&
              $scope.carInfo.carAttachId5_img!==undefined&&$scope.carInfo.carAttachId5_img!==null&&
              $scope.carInfo.carAttachId6_img!==undefined&&$scope.carInfo.carAttachId6_img!==null)
            {
              $scope.select_type();
            }else{
              //TODO:上传验车照片
              alert('go into carAttach-upload....');
              $http({
                method: "POST",
                url: Proxy.local()+"/svr/request",
                headers: {
                  'Authorization': "Bearer " + $rootScope.access_token
                },
                data:
                {
                  request:'getCarStateByCarId',
                  info:{
                    carId:$scope.carInfo.carId
                  }
                }
              }).then(function(res) {
                var json=res.data;
                if(json.re==1) {
                  var carState=json.data;
                  if(carState==1)//免传验车照片
                  {
                    $scope.select_type();
                  }else{
                    var confirmPopup = $ionicPopup.confirm({
                      title: '缺少验车照片',
                      template: '请问是否选择上传验车照片',
                      okText:'上传',
                      cancelText:'取消'
                    });
                    confirmPopup.then(function(res) {
                      if(res) {
                        $scope.open_uploadCarAttachModal();
                      } else {
                        console.log('You are not sure');
                      }
                    });
                  }
                }
              }).catch(function(err) {
                var str='';
                for(var field in err)
                  str+=err[field];
                console.error('error=\r\n' + str);
              });

            }
          }).catch(function(err) {
            var str='';
            for(var field in err) {
              str+=err[field];
            }
            alert('error=\r\n' + str);
          });

      }
      else{
        $ionicPopup.alert({
          title: '',
          template: '请同时上传行驶证3面'
        });
      }
    }





    $scope.postCarInfo=function(){


      if(window.cordova!==undefined&&window.cordova!==null)
      {

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
                  $scope.carInfo.carId=json.data.carId;
                  if($scope.carInfo.licenseAttachId1_img!==undefined&&$scope.carInfo.licenseAttachId1_img!==null&&
                    $scope.carInfo.licenseAttachId2_img!==undefined&&scope.carInfo.licenseAttachId2_img!==null&&
                    $scope.carInfo.licenseAttachId3_img!==undefined&&scope.carInfo.licenseAttachId3_img!==null)
                  {
                    //$scope.select_type();
                    //TODO:上传验车照片
                    if($scope.carInfo.carAttachId1_img!==undefined&&$scope.carInfo.carAttachId1_img!==null&&
                      $scope.carInfo.carAttachId2_img!==undefined&&$scope.carInfo.carAttachId2_img!==null&&
                      $scope.carInfo.carAttachId3_img!==undefined&&$scope.carInfo.carAttachId3_img!==null&&
                      $scope.carInfo.carAttachId4_img!==undefined&&$scope.carInfo.carAttachId4_img!==null&&
                      $scope.carInfo.carAttachId5_img!==undefined&&$scope.carInfo.carAttachId5_img!==null&&
                      $scope.carInfo.carAttachId6_img!==undefined&&$scope.carInfo.carAttachId6_img!==null)

                    {
                      $scope.select_type();
                    }
                    else{

                      //TODO:上传验车照片
                      alert('go into carAttach-upload....');
                      $http({
                        method: "POST",
                        url: Proxy.local()+"/svr/request",
                        headers: {
                          'Authorization': "Bearer " + $rootScope.access_token
                        },
                        data:
                        {
                          request:'getCarStateByCarId',
                          info:{
                            carId:$scope.carInfo.carId
                          }
                        }
                      }).then(function(res) {
                        var json=res.data;
                        if(json.re==1) {
                          alert('go2');
                          var carState=json.data;
                          if(carState==1)//免传验车照
                          {
                            alert('go');
                            $scope.select_type();
                          }else{
                            alert('go1');
                            var confirmPopup = $ionicPopup.confirm({
                              title: '缺少验车照片',
                              template: '请问是否选择上传验车照片',
                              okText:'上传',
                              cancelText:'取消'
                            });
                            confirmPopup.then(function(res) {
                              if(res) {
                                $scope.open_uploadLicenseCardModal();
                              } else {
                                console.log('You are not sure');
                              }
                            });
                          }
                        }
                      }).catch(function(err) {
                        var str='';
                        for(var field in err)
                          str+=err[field];
                        console.error('error=\r\n' + str);
                      });


                    }
                  }
                  else{
                    //TODO:上传行驶证照片
                    var confirmPopup = $ionicPopup.confirm({
                      title: '缺少行驶证照片',
                      template: '请问是否选择上传行驶证',
                      okText:'上传',
                      cancelText:'取消'
                    });
                    confirmPopup.then(function(res) {
                      if(res) {
                        $scope.open_uploadLicenseCardModal();
                      } else {
                        console.log('You are not sure');
                      }
                    });
                  }
                }
                });


      }else{
        $scope.select_type();
      }

    }

    $scope.select_type=function(){
      $state.go('car_insurance',{carInfo:JSON.stringify($scope.carInfo)});
    }



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
        allowEdit: true,
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


    $scope.life_insurance=
    {
      insurer:{perTypeCode:'I'},
      insuranceder:{perTypeCode:'I'},
      benefiter:{perTypeCode:'I'},
      intend:{},
      order:{
        insurer:{},
        insuranceder:{},
        benefiter:{}
      }
    };


    $scope.apply=function () {
      $scope.life_insurance.state = 'pricing';//订单状态是报价中
      $rootScope.life_insurance = $scope.life_insurance;
      $scope.close_lifeModal();
    }



    //车险险种选择
    $scope.specials_apply=function(){
      var specials=[];
      $scope.motor_specials.map(function (special, i) {
        if(special.checked==true)
          specials.push(special);
      });
      if(specials.length==0)
        alert("请选择一项险种");
      else{
        //TODO:inject into $rootScope
        $rootScope.specials=specials;
        for(var i=0;i<specials.length;i++){
        delete $rootScope.specials[i].$$hashKey;
        }
      }
    }




    //获取寿险产品
    $http({
      method: "POST",
      url: Proxy.local()+"/svr/request",
      headers: {
        'Authorization': "Bearer " + $rootScope.access_token,
      },
      data:
      {
        request:'getLifeInsuranceProducts',
        info:$scope.carInfo
      }
    }).then(function(res) {
      var data=res.data;
      var life_insurance_products=[];
      if(data.re==1)
      {
        data.data.map(function(record,i) {
          if(record!==undefined&&record!==null)
            life_insurance_products.push(record);
        });
      }else{
      }
      $scope.life_insurances=life_insurance_products;
      return  $http.get("http://202.194.14.106:9030/insurance/project_provide");
    }).then(function (res) {
      if(res.data!==undefined&&res.data!==null)
      {
        var data=res.data;
        var projects=data.projects;
        if(Object.prototype.toString.call(projects)!='[object Array]')
          projects=JSON.parse(projects);
        $scope.motor_specials=projects;
        return true;
      }
      else
        return false;

    }).then(function(re) {
      if(re==true)
      {
        $scope.tabs=[
          {type:'车险',insurances:$scope.motor_specials},
          {type:'寿险',insurances:$scope.life_insurances},
          {type:'维修'},
          {type:'车驾管',
            services:[
              {name:'代办车辆年审',href:''},
              {name:'代办驾驶证年审',href:''},
              {name:'取送车',href:''},
              {name:'接送机',href:''},
              {name:'违章查询',href:''}
            ]
          }
        ];
        return ({re: 1});
      }
    }).then(function(json) {

      if(json.re==1) {
        return  [
          {routineId:'1',routineName:'机油,机滤',routineType:'日常保养'},
          {routineId:'2',routineName:'机油,三滤',routineType:'日常保养'},
          {routineId:'3',routineName:'更换刹车片',routineType:'日常保养'},
          {routineId:'4',routineName:'雨刷片更换',routineType:'日常保养'},
          {routineId:'5',routineName:'轮胎更换',routineType:'日常保养'}
        ];
      }
    }).then(function(res){
      var json=res.data;
      //if(json.re==1) {
      //  $scope.routines=json.data;
      //  $scope.dailys = json.data['日常保养'];
      //}
    }).catch(function (err) {
      console.log('server fetch error');
    });


    //寿险详情展示
    $scope.setDetail=function(item){
      if(item.show_detail!=true)
        item.show_detail=true;
      else
        item.show_detail=false;
    }

    //寿险产品勾选
    $scope.toggle_lifeinsurance_product=function(item){
      //如果本次行为为寿险选中,则
      if($scope.life_insurance.product!==undefined&&$scope.life_insurance.product!==null)
      {
        if($scope.life_insurance.product.productId==item.productId)
            $scope.life_insurance.product=null;
        else
          $scope.life_insurance.product=item;
      }else{
        $scope.life_insurance.product=item;
        $state.go('life_insurance_detail',{insurance:JSON.stringify(item)});
      }
    }

    $scope.detail_ref=function(insurance){
      switch($scope.tabIndex)
      {
        case 0:
              break;
        case 1:
          $state.go('life_insurance_detail',{insurance:JSON.stringify(insurance)});
              break;
        default:
              break;
      }
    }

    //寿险意向被保险人选择
    $scope.lifeInsuranceder_gender_select=function(item,prices) {
        var buttons=[{text:'男'},{text:'女'}];
        $ionicActionSheet.show({
          buttons:buttons,
          titleText: '选择被保险人性别',
          cancelText: '取消',
          buttonClicked: function(index) {
            $scope.life_insurance.insuranceder.gender = buttons[index].text;
            return true;
          },
          cssClass:'motor_insurance_actionsheet'
        });
    }

    //寿险状态查询
    $scope.lifeInsuranceStateQuery=function(){
      $http({
        method: "POST",
        url: "/proxy/node_server/svr/request",
        // url: "http://192.168.1.106:3000/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token,
        },
        data:
        {
          request:'getOrderState',
          orderId:orderId
        }
      }).then(function(res) {
        var data=res.state;
        if(data==3)
        {


        }
      }).catch(function(err) {
        var str='';
        for(var field in err)
          str += field + ':' + err[field];
        alert('error=\r\n' + str);
      });
    }



    //获取寿险订单状态
    $scope.getLifeOrderState=function(){
      $http({
        method: "POST",
        url: "/proxy/node_server/svr/request",
        // url: "http://192.168.1.106:3000/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token,
        },
        data:
        {
          request:'getLifeOrderState',
          orderId:orderId
        }
      }).then(function(res) {
        var data=res.state;
        if(data==3)
        {


        }
      }).catch(function(err) {
        var str='';
        for(var field in err)
          str += field + ':' + err[field];
        alert('error=\r\n' + str);
      });

    }



    //寿险意向保留
    $scope.saveLifeInsuranceIntend=function()
    {

      if($scope.life_insurance.order.insuranceder.personId!==undefined&&$scope.life_insurance.order.insuranceder.personId!==null
        &&$scope.life_insurance.order.insurer.personId!==undefined&&$scope.life_insurance.order.insurer.personId!==null
        &&$scope.life_insurance.order.benefiter.personId!==undefined&&$scope.life_insurance.order.benefiter.personId!==null
        &&$scope.life_insurance.order.planInsuranceFee!==undefined&&$scope.life_insurance.order.planInsuranceFee!==null
      )
      {
        $http({
          method: "POST",
          url: Proxy.local()+'/svr/request',
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token,
          },
          data:
          {
            request:'generateLifeInsuranceOrder',
            info:$scope.life_insurance.order
          }
        }).then(function(res) {

          if(res.data!==undefined&&res.data!==null)
          {
            var orderId=res.data.data;
            if(orderId!==undefined&&orderId!==null)
            {
              if($rootScope.lifeInsurance==undefined||$rootScope.lifeInsurance==null)
                $rootScope.lifeInsurance={};
              $rootScope.lifeInsurance.orderId=orderId;


              var confirmPopup = $ionicPopup.confirm({
                title: '您的订单',
                template: '您的寿险意向已提交,请等待工作人员配置方案后在"我的寿险订单"中进行查询'
              });

              confirmPopup.then(function(res) {
                if(res){
                  console.log('You are sure');
                }else {
                  console.log('You are not sure');
                }
              })

              // $state.go('life_insurance_orders',{tabIndex:2});
            }
          }

        }).catch(function(err) {
          var str='';
          for(var field in err)
            str += field + ':' + err[field];
          alert('error=\r\n' + str);
        });
      }else{
        var confirmPopup = $ionicPopup.confirm({
          title: '请填写完寿险意向后才选择提交',
          template: ''
        });

        confirmPopup.then(function(res) {
          if(res){
            console.log('You are sure');
          }else {
            console.log('You are not sure');
          }
        })
      }


    }


    //车险保额选择
    $scope.price_select=function(item,prices) {
      if (prices !== undefined && prices !== null &&prices.length > 0)
      {
        var buttons=[];
        prices.map(function(price,i) {
          buttons.push({text: price});
        });
        $ionicActionSheet.show({
          buttons:buttons,
          titleText: '选择你的保额',
          cancelText: 'Cancel',
          buttonClicked: function(index) {
            item.price = prices[index];
            return true;
          },
          cssClass:'motor_insurance_actionsheet'
        });
      }
      else
      {}
    }

    //绑定车主信息
    $scope.bind_car=function(){
      $rootScope.carInfo=$scope.carInfo;
      //$scope.maintenance_t_a_modal.show();
      $state.go('car_insurance');
    }

$scope.openAirportTransfer=function(){
  $state.go('locate_airportTransfer_nearby');
}


    $scope.services=[
      '代办车辆年审',
      '代办驾驶证年审',
      '取送车',
      '接送机',
      '违章查询'
    ];

    //维修服务
    $scope.tab_change=function(i){
      $scope.tabIndex=i;
    };


    $scope.subTab_change=function(i) {
      $scope.subTabIndex=i;

      if($scope.tabIndex==2)
      {
        switch (i) {
          case 0:
            $scope.maintain.serviceType=11;
            break;
          case 1:
            $scope.maintain.serviceType=12;
            break;
          case 2:
            $scope.maintain.serviceType=13;
            break;
          default :
            break;
        }
      }
      if($scope.tabIndex==3)
      {
        switch (i) {
          case 0:
            $scope.carManage.serviceType=21;
            break;
          case 1:
            $scope.carManage.serviceType=22;
            break;
          case 2:
            $scope.carManage.serviceType=23;
            break;
          case 3:
            $scope.carManage.serviceType=24;
            break;
          default :
            break;
        }
      }

    };


    $scope.candidates=[131,135];//五公里范围内的维修厂对应的服务人员



    $scope.miles=0;



    $scope.getMaintainPlan=function(miles){
      var miles= parseInt(miles/5000)*5000;

      $http({
        method: "POST",
        url: Proxy.local()+'/svr/request',
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token,
        },
        data:
        {
          request:'getMaintainPlan',
          info:{
            miles:miles
          }
        }
      }).then(function(res) {
        var json = res.data;
        if(json.re==1){
          $scope.routineName=json.data;
          $scope.open_maintainPlanModal();
        }

      })
    }

    /***  查看保养计划模态框***/
    $ionicModal.fromTemplateUrl('views/modal/maintain_plan_modal.html',{
      scope:  $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.maintain_plan_modal = modal;
    });

    $scope.open_maintainPlanModal= function(){
      $scope.maintain_plan_modal.show();
    };


    $scope.close_maintainPlanModal= function() {
      $scope.maintain_plan_modal.hide();
    };
    /*** 查看保养计划模态框 ***/




    $scope.daily_check=function(item){
      if(item.checked==true)
        item.checked=false;
      else
        item.checked=true;
    }

    $scope.accident = {};
    $scope.accidant_check=function(type)
    {
      $scope.accident.type=type;
    }

    $scope.audioCheck = function (orderId) {
      var deferred = $q.defer();
      alert('audiochecking.....');
      alert('resourceulr=' + $scope.maintain.description.audio);
      if($scope.maintain.description.audio!=null&&$scope.maintain.description.audio!=undefined)
      {
        var server=Proxy.local()+'/svr/request?' +
          'request=uploadAudio&orderId='+orderId+'&fileName='+$scope.maintain.description.audio+'&audioType=serviceAudio';
        var options = {
          fileKey:'file',
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token
          }
        };
        alert('go into upload audio');
        $cordovaFileTransfer.upload(server, $scope.maintain.description.audio, options)
        .then(function(res) {
          var json=res.response;
          json=JSON.parse(json);
            if(json.re==1){

           return   $http({
                method: "POST",
                url: Proxy.local() + "/svr/request",
                headers: {
                  'Authorization': "Bearer " + $rootScope.access_token
                },
                data: {
                  request: 'createAudioAttachment',
                  info: {
                    orderId: orderId,
                    docType:'I6',
                    path:json.data
                  }
                }
              });
            }
        }).then(function(res) {
          var json=res.data;
          var audioAttachId=json.data;
          if(json.re==1){
            $http({
              method: "POST",
              url: Proxy.local() + "/svr/request",
              headers: {
                'Authorization': "Bearer " + $rootScope.access_token
              },
              data: {
                request: 'updateServiceAudioAttachment',
                info: {
                  orderId: orderId,
                  audioAttachId:audioAttachId
                }
              }
            });
          }
          }).then(function(res) {
            var json=res.data;
            if(json.re==1) {
              deferred.resolve({re: 1, data: ''});
            }
          }).catch(function(err) {
            var str='';
            for(var field in err)
              str+=err[field];
            console.error('error=' + str);
          })
      }
      else{
        deferred.resolve({re:1});
      }
      return deferred.promise;
    }


    $scope.videoCheck = function (orderId) {
      var deferred = $q.defer();
      if($scope.maintain.description.video!=null&&$scope.maintain.description.video!=undefined)
      {
        var server=Proxy.local()+'/svr/request?' +
          'request=uploadVideo&orderId='+orderId+'&fileName='+$scope.maintain.description.video+'&videoType=serviceVideo';
        var options = {
          fileKey:'file',
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token
          }
        };
        $cordovaFileTransfer.upload(server, $scope.maintain.description.video, options).then(function(res) {
          var json=res.response;
          json=JSON.parse(json);
          if(json.re==1){
            return   $http({
              method: "POST",
              url: Proxy.local() + "/svr/request",
              headers: {
                'Authorization': "Bearer " + $rootScope.access_token
              },
              data: {
                request: 'createVideoAttachment',
                info: {
                  orderId: orderId,
                  docType:'I7',
                  path:json.data
                }
              }
            });
          }else{
            deferred.reject({re:-1});
          }
        }).then(function(res) {
          var json=res.data;
          if(json.re==1) {
            var videoAttachId=json.data;
            if(json.re==1){
          return  $http({
                method: "POST",
                url: Proxy.local() + "/svr/request",
                headers: {
                  'Authorization': "Bearer " + $rootScope.access_token
                },
                data: {
                  request: 'updateServiceVideoAttachment',
                  info: {
                    orderId: orderId,
                    videoAttachId:videoAttachId
                  }
                }
              });
            }
          }
        }).then(function(res) {
          var json=res.data;
          if(json.re==1) {
            deferred.resolve({re: 1, data: ''});
          }
        }).catch(function(err) {
          var str='';
          for(var feild in err)
            str+=err[field];
          console.error('error=\r\n' + str);
        })
      }
      else{
       deferred.resolve({re:1});
      }
      return deferred.promise;
    }

    //车驾管服务
$scope.carService=function(){

  var order = null;
  var servicePersonIds = [];
  var personIds = [];
  $http({
    method: "POST",
    url: Proxy.local() + "/svr/request",
    headers: {
      'Authorization': "Bearer " + $rootScope.access_token
    },
    data: {
      request: 'generateCarServiceOrder',
      info: {
        carManager: $scope.carManage
      }
    }
  }).then(function (res) {
    var json = res.data;
    alert(json.re);
    if (json.re == 1) {
      order = json.data;
      return $http({
        method: "POST",
        url: Proxy.local() + "/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        },
        data: {
          request: 'getServicePersonsByUnits',
          info: {
            units: $rootScope.carManage.units
          }
        }
      });
    }
  }).then(function(res) {
    var json=res.data;
    if(json.re==1) {
      json.data.map(function(servicePerson,i) {
        servicePersonIds.push(servicePerson.servicePersonId);
        personIds.push(servicePerson.personId);
      });

      return $http({
        method: "POST",
        url: Proxy.local() + "/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        },
        data: {
          request: 'updateCandidateState',
          info: {
            orderId: order.orderId,
            servicePersonIds: servicePersonIds
          }
        }
      });
    }
  }).then(function (res) {
    var json = res.data;
    if (json.re == 1) {
      //TODO:append address and serviceType and serviceTime
      var serviceName = $scope.serviceTypeMap[$scope.carManage.serviceType];
      return $http({
        method: "POST",
        url: Proxy.local() + "/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        },
        data: {
          request: 'sendCustomMessage',
          info: {
            order: order,
            servicePersonIds: servicePersonIds,
            serviceName: serviceName,
            type: 'to-servicePerson',
            category:'carManage'
          }
        }
      });
    } else {
      return ({re: -1});
    }
  }).then(function (res) {
    var json = res.data;
    if (json.re == 1) {
      $scope.videoCheck(order.orderId).then(function (json) {
        alert('result of videocheck=\r\n' + json);
        if (json.re == 1) {
          alert('附件上传成功');
        }
        else
        {}
      });
    }
  }).catch(function (err) {
    var str = '';
    for (var field in err)
      str += err[field];
    console.error('error=\r\n' + str);
  });

}





    /*** bind append_maintainOrderPerson_modal***/
    $ionicModal.fromTemplateUrl('views/modal/append_maintainOrder_person.html',{
      scope:  $scope,
      animation: 'animated '+' bounceInUp',
      hideDelay:920
    }).then(function(modal) {
      $scope.append_maintainOrderPerson_modal = modal;
    });

    $scope.open_appendMaintainServiceOrderModal= function(){
      $scope.append_maintainOrderPerson_modal.show();
    };

    $scope.close_appendMaintainServiceOrderModal= function() {
      $scope.append_maintainOrderPerson_modal.hide();
    };
    /*** bind append_maintainOrderPerson_modal ***/



    //提交服务项目,生成服务订单
    $scope.commit_daily=function() {
      var orderId = null;
      $scope.maintain.subServiceTypes = [];
      $scope.dailys.map(function (daily, i) {
        if (daily.checked == true)
          $scope.maintain.subServiceTypes.push(daily.subServiceId);
      });
      if($scope.maintain.serviceType==''){
        $scope.maintain.serviceType='11';
      }
      if ($scope.maintain.estimateTime !== undefined && $scope.maintain.estimateTime !== null) {

        //如果为维修订单并且子项为事故维修
        if($scope.maintain.serviceType ==13)
            $scope.maintain.subServiceTypes = $scope.accident.type;

        if ($rootScope.maintain.unit !== undefined && $rootScope.maintain.unit !== null) {
          var order=null;
          $http({
            method: "POST",
            url: Proxy.local() + "/svr/request",
            headers: {
              'Authorization': "Bearer " + $rootScope.access_token
            },
            data: {
              request: 'getServicePersonByMaintenance',
              info: {
                maintenance: $rootScope.maintain.unit
              }
            }
          }).then(function (res) {
            var json = res.data;
            if (json.re == 1) {
              var servicePerson = json.data;
              $scope.maintain.servicePersonId = servicePerson.servicePersonId;
              var maintain=$scope.maintain;
              maintain.carId=$scope.carInfo.carId;
              alert("carid="+maintain.carId);
              return $http({
                method: "POST",
                url: Proxy.local() + "/svr/request",
                headers: {
                  'Authorization': "Bearer " + $rootScope.access_token
                },
                data: {
                  request: 'generateCarServiceOrder',
                  info: {
                    maintain:maintain
                  }
                }
              });
            } else {
              return {re: -1};
            }
          }).then(function(res) {
            var json = res.data;
            if (json.re == 1) {
              orderId=json.data.orderId;
              var serviceName = $scope.serviceTypeMap[$scope.maintain.serviceType];
              order=json.data;
              var servicePersonId = [];
              servicePersonId.push(order.servicePersonId);
              return $http({
                method: "POST",
                url: Proxy.local() + "/svr/request",
                headers: {
                  'Authorization': "Bearer " + $rootScope.access_token
                },
                data: {
                  request: 'sendCustomMessage',
                  info: {
                    order: order,
                    serviceItems: $scope.maintain.subServiceTypes,
                    servicePersonIds: servicePersonId,
                    serviceName: serviceName,
                    type: 'to-servicePerson'
                  }
                }
              });
            } else {
              return ({re: -1});
            }
          }).then(function (res) {
            var json = res.data;
            if (json.re == 1) {}
            else if(json.re==2) {
              console.error(json.data);
            }else{}
            $scope.close_maintenanceTAModal();
            console.log('service order has been generated');
            //检查是否需要上传附件信息
            $scope.audioCheck(order.orderId).then(function(json) {
              alert('result of audiocheck=\r\n' + json);
              if (json.re == 1) {
                console.log('音频附件上传成功')
              }
              else
              {}
            });
            $scope.videoCheck(order.orderId).then(function (json) {
              alert('result of videocheck=\r\n' + json);
              if (json.re == 1) {
                console.log('视频附件上传成功')
              }
              else
              {}


            });

          }).catch(function (err) {
            var str = '';
            for (var field in err)
              str += err[field];

          });
        }
        else//未选定服务人员
        {
          var order = null;
          var servicePersonIds = [];
          var personIds = [];
          var maintain=$scope.maintain;
          maintain.carId=$scope.carInfo.carId;
          $http({
            method: "POST",
            url: Proxy.local() + "/svr/request",
            headers: {
              'Authorization': "Bearer " + $rootScope.access_token
            },
            data: {
              request: 'generateCarServiceOrder',
              info: {
                maintain: maintain
              }
            }
          }).then(function (res) {
            var json = res.data;
            if (json.re == 1) {
              order = json.data;
              return $http({
                method: "POST",
                url: Proxy.local() + "/svr/request",
                headers: {
                  'Authorization': "Bearer " + $rootScope.access_token
                },
                data: {
                  request: 'getServicePersonsByUnits',
                  info: {
                    units: $rootScope.maintain.units
                  }
                }
              });
            }
          }).then(function(res) {
            var json=res.data;
            if(json.re==1) {
                json.data.map(function(servicePerson,i) {
                  servicePersonIds.push(servicePerson.servicePersonId);
                  personIds.push(servicePerson.personId);
                });

              return $http({
                method: "POST",
                url: Proxy.local() + "/svr/request",
                headers: {
                  'Authorization': "Bearer " + $rootScope.access_token
                },
                data: {
                  request: 'updateCandidateState',
                  info: {
                    orderId: order.orderId,
                    servicePersonIds: servicePersonIds,
                    candidate:1
                  }
                }
              });
            }
          }).then(function (res) {
            var json = res.data;
            if (json.re == 1) {
              //TODO:append address and serviceType and serviceTime
              var serviceName = $scope.serviceTypeMap[$scope.maintain.serviceType];
              return $http({
                method: "POST",
                url: Proxy.local() + "/svr/request",
                headers: {
                  'Authorization': "Bearer " + $rootScope.access_token
                },
                data: {
                  request: 'sendCustomMessage',
                  info: {
                    order: order,
                    serviceItems: $scope.maintain.subServiceTypes,
                    servicePersonIds: servicePersonIds,
                    serviceName: serviceName,
                    type: 'to-servicePerson'
                  }
                }
              });
            } else {
              return ({re: -1});
            }
          }).then(function (res) {
            var json = res.data;
            console.log('**************************************************');
            console.log('**************************************************');
            console.log('**************************************************');
            console.log('**************go into media check*****************');
              $scope.videoCheck(order.orderId).then(function (json) {
                alert('result of videocheck=\r\n' + json);
                if (json.re == 1) {
                  alert('附件上传成功');
                }
                else
                {}
              });
              $scope.audioCheck(order.orderId).then(function(json) {
                alert('result of audioCheck=\r\n' + json);
                if(json.re==1) {
                  alert('音频附件上传成功');
                }else{}
              });

          }).catch(function (err) {
            var str = '';
            for (var field in err)
              str += err[field];
            alert('error=\r\n' + str);
          });

        }
      }
    }


    //车驾管服务提交
    $scope.commit_carManage_service=function(){

      if($scope.carManage.estimateTime!==undefined&&$scope.carManage.estimateTime!==null)
      {
        var unit=null;
        var units=null;
        var servicePerson=null;
        var servicePlace=null;
        $scope.carManage.carId=$scope.carInfo.carId;
        switch($scope.service)
        {
          case '代办车辆年审':
            servicePerson=$scope.carManage.carValidate.servicePerson;
            unit=$scope.carManage.carValidate.unit;
            units=$scope.carManage.carValidate.units;
            servicePlace=$scope.carManage.carValidate.unit.unitName;
            break;
          case '代办行驶证年审':
            servicePerson=$scope.carManage.paperValidate.servicePerson;
            unit=$scope.carManage.paperValidate.unit;
            units=$scope.carManage.paperValidate.units;
            servicePlace=$scope.carManage.carValidate.unit.unitName;
            break;
          case '接送机':
            servicePerson=$scope.carManage.airportTransfer.servicePerson;
            unit=$scope.carManage.airportTransfer.unit;
            units=$scope.carManage.airportTransfer.units;
            servicePlace=JSON.stringify($scope.carManage.airportTransfer.destiny)
            break;
          case '取送车':
            servicePerson=$scope.carManage.parkCar.servicePerson;
            unit=$scope.carManage.parkCar.unit;
            units=$scope.carManage.parkCar.units;
            servicePlace=JSON.stringify($scope.carManage.parkCar.destiny);
            break;
        }

        if(unit!==undefined&&unit!==null)//已选维修厂
        {

          $scope.carManage.servicePersonId = servicePerson.servicePersonId;
          $http({
              method: "POST",
              url: Proxy.local() + "/svr/request",
              headers: {
                'Authorization': "Bearer " + $rootScope.access_token
              },
              data: {
                request: 'generateCarServiceOrder',
                info: {
                  carManage: $scope.carManage,
                  servicePlace:servicePlace
                }
              }
            }).then(function(res) {
            var json = res.data;
            if (json.re == 1) {
              //TODO:append address and serviceType and serviceTime
              var serviceName = $scope.serviceTypeMap[$scope.maintain.serviceType];
              var order=json.data;
              var servicePersonIds = [order.servicePersonId];
              return $http({
                method: "POST",
                url: Proxy.local() + "/svr/request",
                headers: {
                  'Authorization': "Bearer " + $rootScope.access_token
                },
                data: {
                  request: 'sendCustomMessage',
                  info: {
                    order: order,
                    serviceItems: $scope.maintain.subServiceTypes,
                    servicePersonIds: servicePersonIds,
                    serviceName: serviceName,
                    category:'carManage',
                    type: 'to-servicePerson'
                  }
                }
              });
            } else {
              return ({re: -1});
            }
          }).then(function (res) {
            var json = res.data;
            if (json.re == 1) {
              $scope.close_maintenanceTAModal();
              console.log('carManage order has been generated');
              //检查是否需要上传附件信息
              $scope.videoCheck(json.orderId).then(function (json) {
                alert('result of videocheck=\r\n' + json);
                if (json.re == 1) {
                  console.log('附件上传成功')
                }
                else
                {}
              })
            }
          }).catch(function (err) {
            var str = '';
            for (var field in err)
              str += err[field];
          });
        }else if($scope.carManage.servicePerson!==undefined&&$scope.carManage.servicePerson!==null)//如果选择了服务人员却没选维修厂
        {

          var servicePerson = $scope.carManage.servicePerson;
          $scope.carManage.servicePersonId = servicePerson.servicePersonId;

          $http({
          method: "POST",
          url: Proxy.local() + "/svr/request",
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token
          },
          data: {
            request: 'generateCarServiceOrder',
            info: {
              maintain: $scope.carManage
            }
          }}).then(function(res) {
            var json = res.data;
            if (json.re == 1) {
              //TODO:append address and serviceType and serviceTime
              var serviceName = $scope.serviceTypeMap[$scope.maintain.serviceType];
              var order=json.data;
              var servicePersonIds = [order.servicePersonId];
              return $http({
                method: "POST",
                url: Proxy.local() + "/svr/request",
                headers: {
                  'Authorization': "Bearer " + $rootScope.access_token
                },
                data: {
                  request: 'sendCustomMessage',
                  info: {
                    order: order,
                    serviceItems: $scope.maintain.subServiceTypes,
                    servicePersonIds: servicePersonIds,
                    serviceName: serviceName,
                    category:'carManage',
                    type: 'to-servicePerson'
                  }
                }
              });
            } else {
              return ({re: -1});
            }
          }).then(function (res) {
            var json = res.data;
            if (json.re == 1) {
              $scope.close_maintenanceTAModal();
              console.log('carManage order has been generated');
              //检查是否需要上传附件信息
              $scope.videoCheck(json.orderId).then(function (json) {
                alert('result of videocheck=\r\n' + json);
                if (json.re == 1) {
                  console.log('附件上传成功')
                }
                else
                {}
              })
            }
          }).catch(function (err) {
            var str = '';
            for (var field in err)
              str += err[field];
          });
        }
        else//未选定维修厂也未选定服务人员
          {
            var order = null;
            var servicePersonIds = [];
            var personIds = [];
            $http({
              method: "POST",
              url: Proxy.local() + "/svr/request",
              headers: {
                'Authorization': "Bearer " + $rootScope.access_token
              },
              data: {
                request: 'generateCarServiceOrder',
                info: {
                  carManage: $scope.carManage
                }
              }
            }).then(function (res) {
              var json = res.data;
              if (json.re == 1) {
                order=json.data;

                return $http({
                  method: "POST",
                  url: Proxy.local() + "/svr/request",
                  headers: {
                    'Authorization': "Bearer " + $rootScope.access_token
                  },
                  data: {
                    request: 'getServicePersonsByUnits',
                    info: {
                      units: units
                    }
                  }
                });
              }
            }).then(function(res) {
              var json=res.data;
              if(json.re==1) {
                json.data.map(function(servicePerson,i) {
                  servicePersonIds.push(servicePerson.servicePersonId);
                  personIds.push(servicePerson.personId);
                });
                return $http({
                  method: "POST",
                  url: Proxy.local() + "/svr/request",
                  headers: {
                    'Authorization': "Bearer " + $rootScope.access_token
                  },
                  data: {
                    request: 'updateCandidateState',
                    info: {
                      orderId: order.orderId,
                      servicePersonIds: servicePersonIds,
                      candidate:1
                    }
                  }
                });
              }
            }).then(function (res) {
              var json = res.data;
              if (json.re == 1) {
                //TODO:append address and serviceType and serviceTime
                var serviceName = $scope.serviceTypeMap[$scope.maintain.serviceType];
                return $http({
                  method: "POST",
                  url: Proxy.local() + "/svr/request",
                  headers: {
                    'Authorization': "Bearer " + $rootScope.access_token
                  },
                  data: {
                    request: 'sendCustomMessage',
                    info: {
                      order: order,
                      serviceItems: $scope.maintain.subServiceTypes,
                      servicePersonIds: servicePersonIds,
                      serviceName: serviceName,
                      type: 'to-servicePerson'
                    }
                  }
                });
              } else {
                return ({re: -1});
              }
            }).then(function (res) {
              var json = res.data;
              $scope.videoCheck(order.orderId).then(function (json) {
                alert('result of videocheck=\r\n' + json);
                if (json.re == 1) {
                  alert('附件上传成功');
                }
                else
                {}
              });
              $scope.audioCheck(order.orderId).then(function(json) {
                alert('result of audioCheck=\r\n' + json);
                if(json.re==1) {
                  console.log('音频附件上传成功');
                }else{}
              });

            }).catch(function (err) {
              var str = '';
              for (var field in err)
                str += err[field];
              console.error('error=\r\n' + str);
            });

          }

      }

    }


    $scope.service_select=function(services) {
      if (services !== undefined && services !== null &&services.length > 0)
      {
        var buttons=[];
        services.map(function(service,i) {
          buttons.push({text: service});
        });
        $ionicActionSheet.show({
          buttons:buttons,
          titleText: '选择你的保额',
          cancelText: 'Cancel',
          buttonClicked: function(index) {
            $scope.service = services[index];
            return true;
          },
          cssClass:'motor_insurance_actionsheet'
        });
      }
      else
      {}
    }

    //查询已绑定车辆,并显示车牌信息
    $scope.selectCarInfoByCarNum=function(item,modal){
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
          buttons.push({text: "<b>创建新车</b>"});
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
                if(modal!==undefined&&modal!==null)
                  modal.hide();
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

    $scope.actionSheet_show = function() {

      // Show the acti2e1on sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: '<b>Share</b> This' },
          { text: '<b>Share</b> This' },
          { text: '<b>Share</b> This' },
          { text: '<b>Share</b> This' },
          { text: '<b>Share</b> This' },
          { text: '<b>Share</b> This' },
          { text: '<b>Share</b> This' },
          { text: '<b>Share</b> This' },
          { text: '<b>Share</b> This' },
          { text: '<b>Share</b> This' },
          { text: 'Move' }
        ],
        titleText: 'select your favourite project ',
        cancelText: 'Cancel',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          return true;
        },
        cssClass:'center'
      });
    };




    $scope.addresses_select=function(item,field) {

        var buttons=[];
        addresses.map(function(address,i) {
          buttons.push({text: address});
        });
        var address=$scope.address;
        $ionicActionSheet.show({
          buttons:buttons,
          titleText: '选择你的保额',
          cancelText: 'Cancel',
          buttonClicked: function(index) {
            $scope.address = $scope.addresses[index];
            return true;
          },
          cssClass:'motor_insurance_actionsheet'
        });

    }



    $scope.service_persons=['person1','person2','person3'];
    $scope.service_person=$scope.service_persons[0];


    //车驾管选择服务人员
    $scope.service_person_select=function() {

      $http({
        method: "POST",
        url: Proxy.local()+"/svr/request",
        // url: "http://192.168.1.106:3000/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        },
        data:
        {
          request:'fetchServicePersonInHistory'
        }
      }).then(function(res) {
        var json=res.data;
        if(json.re==1) {
          var servicePersons=json.data;
          var buttons=[];
          servicePersons.map(function(servicePerson,i) {
            var item=servicePerson;
            item.text=servicePerson.perName;
            buttons.push(item);
          });
         var hideSheet= $ionicActionSheet.show({
            buttons:buttons,
            titleText: '选择服务人员',
            cancelText: 'Cancel',
            buttonClicked: function(index) {
              var person=buttons[index];
              $scope.carManage.servicePerson=person;
              $http({
                method: "POST",
                url: Proxy.local()+"/svr/request",
                // url: "http://192.168.1.106:3000/svr/request",
                headers: {
                  'Authorization': "Bearer " + $rootScope.access_token
                },
                data:
                {
                  request:'fetchUnitByUnitId',
                  info:{
                    unitId:person.unitId
                  }
                }
              }).then(function(res) {
                var json=res.data;
                if(json.re==1) {
                  var unit=json.data;
                  $scope.carManage.servicePlace=unit.unitName;
                  if($rootScope.carManage==undefined||$rootScope.carManage==null)
                    $rootScope.carManage={};
                  $rootScope.carManage.unit=unit;
                }
              });

              hideSheet();
              return true;
            },
            cssClass:'motor_insurance_actionsheet'
          });
        }
      }).catch(function(err) {
        var str='';
        for(var field in err) {
          str+=err[field];
        }
        console.error('error=\r\n' + str);
      });

    }




    $scope.lifeInsuranceder_insuranceType_select=function()
    {

        var buttons=[{text:'重疾'},{text:'健康'},{text:'理财'}];
        $ionicActionSheet.show({
          buttons:buttons,
          titleText: '选择你需要的保障',
          cancelText: 'Cancel',
          buttonClicked: function(index) {
            $scope.life_insurance.order.insuranceType = buttons[index].text;
            return true;
          },
          cssClass:'motor_insurance_actionsheet'
        });
    }


    $scope.lifeInsuranceder_relation_select=function(){
      var buttons=[{text:'自己'},{text:'老人'},{text:'子女'},{text:'配偶'}];

      $ionicActionSheet.show({
        buttons:buttons,
        titleText: '选择投保人与被保险人关系',
        cancelText: 'Cancel',
        buttonClicked: function(index) {
          $scope.life_insurance.insuranceder.relation = buttons[index].text;
          return true;
        },
        cssClass:'motor_insurance_actionsheet'
      });
    };


    //添加投保人
    $scope.append_insurer=function(props){
      $scope.ionicPopup(props.title,props.item,props.field,$scope.open_appendInsurerModal);

    }

    //添加被保险人
    $scope.append_insuranceder=function(props){
      $scope.ionicPopup(props.title,props.item,props.field,$scope.open_appendInsurancederModal);

    }

    //添加受益人
    $scope.append_benefiter=function(props){
      $scope.ionicPopup(props.title,props.item,props.field,$scope.open_appendBenifiterModal);

    }




    $scope.Setter=function(type,item,field,cmd){
      switch(type)
      {
        case 'remote':
          $http({
            method: "POST",
            url: "/proxy/node_server/svr/request",
            // url: "http://192.168.1.106:3000/svr/request",
            headers: {
              'Authorization': "Bearer " + $rootScope.access_token,
            },
            data:
            {
              request:cmd
            }
          }).then(function(res) {
            var data=res.data;
            if(data.re==2)
            {
              //var confirmPopup = $ionicPopup.confirm({
              //  title: '<strong>选择投保人?</strong>',
              //  template: '可选人员没有,是否进行添加?',
              //  okText: '添加',
              //  cancelText: '取消'
              //});
              //
              //confirmPopup.then(function (res) {
              //  if (res) {
              //    //TODO:bind new relative customer
              //    $scope.open_appendPersonModal();
              //    $scope.life_insurance.person.perType=1;
              //  } else {
              //    // Don't close
              //  }
              //});



            }else if(date.re==1)
            {
              var buttons=[];
              data.map(function(item,i) {
                buttons.push({text: item});
              });
              $ionicActionSheet.show({
                buttons:buttons,
                titleText: '',
                cancelText: '取消',
                buttonClicked: function(index) {
                  $scope[item][field] = buttons[index].text;
                  return true;
                },
                cssClass:'motor_insurance_actionsheet'
              });
            }else{}

          }).catch(function(err) {
            var str='';
            for(var field in err)
              str += field + ':' + err[field];
            alert('error=\r\n' + str);
          });
              break;
        default:
          break;
      }
    };




    $scope.ionicPopup=function(title,item,field,cb) {

      var buttons=[];
      if(Object.prototype.toString.call(cb)=='[object Array]')
      {
        buttons.push({text: '<b>取消</b>', type: 'button-assertive'});
        cb.map(function(item,i) {
          buttons.push({text: item.text, type: 'button-positive', onTap: item.cb});
        });
      }else{
        buttons=[
          {
            text: '<b>取消</b>',
            type:'button-assertive'
          },
          {
            text: '<b>自己</b>',
            type: 'button-positive',
            onTap: function(e) {
              item[field]='self';
            }
          },
          {
            text: '<b>添加</b>',
            type: 'button-positive',
            onTap: function(e) {
              cb();
              //$scope.open_appendPersonModal();
              //$scope.life_insurance.person.perType=1;
            }
          }
        ];
      }

      var myPopup = $ionicPopup.show({
        template: '可选人员没有,是否进行添加',
        title: '<strong>选择投保人?</strong>',
        subTitle: '',
        scope: $scope,
        buttons: buttons
      });

      myPopup.then(function(res) {
        console.log('...');
      });
    };

    $scope.life_insurance.person=
    {};



    $scope.getBin=function(item,field){
      var deferred=$q.defer();
      var absPath=item[field];
      var isAndroid = ionic.Platform.isAndroid();
      if(isAndroid)
      {
        if(absPath.indexOf('Android/data/')!=-1)//externalApplicationStorageDirectory
        {
          var re=/Android\/data\/.*?\/(.*)$/.exec(absPath);
          alert('scirror path=\r\n'+re[1]);
          $cordovaFile.readAsBinaryString( cordova.file.externalApplicationStorageDirectory,re[1])
            .then(function (success) {
              alert('read binary of img success');
              deferred.resolve({re:1,data:success});
            }, function (error) {
              // error
              var err = '';
              for (var field in error)
                err += field + ':' + error[field];
              deferred.reject('image read encounter error=\r\n' + err);
            });
        }
      }
      return deferred.promise;
    }

    $scope.detectImg=function(item){
      var deferred=$q.defer();
      for(var field in item)
      {
        //检测是否有图片字段
        var reg=/_img$/;
        if(reg.exec(field))
        {
          $scope.getBin(item,field).then(function(res) {
            var gen_feild=field.replace('_img','Photo');
            var type=null;
            alert(item[field]);
            if(item[field].toString().indexOf('.jpg')!=-1)
              type = 'jpg';
            else if(item[field].toString().indexOf('.png')!=-1)
              type='png';
            else{}
            item[gen_feild]={
              type:type,
              bin:res
            }
            alert('photo field=\r\n' + gen_feild);
            deferred.resolve({re: 1,data:item[gen_feild]});
          }).catch(function(err) {
            deferred.reject(err.toString());
          });
        }
      }

      return deferred.promise;
    }

    //提交统一函数
    $scope.upload=function(cmd,item,field){

      var personId=null;
      $http({
          method: "POST",
          url: Proxy.local()+'/svr/request',
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token,
          },
          data:
          {
            request:cmd,
            info:item
          }
        })
        .then(function(res) {

          if(res.data.re==1){
            var json =res.data;
            personId=json.data.personId;
            alert('personid='+personId);
            var suffix='';
             var imageType='perIdCard';
            alert('path='+$scope.life_insurance.insurer.perIdCard1_img);
            if($scope.life_insurance.insurer.perIdCard1_img.indexOf('.jpg')!=-1) 
              suffix='jpg';
             else if($scope.life_insurance.insurer.perIdCard1_img.indexOf('.png')!=-1) 
              suffix='png'; 
            else{}
             var server=Proxy.local()+'/svr/request?request=uploadPhoto' + 
               '&imageType='+imageType+'&suffix='+suffix+
               '&filename='+'perIdCard1_img'+'&personId='+personId; 
            var options = { 
              fileKey:'file', 
              headers: { 
                'Authorization': "Bearer " + $rootScope.access_token 
              } 
            };

            var perIdAttachId1=null;
            var perIdAttachId2=null;

            $cordovaFileTransfer.upload(server, $scope.life_insurance.insurer.perIdCard1_img, options) 
              .then(function(res) { 
                alert('upload perIdCard1 success'); 
                for(var field in res) { 
                  alert('field=' + field + '\r\n' + res[field]); 
                } 
                var su=null 
                if($scope.life_insurance.insurer.perIdCard1_img.indexOf('.jpg')!=-1) 
                  su='jpg'; 
                else if($scope.life_insurance.insurer.perIdCard1_img.indexOf('.png')!=-1) 
                  su='png'; 
                alert('suffix=' + su); 
                return $http({ 
                  method: "POST", 
                  url: Proxy.local()+"/svr/request", 
                  headers: { 
                    'Authorization': "Bearer " + $rootScope.access_token, 
                  }, 
                  data: 
                  { 
                    request:'createPhotoAttachment', 
                    info:{ 
                      imageType:'perIdCard', 
                      filename:'perIdAttachId1', 
                      suffix:su, 
                      docType:'I1' ,
                      personId:personId
                    } 
                  } 
                }); 
              })
              .then(function(res) { 
                var json=res.data; 
               if(json.re==1) {
                 perIdAttachId1=json.data; 
                 alert('perIdAttachId1=' + perIdAttachId1); 
                 var su=null; 
                 if($scope.life_insurance.insurer.perIdCard2_img.indexOf('.jpg')!=-1) 
                   su='jpg'; 
                 else if($scope.life_insurance.insurer.perIdCard2_img.indexOf('.png')!=-1) 
                   su='png'; 
                 server=Proxy.local()+'/svr/request?request=uploadPhoto' + 
                   '&imageType='+imageType+'&suffix='+su+'&filename='+'perIdAttachId2'+'&personId='+personId; 
                 return  $cordovaFileTransfer.upload(server, $scope.life_insurance.insurer.perIdCard2_img, options)
                   .then(function(res) {
                     alert('upload perIdCard2 success');
                     for(var field in res) {
                       alert('field=' + field + '\r\n' + res[field]);
                     }
                     return $http({
                       method: "POST",
                       url: Proxy.local()+"/svr/request",
                       headers: {
                         'Authorization': "Bearer " + $rootScope.access_token,
                       },
                       data:
                       {
                         request:'createPhotoAttachment',
                         info:{
                           imageType:'perIdCard',
                           filename:'perIdAttachId2',
                           suffix:su,
                           docType:'I1' ,
                           personId:personId
                         }
                       }
                     });
                   }) .then(function(res) {
                     var json=res.data;
                     if(json.re==1){
                       perIdAttachId2=json.data;
                       return $http({
                         method: "POST",
                         url: Proxy.local()+"/svr/request",
                         headers: {
                           'Authorization': "Bearer " + $rootScope.access_token,
                         },
                         data:
                         {
                           request:'createInsuranceInfoPersonInfo',
                           info:{
                             perIdAttachId1:perIdAttachId1,
                             perIdAttachId2:perIdAttachId2,
                             personId:personId
                           }
                         }
                       });
                     }
                   })
               } 
              })
          }else{}

          alert('...it is back')
        }).then(function(res) {

      })
        .catch(function(err) {
          var str='';
          for(var field in err)
            str+=err[field];
          alert('error=\r\n' + str);
      });

    }

    //从服务器拉取数据
    /**
     *  1.filter,用于actionSheet展示的字段
     *
     */
    $scope.Select=function(type,filter,data,url,item,fields,failOb) {
      var buttons=[];

      switch (type) {
        case 'remote':
          $http({
            method: "POST",
            url: "proxy/node_server/svr/request",
            headers: {
              'Authorization': "Bearer " + $rootScope.access_token
            },
            data: {
              request: url

            }
          }).then(function (res) {
            var json=res.data;
            json.data.map(function(item,i) {
              var btn=item;
              btn.text = item[filter];
              buttons.push(btn);
            });
            if(buttons.length==0) {
              if(failOb!==undefined&&failOb!==null)
              {
                var cb=failOb.cb;
                cb(failOb.title,item,fields);
              }
            }else{
              $ionicActionSheet.show({
                buttons:buttons,
                titleText: '',
                cancelText: '取消',
                buttonClicked: function(index) {
                  fields.map(function(field) {
                    item[field]=buttons[index][field];
                  });
                  return true;
                },
                cssClass:'motor_insurance_actionsheet'
              });
            }
          });
          break;
        case 'local':
              if(data!==undefined&&data!==null) {
                data.map(function(item,i) {
                  var btn=item;
                  btn.text = item[filter];
                  buttons.push(btn);
                });
              }else{
                if(failOb!==undefined&&failOb!==null)
                {
                  var cb=failOb.cb;
                  cb(failOb.title,item,fields);
                }
              }
          break;
        default:
          break;
      }
    };

    /*** bind select_relative modal ***/
    $ionicModal.fromTemplateUrl('views/modal/select_relative.html',{
      scope:  $scope,
      animation: 'animated '+' bounceInUp',
      hideDelay:920
    }).then(function(modal) {
      $scope.select_relative={
        modal:modal
      }
    });

    $scope.open_selectRelativeModal= function(item,field,matched){
      $scope.select_relative.modal.show();
      if(item!==undefined&&item!==null&&field!==undefined&&field!==null)
      {
        $scope.select_relative.item=item;
        $scope.select_relative.field=field;
        $scope.select_relative.matched=matched;
      }
    };

    $scope.close_selectRelativeModal= function(cluster) {
      if(cluster!==undefined&&cluster!==null)
      {
        cluster.map(function(singleton,i) {
          if(singleton.checked==true)
          {
            if($scope.select_relative.item!==undefined&&$scope.select_relative.item!==null
            &&$scope.select_relative.field!==undefined&&$scope.select_relative.field!==null)
            {
              if($scope.select_relative.matched!==undefined&&$scope.select_relative.matched!==null)
                $scope.select_relative.item[$scope.select_relative.field]=singleton[$scope.select_relative.matched];
              else
                $scope.select_relative.item[$scope.select_relative.field]=singleton;
            }
          }
        });
      }
      $scope.select_relative.modal.hide();
    };
    /*** bind select_relative modal ***/



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




    $scope.ActionSheet= function (options,item,field,addon_field,url,fail) {
      if((options==null||options==undefined)&&url!==undefined&&url!==null)//远程
      {
        $http({
          method: "POST",
          url: "proxy/node_server/svr/request",
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token
          },
          data:
          {
            request:url
          }
        }).then(function(res) {
          var json=res.data;
          if(json.re==2)
          {
            if(fail!==undefined&&fail!==null)
            {
              var cb=fail.cb;
              cb(fail.title,item,field);
            }
          }else{
            var buttons=[];
            json.data.map(function(item,i) {
              buttons.push({text: item.perName});
            });
            $ionicActionSheet.show({
              buttons:buttons,
              titleText: '',
              cancelText: '取消',
              buttonClicked: function(index) {
                item[field] = buttons[index].text;
                item.perType=index+1;
                if(addon_field!==undefined&&addon_field!==null)
                  item[addon_field]=(index+1);
                return true;
              },
              cssClass:'motor_insurance_actionsheet'
            });
          }
        });
      }
      else{//本地

        var buttons=[];
        options.map(function(item,i) {
          buttons.push({text: item});
        });
        $ionicActionSheet.show({
          buttons:buttons,
          titleText: '',
          cancelText: '取消',
          buttonClicked: function(index) {
            item[field] = buttons[index].text;
            if(addon_field!==undefined&&addon_field!==null)
              item[addon_field]=(index+1);
            return true;
          },
          cssClass:'motor_insurance_actionsheet'
        });
      }
    }

    $scope.Toggle=function(type,item,field)
    {
      switch(type)
      {
        case 'boolean':
          if(item[field]!=true)
            item[field]=true;
          else
            item[field]=false;
          break;
      }
    }

    $scope.Mutex=function(item,field,cluster) {
      if(item[field])
      {
        item[field]=false;
      }
      else{
        item[field]=true;
        cluster.map(function(cell,i) {
            if(cell.carNum!=item.carNum)
                cell[field]=false;
        })
      }
    };

      ////intial BMap service
      //BaiduMapService.getBMap(function(BMap){
      //
      //  /**
      //   * 自身定位
      //   */
      //  var geolocation = new BMap.Geolocation();
      //  geolocation.getCurrentPosition(function(r){
      //    if(this.getStatus() == BMAP_STATUS_SUCCESS){
      //      //var mk = new BMap.Marker(r.point);
      //      //map.addOverlay(mk);
      //      //map.panTo(r.point);
      //      //alert('您的位置：'+r.point.lng+','+r.point.lat);
      //    }
      //    else {
      //      //alert('failed'+this.getStatus());
      //    }
      //  },{enableHighAccuracy: true});
      //
      //});


    $scope.add_op=function(item,field){
      if(item[field]==undefined||item[field]==null)
        item[field]=0;
      item[field]++;
    }

    $scope.minus_op=function(item,field)
    {
      if(item[field]==undefined||item[field]==null)
      {
        item[field] = 0;
        return ;
      }
      if(item[field]>0)
        item[field]--;
    }


    $scope.getLastCarInsuranceOrderSerial=function(){
        $http({
          method: "POST",
          url: "/proxy/node_server/svr/request",
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token,
          },
          data:
          {
            request:'getCurDayOrderNumTest',
            info:{
              type:'carInsurance'
            }
          }
        })
        .then(function(res) {
            alert('...it is back')
          })
        .catch(function(err) {
            var str='';
            for(var field in err) {
              str += err[field];
            }
            alert('err=\r\n' + str);
          });
    }

    /*** bind maintenance_t&a ***/
    $ionicModal.fromTemplateUrl('views/modal/maintenance_t_a.html',{
      scope:  $scope,
      animation: 'animated '+'bounceInUp',
      hideDelay:920
    }).then(function(modal) {
      $scope.maintenance_t_a_modal = modal;
    });
    $ionicModal.fromTemplateUrl('views/modal/carManage_modal.html',{
      scope:  $scope,
      animation: 'animated '+'bounceInUp',
      hideDelay:920
    }).then(function(modal) {
      $scope.carManage_modal = modal;
    });

    //提交服务项目
    $scope.open_maintenanceTAModal= function(cb){
      if(cb!==undefined&&cb!==null)
        $scope.maintenance_t_a_modal_cb=cb;
      $scope.maintenance_t_a_modal.show();
    };
    $scope.open_carManageModal=function(){
      $scope.carManage_modal.show();
    };
    $scope.close_carManageModal=function(){
      $scope.carManage_modal.hide();
    }

    $scope.close_maintenanceTAModal= function() {
      $scope.maintenance_t_a_modal.hide();
      if($scope.maintenance_t_a_modal_cb!==undefined&&
        $scope.maintenance_t_a_modal_cb!==null&&
        Object.prototype.toString.call($scope.maintenance_t_a_modal_cb)=='[object Function]')
      {
        $scope.maintenance_t_a_modal_cb();
      }
    };
    /*** bind maintenance_t&a ***/

    /*** bind carManage_t&a ***/
    $ionicModal.fromTemplateUrl('views/modal/carManage_t_a.html',{
      scope:  $scope,
      animation: 'animated '+'bounceInUp',
      hideDelay:920
    }).then(function(modal) {
      $scope.carManage_t_a_modal = modal;
    });

    //提交车驾管项目
    $scope.open_carManageTAModal= function(cb){
      if(cb!==undefined&&cb!==null)
        $scope.carManage_t_a_modal_cb=cb;
      $scope.carManage_t_a_modal.show();
    };

    $scope.close_carManageTAModal= function() {
      $scope.carManage_t_a_modal.hide();
      if($scope.carManage_t_a_modal_cb!==undefined&&
        $scope.carManage_t_a_modal_cb!==null&&
        Object.prototype.toString.call($scope.carManage_t_a_modal_cb)=='[object Function]')
      {
        $scope.carManage_t_a_modal_cb();
      }
    };
    /*** bind carManage_t&a ***/


    $rootScope.$on('to-child',function(event,data) {
      console.log('...');
    });

    //维修厂的绑定事件
    $rootScope.$on('unit-choose',function(event,da) {

      console.log('...');
      var ob=JSON.parse(da);
      var unit=ob.unit;
      var units=ob.units;
      var unitId=unit.unitId;
      $http({
        method: "POST",
        url: Proxy.local()+"/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token,
        },
        data:
        {
          request:'getServicePersonByUnitId',
          info:{
            unitId:unitId
          }
        }
      }).then(function(res) {
        var json=res.data;
        if(json.re==1) {
          var servicePerson=json.data;
          switch (ob.type) {
            case 'carValidate':
              if(ob.units!==undefined&&ob.units!==null)
              {
                $scope.carManage.carValidate.units=units;
              }else{
                $scope.carManage.carValidate.unit=unit;
                $scope.carManage.carValidate.servicePerson=servicePerson;
                $scope.carManage.carValidate.servicePlace=unit.unitName;
              }
              break;
            case 'airport':
              $scope.carManage.airportTransfer.unit=unit;
              $scope.carManage.airportTransfer.servicePerson=servicePerson;
              $scope.carManage.airportTransfer.servicePlace=unit.unitName;
              break;
            case 'parkCar':
              $scope.carManage.parkCar.unit=unit;
              $scope.carManage.parkCar.servicePerson=servicePerson;
              $scope.carManage.parkCar.servicePlace=unit.unitName;
              break;
            case 'paperValidate':
              $scope.carManage.paperValidate.unit=unit;
              $scope.carManage.paperValidate.servicePerson=servicePerson;
              $scope.carManage.paperValidate.servicePlace=unit.unitName;
              break;
            default:
              break;
          }
        }
      }).catch(function(err) {
        var str='';
        for(var field in str) {
          str+=str[field];
        }
        console.error('error=\r\n' + str);
      })
    });

    $scope.selfGeoLocation=function(item,field){
      var geolocation = new $scope.bMap.Geolocation();
        $ionicLoading.show({
          template: 'Loading...',
          showBackdrop:true,
          animation:'fade-in'
        });
      geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
          //var mk = new BMap.Marker(r.point);
          //map.addOverlay(mk);
          //map.panTo(r.point);
          item[field]={lng:r.point.lng,lat:r.point.lat};
          $scope.$apply();
          $http({
            method: "POST",
            url: "/proxy/node_server/svr/request",
            headers: {
              'Authorization': "Bearer " + $rootScope.access_token,
            },
            data:
            {
              request:'uploadGeolocation',
              info:{
                geolocation:item[field]
              }
            }
          }).then(function(res) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: '',
              template: '您的地理位置已同布'
            });


          }).catch(function(err) {
            var str='';
            for(var field in err)
              str+=err[field];
            console.error('error=\r\n' + str);
            $ionicLoading.hide();
          });

        }
        else {
          alert('failed'+this.getStatus());
        }
      },{enableHighAccuracy: true});
    }


    $scope.pickMaintain=function(locateType,index){
      if($scope.maintain.description.text!==undefined&&$scope.maintain.description.text!==null)
        $rootScope.maintain.description.text=$scope.maintain.description.text;
      if($scope.maintain.description.audio!==undefined&&$scope.maintain.description.audio!==null)
        $rootScope.maintain.description.audio=$scope.maintain.description.audio;
      //TODO:syn dailys
      if($scope.dailys!==undefined&&$scope.dailys!==null)
      {
        $rootScope.maintain.dailys=$scope.dailys;
      }

      $state.go('locate_maintain_nearby',{locate:JSON.stringify({locateType:locateType,locateIndex:index})});
    };

    $scope.pickMaintainDaily=function(locateType,index) {

      if($scope.dailys!==undefined&&$scope.dailys!==null)
      {
        $rootScope.maintain.dailys=$scope.dailys;
      }
      $state.go('locate_maintain_daily',{locate:JSON.stringify({locateType: locateType,locateIndex:index})});
    };

    $scope.pickAirportNearby=function(locateType) {
      $state.go('locate_airport_nearby', {locateType: locateType});
    };

    $scope.pickParkCarNearby=function(locateType) {
      $state.go('locate_parkCar_nearby', {locateType: locateType});
    };

    $scope.pickPaperValidate=function(locateType) {
      $state.go('locate_paperValidate_nearby', {locateType: locateType});
    };


    /*** bind matching_car_info modal ***/
    $ionicModal.fromTemplateUrl('views/modal/matching_car_info.html',{
      scope:  $scope,
      animation: 'animated '+'bounceInUp',
      hideDelay:920
    }).then(function(modal) {
      $scope.matching_car_info_modal = modal;
    });

    $scope.open_matchingCarInfoModal= function(){
      $scope.matching_car_info_modal.show();
    };

    $scope.close_matchingCarInfoModal= function() {
      $scope.matching_car_info_modal.hide();
    };
    /*** bind matching_car_info modal ***/



    $scope.getCarInfoByCarNum=function(item){
      if($scope.doFilterCarNumFlag)
      {
        $http({
          method: "post",
          url: "/proxy/node_server/svr/request",
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token,
            info:{
              perIdCard:item
            }
          },
          data:
          {
            request:'getCarInfoByCarNum',
            info:{
              carNum:item
            }
          }
        }).then(function(res) {
          var json=res.data;
          if(json.re==1) {
            var confirmPopup = $ionicPopup.confirm({
              title: '',
              template: '匹配车辆信息'
            });
            confirmPopup.then(function(res) {
              if(res)//用户选择匹配车辆信息
              {
                //TODO:inject carInfo
                if(json.data!==undefined&&json.data!==null)
                {
                  var carInfo=json.data;
                  $scope.carInfo.carNum=carInfo.carNum;
                  $scope.carInfo.factoryNum=carInfo.factoryNum;
                  $scope.carInfo.engineNum=carInfo.engineNum;
                  $scope.carInfo.frameNum=carInfo.frameNum;
                  $scope.carInfo.issueDate=carInfo.issueDate;
                  $scope.carInfo.ownerName=carInfo.ownerName;
                }
              }
            });
          }
        }).catch(function(err) {
          var str='';
          for(var field in err)
            str+=err[field];
          console.error('error=\r\n'+str);
        })
      }else{
        if(item!==undefined&&item!==null)
        {
          $scope.doFilterCarNumFlag=false;
          $timeout(function(){
            $scope.doFilterCarNumFlag=true;
          },1000);
        }
      }
    }



    $scope.filterInfoByPerIdCard=function(item) {
      if ($scope.doFilterFlag) {
        $http({
          method: "post",
          url: Proxy.local()+"/svr/request",
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token,
            info: {
              perIdCard: item
            }
          },
          data: {
            request: 'getCarInfoByPerIdCard',
            info: {
              perIdCard: item
            }
          }
        }).then(function (res) {
          var json = res.data;
          if (json.re == 1) {
            var confirmPopup = $ionicPopup.confirm({
              title: '',
              template: '匹配车辆信息'
            });
            confirmPopup.then(function (res) {
              if (res)//用户选择匹配车辆信息
              {
                $scope.cars = json.data;
                $scope.open_matchingCarInfoModal();
              }
            });
          }
        }).catch(function (err) {
          var str = '';
          for (var field in err)
            str += err[field];
          console.error('error=\r\n' + str);
        })
      } else {
        if (item !== undefined && item !== null) {
          $scope.doFilterFlag = false;
          $timeout(function () {
            $scope.doFilterFlag = true;
          }, 1000);
        }
      }
    }

    $scope.startCapture=function(){
      var options = { limit: 3, duration: 15 };
      $cordovaCapture.captureVideo(options).then(function(videoData) {
        // Success! Video data is here

        $scope.maintain.description.video=videoData[0].fullPath;
        alert('whole path=' + $scope.maintain.description.video);
        var basicPath=cordova.file.applicationStorageDirectory;
        alert('basic path=' + basicPath);

        var suffixIndex=videoData[0].fullPath.indexOf(basicPath)+basicPath.length;
        var filename=videoData[0].fullPath.substring(suffixIndex+1,videoData[0].fullPath.length);
        alert('filename=' + filename);
        $scope.videoData=videoData[0];
      }, function(err) {
        // An error occurred. Show a message to the user
        var str='';
        for(var field in err)
          str+=err[field];
        console.error('error=\r\n' + str);
      });
    }


    //开始录音

    $scope.startRecord=function(){
      try{

        if (ionic.Platform.isIOS()) {
          CordovaAudio.startRecordAudio(function(data) {
            alert('data=\r\n'+data);
          })
        } else if(ionic.Platform.isAndroid()) {
          var src = "audio.mp3";
          var media = $cordovaMedia.newMedia(src);
          media.startRecord();
          $scope.media=media;
        }
      }catch(e) {
        alert('error=\r\n'+ e.toString());
      }
    }

    //暂停录音
    $scope.stopRecord=function(){
      //$scope.mediaRec.stopRecord();
      //for(var field in $scope.mediaRec.media) {
      //  alert('field=' + field);
      //  alert('data=\r\n' + $scope.mediaRec.media[field]);
      //}
      try{
        if( ionic.Platform.isIOS()){
          CordovaAudio.stopRecordAudio(function(success) {
            $scope.maintain.description.audio=success;
            alert('url=\r\n' + $scope.maintain.description.audio);

          })
        }else if(ionic.Platform.isAndroid()){

          $scope.media.stopRecord();
          $scope.media.media.getAudioFullPath(function(path){
            if(path!==undefined&&path!==null)
            {
              $scope.maintain.description.audio=path;
              console.log('path='+$scope.maintain.description.audio);
            }
          });
        }

      }catch(e)
      {
        alert('error=\r\n'+ e.toString());
      }

    }

    $scope.bind_car_info=function(cluster){
        cluster.map(function(car,i) {
          if(car.checked)
          {
            var carInfo=car;
            $scope.carInfo.ownerIdCard=carInfo.ownerIdCard;
            $scope.carInfo.carNum=carInfo.carNum;
            $scope.carInfo.factoryNum=carInfo.factoryNum;
            $scope.carInfo.engineNum=carInfo.engineNum;
            $scope.carInfo.frameNum=carInfo.frameNum;
            $scope.carInfo.issueDate=carInfo.issueDate;
            $scope.carInfo.ownerName=carInfo.ownerName;
          }
        })
      $scope.close_matchingCarInfoModal();
    }


    $scope.play=function(){
      //$scope.mediaRec.play();
      try{

        if( ionic.Platform.isIOS()){
          CordovaAudio.playingRecorder(function(success) {
            alert('success=\r\n'+success);
          })
        }else if(ionic.Platform.isAndroid()){
          $scope.media.play();
        }
      }catch(e)
      {
        alert('error=\r\n' + e.toString());
      }
    }

  })

