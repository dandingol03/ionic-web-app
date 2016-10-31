/**
 * Created by apple-2 on 16/9/1.
 */
angular.module('starter')
    .controller('lifePlanDetailController',function($scope,$rootScope,$state,$http,
                                                    $location,$ionicModal,$ionicActionSheet,
                                                $cordovaCamera,$cordovaImagePicker,$stateParams,
                                                    $ionicSlideBoxDelegate,$ionicPopup,Proxy){

    //$scope.item=$stateParams.plan;
      $scope.item=$rootScope.plan;

    if(Object.prototype.toString.call($scope.item)=='[object String]')
        $scope.item=JSON.parse($scope.item);

    //for contrast....
    $scope.backup=$scope.item;

    $scope.title=$scope.item.main.name;

      var insurancederId = null;

      $rootScope.lifeInsurance.orders.map(function(order,i){
        if(order.orderId==$scope.item.orderId)
          insurancederId=order.insurancederId;
      })

      $scope.age=0;
      $http({
        method: "POST",
        url: Proxy.local() + '/svr/request',
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        },
        data: {
          request: 'getPersonInfo',
          info:{
            personId:insurancederId
          }
        }
      }).then(function(res) {
        var json=res.data;
        if(json.re==1){
        var personInfo=json.data;
          var perBirthday=new Date(personInfo.perBirthday);
          var cur=new Date();
          $scope.age=cur.getFullYear()-perBirthday.getFullYear();

        }
      })


      $scope.feeYearMap={1:{text:'趸交',year:1},2:{text:'5年',year:5},3:{text:'10年',year:10},
        4:{text:'15年',year:15},5:{text:'20年',year:10},6:{text:'缴至60岁',year:60-$scope.age}};

      $scope.item.main.feeYearTypeName=$scope.feeYearMap[$scope.item.feeYearType].text;
      $scope.item.main.feeYear=$scope.feeYearMap[$scope.item.feeYearType].year;


    $scope.tabs=['产品简介','保费测算'];
    //$scope.tab=$scope.tabs[0];
      if($rootScope.tab!=null&&$rootScope.tab!=undefined){
        var index = 0;
        $scope.tab=$rootScope.tab;
        $scope.tabs.map(function(tab,i) {
          if(tab==$scope.tab){
            index=i;
            $ionicSlideBoxDelegate.slide(index);
            $scope.myActiveSlide = index;
          }
        })
      }

    $scope.tab_change=function(i){
      $scope.tab=$scope.tabs[i];
      $ionicSlideBoxDelegate.slide(i);
    }



      $scope.feeYearType_select=function()
      {
         var buttons=[{text:'趸交',year:1},{text:'5年',year:5},
           {text:'10年',year:10},{text:'15年',year:15},{text:'20年',year:20},
           {text:'缴至60岁'}];
        $ionicActionSheet.show({
          buttons:buttons,
          titleText: '选择你需要的保障',
          cancelText: 'Cancel',
          buttonClicked: function(index) {
            $scope.item.main.feeYearTypeName = buttons[index].text;
            $scope.item.main.feeYearType = index+1;
            if(index!=5){
              $scope.item.main.feeYear=buttons[index].year;
            }else{

              $scope.item.main.feeYear = 60-$scope.age;
            }
            $scope.changeInsuranceFee();
            return true;
          },
          cssClass:'motor_insurance_actionsheet'
        });
      }


    $scope.changeInsuranceFee=function(){
     //1.把新保额填到数据库对应的方案中去;   2.按比例计算出相应的保费
      $http({
        method: "POST",
        url: Proxy.local() + '/svr/request',
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        },
        data: {
          request: 'getLifeInsuranceFee',
          info:{
            productId:$scope.item.main.product.productId,
            feeYearType:$scope.item.feeYearType,
            insurancederId:insurancederId
          }

        }
      }).then(function(res) {
        var json = res.data;
        if(json.re==1){
          var insuranceFee=json.data.feeItem.insuranceFee;
          var baseInsuranceQuota=json.data.feeItem.insuranceQuota;
          $scope.item.insuranceFeeTotal=
            $scope.item.insuranceQuota/baseInsuranceQuota*insuranceFee*$scope.item.main.feeYear

        }

        $rootScope.plan=$scope.item;
      }).then(function() {

        $http({
          method: "POST",
          url: Proxy.local() + '/svr/request',
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token
          },
          data: {
            request: 'updateLifeOrderPlan',
            info:{
              planId:$scope.item.planId,
              main:$scope.item.main,
              additions:$scope.item.additions,
              insuranceQuota:$scope.item.insuranceQuota,
              feeYearType:$scope.item.feeYearType,
              insuranceFeeTotal:$scope.item.insuranceFeeTotal,
            }
          }
        })

      })

    }


      $scope.cart=[
        {id:1,count:0,img:"img/res001.png",title:"Cream Cheese..."},
        {id:2,count:0,img:"img/res002.png",title:"Sesame Noodles"},
        {id:3,count:0,img:"img/res003.png",title:"Chicken Taquitos"}
      ];

      /*************************************detail_modal.html******************/
      $ionicModal.fromTemplateUrl('views/modal/detail_modal.html',function(modal){
        $scope.detail_modal=modal;
      }, {
        scope: $scope,
        animation: 'slide-in-up'
      });

      $scope.opendetail_modal= function(){
        $scope.detail_modal.show();
      };

      $scope.closedetail_modal= function() {
        $scope.detail_modal.hide();
      };

      $scope.$on('modal.hidden', function() {
        // Execute action
      });

      /**
       *
       * this is where we handle 附加险操作
       */
      $scope.increment=function(item,field){
        if(item[field]==0)
        {
          item['insuranceFee']+=item.singleton;
        }else{
          var singleton=item['insuranceFee']/item[field];
          item['insuranceFee']+=singleton;
        }
        item[field]++;
        $scope.total_compute();
      };

      $scope.decrement=function(item,field) {
        if(item[field]>0)
        {
          var singleton=item['insuranceFee']/item[field];
          item[field]--;
          if(item[field]==0)
          item.singleton=singleton;
          item['insuranceFee']-=singleton;
        }
        $scope.total_compute();
      };

      $scope.total_compute=function(){
        var total=0;
        total+=parseInt($scope.item.main['保费']);
        $scope.item.additions.map(function(addition){
          total+=parseInt(addition.gurantee_fee);
        });
        $scope.total=total;
      }

      $scope.total_compute();

      $scope.confirm_lifeInsurance=function(){

      };

      $scope.applicant={};

      $scope.pickImage=function(img_type){
        var options = {
          maximumImagesCount: 1,
          width: 800,
          height: 800,
          quality: 80
        };

        $cordovaImagePicker.getPictures(options)
            .then(function (results) {
              $scope[img_type]=results[0];
              alert('img url=' + results[0]);
            }, function (error) {
              alert("error="+error);
              // error getting photos
            });
      };

      $scope.takePhoto=function(img_type){
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
          $scope[img_type] = imageURI;
          alert('image url=' + imageURI);
        }, function(err) {
          // error
        });
      };

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

    //保存修改,同布数据至$rootScope
    $scope.sync=function(plan) {
      var buttons=[
        {
          text: '<b>取消</b>',
          type:'button-assertive'
        },
        {
          text: '<b>确认</b>',
          type: 'button-positive',
          onTap: function(e) {
            //TODO:do contrast

            var planId=plan.planId;
            var plans=$rootScope.lifeInsuranceOrder.plans;
            plans.map(function(item,i) {
              if(item.planId==planId)
              {
                plan.modified=true;
                plan.checked=true;
                plans[i]=plan;
                $rootScope.modifiedFlag=true;
              }
            });
            $rootScope.lifeInsuranceOrder.plans=plans;
            $state.go('life_plan');
          }
        }
      ];
      // var myPopup = $ionicPopup.show({
      //   template: '保存修改之后,需要等待后台工作人员进行审核',
      //   title: '<strong>修改保修方案?</strong>',
      //   subTitle: '',
      //   scope: $scope,
      //   buttons: buttons
      // });


    };


      $scope.checkCarInfo=function(){

        $scope.life_insurance.state='finished';//订单状态为已生成
        $scope.opendetail_modal();
        $rootScope.life_insurance.state= $scope.life_insurance.state;
      }

    $scope.slide_cb=function(i){
      $scope.tab=$scope.tabs[i];
    }

      $scope.go_back=function(){
        window.history.back();
        $rootScope.tab=$scope.tab;
      }

      $scope.$on('$destroy', function() {
        $scope.detail_modal.remove();
      });


    });
