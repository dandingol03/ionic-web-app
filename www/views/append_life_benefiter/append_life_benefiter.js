/**
 * Created by yiming on 16/10/31.
 */
angular.module('starter')

  .controller('appendLifeBenefiterController',function($scope,$state,$http, $location,
                                                          $rootScope,$ionicActionSheet,$cordovaCamera,$cordovaImagePicker,
                                                          $ionicModal,Proxy,$stateParams,$cordovaFileTransfer){

    $scope.go_back=function(){
      window.history.back();
    }

    $scope.tabIndex=0;
    $scope.tab_change=function(i) {
      $scope.tabIndex=i;
    };


    if($stateParams.info!==undefined&&$stateParams.info!==null)
    {
      var info=$stateParams.info;
      if(Object.prototype.toString.call(info)=='[object String]')
        info=JSON.parse(info);
      if(info.order!==undefined&&info.order!==null)
        $scope.order=info.order;

    }



    $scope.benefiter={};

    if($stateParams.info!==undefined&&$stateParams.info!==null)
    {
      var info=$stateParams.info;
      if(Object.prototype.toString.call(info)=='[object String]')
        info = JSON.parse(info);
      $scope.info=info;
    }

    $scope.mutex=function(item,cluster){
      if(item.checked==true)
      {
        item.checked=false;
      }
      else{
        item.checked=true;
        cluster.map(function(cell,i) {
          if(cell.personId!=item.personId)
            cell.checked=false;
        })
      }
    }



    $scope.car_insurance.relativePersons={};

    $scope.selectLifeBenefiter=function(){
      $http({
        method: "POST",
        url: Proxy.local()+"/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        },
        data:
        {
          request:'getRelativePersonsWithinPerName',
          info:
          {
            perName:$scope.order.insuranceder.perName
          }
        }
      }).then(function(res) {
        var json=res.data;
        if(json.re==1){
          $scope.relativePersons=json.data;
        }
      })

    }


    $scope.ActionSheet= function (options,item,field,addon_field) {
      var buttons = [];
      options.map(function (item, i) {
        buttons.push({text: item});
      });
      $ionicActionSheet.show({
        buttons: buttons,
        titleText: '',
        cancelText: '取消',
        buttonClicked: function (index) {
          item[field] = buttons[index].text;
          if (addon_field !== undefined && addon_field !== null)
            item[addon_field] = (index + 1);
          return true;
        },
        cssClass: 'motor_insurance_actionsheet'
      });
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


    //确认寿险投保人
    $scope.confirm=function(){
      $scope.relativePersons.map(function(relative,i) {
        if(relative.checked==true)
        {
          $scope.order.benefiter=relative;
          $rootScope.dashboard.tabIndex=1;
          $rootScope.life_insurance.benefiter=relative;
          $state.go('tabs.dashboard');
        }
      });

    }


//提交统一函数
    $scope.upload=function(cmd,item){

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

          var json =res.data;
          alert(json.re);
          if(json.re==1){

            personId=json.data.personId;

            $scope.benefiter.personId=personId;

            alert('personid='+personId);
            alert('personid='+$scope.benefiter.personId);
            var suffix='';
            var imageType='perIdCard';
            alert('path='+$scope.benefiter.perIdCard1_img);
            if($scope.benefiter.perIdCard1_img.indexOf('.jpg')!=-1)
              suffix='jpg';
            else if($scope.benefiter.perIdCard1_img.indexOf('.png')!=-1)
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

            $cordovaFileTransfer.upload(server, $scope.benefiter.perIdCard1_img, options)
              .then(function(res) {
                alert('upload perIdCard1 success');
                for(var field in res) {
                  alert('field=' + field + '\r\n' + res[field]);
                }
                var su=null
                if($scope.benefiter.perIdCard1_img.indexOf('.jpg')!=-1)
                  su='jpg';
                else if($scope.benefiter.perIdCard1_img.indexOf('.png')!=-1)
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
                  if($scope.benefiter.perIdCard2_img.indexOf('.jpg')!=-1)
                    su='jpg';
                  else if($scope.benefiter.perIdCard2_img.indexOf('.png')!=-1)
                    su='png';
                  server=Proxy.local()+'/svr/request?request=uploadPhoto' +
                    '&imageType='+imageType+'&suffix='+su+'&filename='+'perIdAttachId2'+'&personId='+personId;
                  return  $cordovaFileTransfer.upload(server, $scope.benefiter.perIdCard2_img, options)
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
                    }).then(function(res) {
                      var json=res.data;
                      if(json.re==1) {
                        return $http({
                          method: "POST",
                          url: Proxy.local()+"/svr/request",
                          headers: {
                            'Authorization': "Bearer " + $rootScope.access_token,
                          },
                          data:
                          {
                            request:'getInfoPersonInfoByPersonId',
                            info:{
                              personId:personId
                            }
                          }
                        });
                      }
                    }).then(function(res) {
                      var json=res.data;
                      if(json.re==1) {
                        $rootScope.life_insurance.benefiter=json.data;
                        $rootScope.dashboard.tabIndex=1;
                        $state.go('tabs.dashboard');
                      }
                    });
                }
              })
          }else{}


        }).then(function(res) {

        })
        .catch(function(err) {
          var str='';
          for(var field in err)
            str+=err[field];
          alert('error=\r\n' + str);
        });

    }





  })
