/**
 * Created by apple-2 on 16/9/1.
 */
angular.module('starter')
  .controller('lifeDetailController',function($scope,$rootScope,$state,$http, $location,$ionicModal,$ionicActionSheet,
                                              $cordovaCamera,$cordovaImagePicker,$stateParams,$ionicSlideBoxDelegate){

      $scope.item=$stateParams.insurance;

      if(Object.prototype.toString.call($scope.item)=='[object String]')
        $scope.item=JSON.parse($scope.item);

      $scope.title=$scope.item.main.name;

      $scope.tabs=['产品简介','保费测算'];
      $scope.tab=$scope.tabs[0];
      $scope.tab_change=function(i){
          $scope.tab=$scope.tabs[i];
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
      $scope.increment=function(index){
          $scope.item.additions[index].count++;
          $scope.item.additions[index].gurantee_fee+=$scope.item.additions[index].singleton;
          $scope.total+=$scope.item.additions[index].singleton;
      };

      $scope.decrement=function(index) {
          $scope.item.additions[index].count--;
          $scope.item.additions[index].gurantee_fee-=$scope.item.additions[index].singleton;
          $scope.total-=$scope.item.additions[index].singleton;
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

      $scope.pickImage=function(applicant_type,img_type){
        var options = {
          maximumImagesCount: 1,
          width: 800,
          height: 800,
          quality: 80
        };

        $cordovaImagePicker.getPictures(options)
          .then(function (results) {
            $scope[applicant_type][img_type]=results[0];
            alert('img url=' + results[0]);
          }, function (error) {
            alert("error="+error);
            // error getting photos
          });
      };

      $scope.takePhoto=function(applicant_type,img_type){
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
          $scope[applicant_type][img_type] = imageURI;
          alert('image url=' + imageURI);
        }, function(err) {
          // error
        });
      };

      $scope.addAttachment=function(applicant_type,img_type)
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
                $scope.pickImage(applicant_type,img_type);
                break;
              case 1:
                $scope.takePhoto(applicant_type,img_type);
                break;
              default:
                break;
            }
            return true;
          }
        });
      }


      $scope.changeState=function(){
        $scope.life_insurance.state='modified';//订单状态为正在编辑
        $rootScope.life_insurance.state= $scope.life_insurance.state;
        $rootScope.orders.map(function(item,i){
          if($rootScope.orders.type){}
        })
      }



      $scope.checkCarInfo=function(){

        $scope.life_insurance.state='finished';//订单状态为已生成
        $scope.opendetail_modal();
        $rootScope.life_insurance.state= $scope.life_insurance.state;
      }

      $scope.go_back=function(){
        window.history.back();
      }

      $scope.$on('$destroy', function() {
        $scope.detail_modal.remove();
      });


      var watchSlide = $scope.$watch($ionicSlideBoxDelegate, function(){
        var slideIndex=$ionicSlideBoxDelegate.currentIndex();
        console.log('index='+slideIndex);
      });
      watchSlide();

  });
