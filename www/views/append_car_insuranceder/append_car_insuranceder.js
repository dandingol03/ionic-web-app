/**
 * Created by yiming on 16/10/31.
 */
angular.module('starter')

  .controller('appendCarInsurancederController',function($scope,$state,$http, $location,
                                                $rootScope,$ionicActionSheet,
                                                $ionicModal,Proxy,$stateParams,$ionicPopup,ModalService){

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
    $scope.selectInsuranceder=function(person){
      person.check=true;
    }

    $scope.car_insurance.insuranceder={
      perName:''
    };
    $scope.car_insurance.relativePersons={};

    $scope.selectCarInsuranceder=function(){
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
            perName:$scope.car_insurance.insuranceder.perName
          }
        }
      }).then(function(res) {
        var json=res.data;
        if(json.re==1){
          $scope.car_insurance.relativePersons=json.data;
        }
      })



    }

    //提交车险意向
    $scope.confirm=function(){

      var products=[];



      $http({
        method: "POST",
        url: Proxy.local()+"/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        },
        data:
        {
          request:'generateCarInsuranceOrder',
          info:
          {
            products:products,
            companys:companys,
            carId:$scope.carInfo.carId,
            insurancederId:$scope.insuranceder.personId
          }
        }
      }).then(function(res) {
        $scope.closeCompanyModal();
        $scope.close_appendCarOrderModal();
        var json=res.data;
        var orderId=json.data;
        if(orderId!==undefined&&orderId!==null)
        {
          $state.go('car_orders');
        }
      }).catch(function(err) {
        $scope.closeCompanyModal();
        var str='';
        for(var feild in err)
          str+=err[field];
        console.error('error=\r\n' + str);
      });
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
                  return  $.upload(server, $scope.life_insurance.insurer.perIdCard2_img, options)
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
                    }).then(function(res) {
                      var json=res.data;
                      if(json.re==1) {
                        $scope.insuranceder=json.data;
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








  })
