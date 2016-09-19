angular.module('starter')

  .controller('dashboardController',function($scope,$state,$http, $location,
                                             $rootScope,$ionicModal,$timeout,
                                             $cordovaCamera,ionicDatePicker,
                                             $ionicActionSheet,BaiduMapService,$ionicPopup,$cordovaFile,
                                             $q,$ionicPlatform){

    $scope.carInfo={};

    $scope.goto=function(url){
      $location.path(url);
    };

    $http({
      method: "post",
      url: "/proxy/node_server/svr/request",
      headers: {
        'Authorization': "Bearer " + $rootScope.access_token,
      },
      data:
      {
        request:'getCarAndOwnerInfo'
      }
    })
      .success(function (response) {
        $scope.carInfo=response.carInfo[0];
        console.log('success');
      })


    $scope.postLifeInfo=function(){
      $http({
        method: "POST",
        url: "/proxy/node_server/svr/request",
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
    $scope.datepick = function(){
      var ipObj1 = {
        callback: function (val) {  //Mandatory
          var t1 = document.getElementById('date');//根据id获取input节点
          var date=new Date(val);
          var month=parseInt(date.getMonth())+1;
          t1.value=date.getFullYear()+'-'+month+'-'+date.getDate();
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


    $scope.car={};

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

    /*** bind coverage_tab_modal ***/
    $ionicModal.fromTemplateUrl('views/modal/coverage_tab_modal.html',{
      scope:  $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.coverage_tab_modal = modal;
    });

    //待定
    $scope.open_lifeModal= function(){
        $scope.coverage_tab_modal.show();
    };


    $scope.close_lifeModal= function() {
      $scope.coverage_tab_modal.hide();
    };
    /*** bind coverage_tab_modal ***/

    /*** bind append_insurer_modal ***/
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





    $scope.check_carInfo=function(){
      if($rootScope.car!==undefined&&$rootScope.car!==null)
      {

      }else{
        $timeout(function(){
          $scope.openModal();
        },300);
      }
    };





    $scope.postCarInfo=function(){
      $http({
        method: "POST",
        url: "/proxy/node_server/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token,
        },
        data:
        {
          request:'uploadCarAndOwnerInfo',
          info:$scope.carInfo
        }
      }).
        success(function (response) {
          console.log('success');
        })
    }

    $scope.select_type=function(){
      var carInfo=$scope.carInfo;
      $state.go('car_insurance');
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
      insurer:{},
      insuranceder:{},
      benefiter:{},
      intend:{}
    };

    $scope.car={};

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




    //返回寿险产品列表
    $http({
      method: "POST",
      url: "/proxy/node_server/svr/request",
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
          {type:'车驾管服务',
            services:[
              {name:'代办车辆年审',href:''},
              {name:'代办驾驶证年审',href:''},
              {name:'取送车',href:''},
              {name:'接送机',href:''},
              {name:'违章查询',href:''}
            ]
          }
        ];
      }
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





    $scope.tabIndex=0;

    $scope.tab_change=function(i){
      $scope.tabIndex=i;
    };


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

    //寿险意向保留
    $scope.saveLifeInsuranceIntend=function()
    {
      $state.go('car_insurance_product_list');

      $rootScope.life_insurance=$scope.life_insurance;
      $http({
        method: "POST",
        url: "http://192.168.0.199:3000/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token,
        },
        data:
        {
          request:'generateLifeInsuranceOrder',
          info:$scope.life_insurance.order
        }
      }).then(function(res) {

        console.log('request has been back');
      }).catch(function(err) {
        var str='';
        for(var field in err)
          str += field + ':' + err[field];
        alert('error=\r\n' + str);
      });
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
      $state.go('car_insurance');
    }




    $scope.service='代办车辆年审';
    $scope.services=[
      '代办车辆年审',
      '代办驾驶证年审',
      '取送车',
      '接送机',
      '违章查询'
    ];

    //维修救援

    $scope.subTabIndex=0;
    $scope.subTab_change=function(i) {
      $scope.subTabIndex=i;
    };
    $scope.dailys=[{name:'机油,机滤'},{name:'机油,三滤'},{name:'更换刹车片'},{name:'雨刷片更换'},{name:'轮胎更换'}]
    $scope.daily={};
    $scope.selected_daily=[];

    $scope.commit_daily=function(){
      dailys.map(function(daily,i) {
        if(daily.checked)
           selected_daily.push(daily);
      });
      $rootScope.selected_daily= $scope.selected_daily;

    }
















    //维修救援
    $scope.maintain={
      tabs:['日常保养','故障维修','事故维修'],
      tab:'日常保养',
      items:{}
    };

    $scope.accident={

    };

    $scope.daily_check=function(item){
      if(item.checked==true)
        item.checked=false;
      else
        item.checked=true;
    }

    $scope.accident={};
    $scope.accidant_check=function(type)
    {
      $scope.accident.type=type;
    }

    //车驾管服务

    //选择车驾管服务项目
    $scope.services=["代办车辆年审","代办行驶证年审","接送机","取送车","违章查询"];
    $scope.service="代办车辆年审";

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


    $scope.addresses=['tow1','tow2','tow3'];
    $scope.address=$scope.addresses[0];
    $scope.addresses_select=function(addresses) {
      if (addresses !== undefined && addresses !== null &&addresses.length > 0)
      {
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
      else
      {}
    }



    $scope.service_persons=['person1','person2','person3'];
    $scope.service_person=$scope.service_persons[0];
    $scope.service_person_select=function(persones) {
      if (persones !== undefined && persones !== null &&persones.length > 0)
      {
        var buttons=[];
        persones.map(function(person,i) {
          buttons.push({text: person});
        });

        $ionicActionSheet.show({
          buttons:buttons,
          titleText: '选择你的服务人员',
          cancelText: 'Cancel',
          buttonClicked: function(index) {
            $scope.service_person = $scope.service_persons[index];
            return true;
          },
          cssClass:'motor_insurance_actionsheet'
        });
      }
      else
      {}
    }

    $scope.makePhone=function () {

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



    $scope.append_insurer=function(props){
      //TODO:append a popup
      //$scope.ionicPopup=function(title,item,field,cb) {
      $scope.ionicPopup(props.title,props.item,props.field,$scope.open_appendInsurerModal);

    }




    $scope.Setter=function(type,item,field,cmd){
      switch(type)
      {
        case 'remote':
          $http({
            method: "POST",
            url: "/proxy/node_server/svr/request",
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
            if(item[field].indexOf('.jpg')!=-1)
              type = 'jpg';
            else if(item[field].indexOf('.png')!=-1)
              type='png';
            else{}
            item[gen_feild]={
              type:type,
              bin:res
            }
            deferred.resolve({re: 1});
          }).catch(function(err) {
            deferred.reject(err.toString());
          });
        }
      }

      return deferred.promise;
    }

    //提交统一函数
    $scope.upload=function(cmd,item){

      $scope.detectImg(item)
        .then(function(json) {
        return  $http({
          method: "POST",
          url: "http://192.168.1.116:3000/svr/request",
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token,
          },
          data:
          {
            request:cmd,
            info:item
          }
        });
        })
        .then(function(res) {
          alert('...it is back')
        })
        .catch(function(err) {
          var str='';
          for(var field in err)
            str+=err[field];
          alert('error=\r\n' + str);
      });

    }

    $scope.ActionSheet= function (options,item,field,addon_field,url,fail) {
      if((options==null||options==undefined)&&url!==undefined&&url!==null)//远程
      {
        $http({
          method: "POST",
          url: "/proxy/node_server/svr/request",
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token
          },
          data:
          {
            request:url
          }
        }).then(function(json) {
          var res=json.data;
          if(res.re==2)
          {
            if(fail!==undefined&&fail!==null)
            {
              var cb=fail.cb;
              cb(fail.title,item,field);
            }
          }else{
            var buttons=[];
            json.data.map(function(item,i) {
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
        });
      }
      else{//本地
        var person=$scope.life_insurance.person;
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

      //intial BMap service
      BaiduMapService.getBMap(function(BMap){

        /**
         * 自身定位
         */
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
          if(this.getStatus() == BMAP_STATUS_SUCCESS){
            //var mk = new BMap.Marker(r.point);
            //map.addOverlay(mk);
            //map.panTo(r.point);
            //alert('您的位置：'+r.point.lng+','+r.point.lat);
          }
          else {
            //alert('failed'+this.getStatus());
          }
        },{enableHighAccuracy: true});

      });

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

  });
