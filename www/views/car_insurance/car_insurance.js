/**
 * Created by yiming on 16/9/7.
 */
angular.module('starter')

  .controller('carInsuranceController',function($scope,$state,$http, $location,
                                                $rootScope,$ionicActionSheet,
                                                $ionicModal,Proxy,$stateParams,$ionicPopup,ModalService){
    if($stateParams.carInfo!==undefined&&$stateParams.carInfo!==null)
    {
      var carInfo=$stateParams.carInfo;
      if(Object.prototype.toString.call(carInfo)=='[object String]')
        carInfo = JSON.parse(carInfo);
      $scope.carInfo=carInfo;
    }
    alert($scope.carInfo.carId);
    $scope.tabIndex=0;

    //当前页数
    $scope.companyIndex=0;

    $scope.tab_change=function(i) {
      $scope.tabIndex=i;
    };

    $scope. modal_tab_change=function(i) {
      $scope.modalTabIndex=i;
    };


    $scope.company={name:"选择公司"};
    //公司选择
    $scope.selectCompany=function(companyName){

      $scope.company.companyName=companyName;
      $scope.apply();
      $scope.closeCompanyModal();

    }


    //选择车辆人员责任险模态框

    /*** bind special_tab_modal ***/
    $ionicModal.fromTemplateUrl('views/modal/special_tab_modal.html',{
      scope:  $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.special_tab_modal = modal;
    });

    //待定
    $scope.openSpecialModal= function(){
      $scope.special_tab_modal.show();
    };


    $scope.closeSpecialModal= function() {
      $scope.special_tab_modal.hide();
    };
    /*** bind special_tab_modal ***/

    $scope.toggle=function(item,field,options)
    {
      if(options!==undefined&&options!==null)
      {
      }else{
        if(item[field]==true)
          item[field]=false;
        else
          item[field]=true;
      }
    }

    $scope.go_back=function(){
      window.history.back();
    }

    $scope.actionSheet=function(item,sourceField,acts)
    {
      console.log('...');
      if (item[sourceField] !== undefined && item[sourceField]!== null && item[sourceField].length > 0)
      {
        var buttons=[];
        item[sourceField].map(function(li,i) {
          buttons.push({text: li});
        });
        $ionicActionSheet.show({
          buttons:buttons,
          titleText: '选择你的保额',
          cancelText: 'Cancel',
          buttonClicked: function(index) {
            acts.map(function (act, i) {
              if(act.indexOf('=>')!=-1)
              {
                var dest=act.split('=>')[1];
                var src=act.split('=>')[0];
                item[dest]=item[src][index];
              }
            });
            return true;
          },
          cssClass:'motor_insurance_actionsheet'
        });
      }
      else
      {}
    }







    /**************方案详情模态框*************************/
    $ionicModal.fromTemplateUrl('views/modal/car_detail_modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.car_detail_modal = modal;
    });
    $scope.openModal = function() {
      $scope.car_detail_modal.show();
    };
    $scope.closeModal = function() {
      $scope.car_detail_modal.hide();
    };
    /**************方案详情模态框*************************/


    /**************选择公司模态框*************************/
    $ionicModal.fromTemplateUrl('views/modal/car_company_modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.car_company_modal = modal;
    });
    $scope.openCompanyModal = function() {
      $scope.car_company_modal.show();
    };
    $scope.closeCompanyModal = function() {
      $scope.car_company_modal.hide();
    };
    /**************选择公司模态框*************************/

    /**************选择车险相关人员模态框*************************/
    $ionicModal.fromTemplateUrl('views/modal/append_carOrder_person.html',{
      scope:  $scope,
      animation: 'animated '+' bounceInUp',
      hideDelay:920
    }).then(function(modal) {
      $scope.append_carOrderPerson_modal = modal;
    });

    $scope.open_appendCarOrderModal= function(){
      $scope.append_carOrderPerson_modal.show();
    };

    $scope.close_appendCarOrderModal= function() {
      $scope.append_carOrderPerson_modal.hide();
    };
    /**************选择车险相关人员模态框*************************/



    /**
     * 获得险种套餐
     */
    $http({
        method: "POST",
        url: Proxy.local()+"/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        },
        data:
        {
          request:'getCarInsuranceMeals'
        }
      }).then(function(response) {
      var data=response.data;
      var meals=[];
      data.data.map(function(meal,i) {
        var products={};
        meal.products.map(function(product,j) {
          product.irrespective=true;
          if(products[product.productName]==undefined||products[product.productName]==null)
          {
            products[product.productName]=product;

          }
          else
          {
            if(products[product.productName].productIds!==undefined&&products[product.productName].productIds!==null)
            {}else{
              products[product.productName].productIds=[];
              products[product.productName].insuranceTypes=[];
              products[product.productName].productIds.push(products[product.productName].productId);
              products[product.productName].insuranceTypes.push(products[product.productName].insuranceType);
              products[product.productName].productId=null;
              products[product.productName].insuranceType=null;
            }
            products[product.productName].productIds.push(product.productId);
            products[product.productName].insuranceTypes.push(product.insuranceType);

          }
        });
        meals.push({mealName:meal.mealName,products:products});
      });
      $scope.tabs=meals;

      return $http({
        method: "POST",
        url: Proxy.local()+"/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token
        },
        data:
        {
          request:'getInsuranceCompany'
        }
      });
    }).then(function(res) {
      var data=res.data;
      //选择公司
      $scope.companys=data.data;
      $scope.page_size=6;
      $scope.companyIndex=0;
      $scope.page_companys=[];
      var curIndex=$scope.companyIndex*$scope.page_size;
      var j=0;
      for(var i=curIndex;i<$scope.companys.length;i++)
      {
          if(j<$scope.page_size)
          {
            $scope.page_companys.push($scope.companys[i]);
            j++;
          }
          else
            break;
      }

    }).catch(function(err) {
      var str='';
      for(var field in err)
      str+=err[field];
      console.log('error=\r\n'+str);
    });

    $scope.carorder={
      insuranceder:{}
    }

    $scope.car_insurance={
      insuranceder:{perTypeCode:'I'},
      order:{
        insuranceder:{
        },
      }
    }
    //提交车险意向
    $scope.confirm=function(){
      var products=[];
      var meal = $scope.tabs[$scope.tabIndex];
      for(var productName in meal.products) {
        var product=meal.products[productName];
        if(product.checked==true)
        {
          products.push(product);
        }
      }
      var companys=[];
      $scope.companys.map(function(company,i) {
        if(company.checked==true)
          companys.push(company);
      });

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


    $scope.Mutex=function(item,field,cluster) {
      if(item[field])
      {
        item[field]=false;
      }
      else{
        item[field]=true;
        cluster.map(function(cell,i) {
          if(cell.personId!=item.personId)
            cell[field]=false;
        })
      }
    };

    /*** bind append_car_insuranceder_modal 选择被保险人模态框(车险)***/
    $ionicModal.fromTemplateUrl('views/modal/append_car_insuranceder_modal.html',{
      scope:  $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.append_car_insuranceder_modal = modal;
    });

    $scope.open_appendCarInsurancederModal= function(){
      $scope.append_car_insuranceder_modal.show();
    };

    $scope.close_appendCarInsurancederModal= function() {
      $scope.append_car_insuranceder_modal.hide();
    };
    /*** bind append_car_insuranceder_modal ***/

    /*** bind select_relative modal ***/
    $ionicModal.fromTemplateUrl('views/modal/select_car_relative.html',{
      scope:  $scope,
      animation: 'animated '+' bounceInUp',
      hideDelay:920
    }).then(function(modal) {
      $scope.select_relative={
        modal:modal
      }
    });

    $scope.open_selectRelativeModal= function(field){
      $scope.select_relative.modal.show();
      $scope.select_relative.field=field;
    };

    $scope.close_selectRelativeModal= function(cluster) {
      if(cluster!==undefined&&cluster!==null)
      {
        cluster.map(function(singleton,i) {
          if(singleton.checked==true)
          {
            $scope[$scope.select_relative.field]=singleton;
          }
        })
      }
      $scope.select_relative.modal.hide();
    };
    /*** bind select_relative modal ***/


    //拉取相关人员信息
    $scope.fetchRelative=function(field) {
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

            $scope.open_selectRelativeModal(field);
          }
        }else{
          $scope.open_selectRelativeModal(field);
        }

      }).catch(function(err) {
        var str='';
        for(var field in err)
          str+=err[field];
        console.error('error=\r\n' + str);
      });
    };

    $scope.ionicPopup=function(title,item,field,cb) {

      var buttons = [];
      if (Object.prototype.toString.call(cb) == '[object Array]') {
        buttons.push({text: '<b>取消</b>', type: 'button-assertive'});
        cb.map(function (item, i) {
          buttons.push({text: item.text, type: 'button-positive', onTap: item.cb});
        });
      } else {
        buttons = [
          {
            text: '<b>取消</b>',
            type: 'button-assertive'
          },
          {
            text: '<b>自己</b>',
            type: 'button-positive',
            onTap: function (e) {
              item[field] = 'self';
            }
          },
          {
            text: '<b>添加</b>',
            type: 'button-positive',
            onTap: function (e) {
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
    }
    //添加被保险人(车险)
    $scope.append_car_insuranceder=function(props){
      $scope.ionicPopup(props.title,props.item,props.field,$scope.open_appendCarInsurancederModal);

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

    //选用险种检查车险相关人员
    $scope.apply=function(){
      //TODO:append insuranceder modal
      $scope.open_appendCarOrderModal();
    }


    $scope.previou_page=function(){
      var curIndex=($scope.companyIndex-1)*$scope.page_size;
      if(curIndex>=0) {
        $scope.companyIndex--;
        var j=0;
        $scope.page_companys=[];
        for(var i=curIndex;i<$scope.companys.length;i++)
        {
          if(j<$scope.page_size)
          {
            $scope.page_companys.push($scope.companys[i]);
            j++;
          }
          else
            break;
        }
      }
    }

    $scope.next_page=function(){
      var curIndex=($scope.companyIndex+1)*$scope.page_size;
      if(curIndex<$scope.companys.length)
      {
        $scope.companyIndex++;
        var j=0;
        $scope.page_companys=[];
        for(var i=curIndex;i<$scope.companys.length;i++)
        {
          if(j<$scope.page_size)
          {
            $scope.page_companys.push($scope.companys[i]);
            j++;
          }
          else
            break;
        }
      }
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
  });

