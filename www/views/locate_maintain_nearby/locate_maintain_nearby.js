/**
 * Created by danding on 16/9/6.
 */
angular.module('starter')

  .controller('locateMaintainNearbyController',function($scope,$state,$http,$timeout,$rootScope,
                                                        BaiduMapService,$cordovaGeolocation,$ionicModal){

    $scope.maintain={

    };

    BaiduMapService.getBMap().then(function(res){
      $scope.bMap=res;
      var BMap=$scope.bMap;
      var map = new BMap.Map("container");          // 创建地图实例
      var point = new BMap.Point(117.144816, 36.672171);  // 创建点坐标

      map.centerAndZoom(point, 15);
      map.addControl(new BMap.NavigationControl());
      map.addControl(new BMap.ScaleControl());
      map.enableScrollWheelZoom(true);

      var mk = new BMap.Marker(point);
      mk.setAnimation(BMAP_ANIMATION_BOUNCE);
      map.addOverlay(mk);
      var label = new BMap.Label("您的位置",{offset:new BMap.Size(20,-10)});
      label.setStyle({
        color :'#222',
        fontSize : "12px",
        height : "20px",
        lineHeight : "20px",
        fontFamily:"微软雅黑",
        border:'0px'
      });
      mk.setLabel(label);


      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var lat  = position.coords.latitude;
          var lng = position.coords.longitude;
          alert(lng + ',' + lat);
          var ggPoint = new BMap.Point(lng, lat);
          var convertor = new BMap.Convertor();
          var pointArr = [];
          pointArr.push(ggPoint);

          var  translateCallback = function (data){
            if(data.status === 0) {
              var marker = new BMap.Marker(data.points[0]);
              map.addOverlay(marker);
              var label = new BMap.Label("转换后的百度坐标（正确）",{offset:new BMap.Size(20,-10)});
              marker.setLabel(label); //添加百度label
              map.setCenter(data.points[0]);
            }
          }

          convertor.translate(pointArr, 1, 5, translateCallback)




        }, function(err) {
          // error
          console.error('error=\r\n' + err.toString());
        });


      //fetch provinces list
      $http({
        method: "POST",
        url: "/proxy/node_server/svr/request",
        headers: {
          'Authorization': "Bearer " + $rootScope.access_token,
        },
        data:
        {
          request:'getProvincesByName',
        }
      }).then(function(res) {
        var json=res.data;
        if(json.re==1) {
          $scope.provinces=json.data;
        }
      }).catch(function(err) {
        var str='';
        for(var field in err)
          str+=err[field];
        console.error('error=\r\n' + str);
      })

      $scope.tabTag='province';

      $scope.tab_change=function(tag){
        $scope.tabTag=tag;
      }

      /*** bind select_province_city_town modal ***/
      $ionicModal.fromTemplateUrl('views/modal/select_province_city_town.html',{
        scope:  $scope,
        animation: 'animated '+'bounceInDown',
        hideDelay:920
      }).then(function(modal) {
        $scope.select_PCT={
          modal:modal
        }
      });

      $scope.open_selectPCTModal= function(item,field,matched){
        $scope.select_PCT.modal.show();
        if(item!==undefined&&item!==null&&field!==undefined&&field!==null)
        {
          $scope.select_PCT.item=item;
          $scope.select_PCT.field=field;
          $scope.select_PCT.matched=matched;
        }
      };

      $scope.close_selectPCTModal= function(cluster) {
        if(cluster!==undefined&&cluster!==null)
        {
          cluster.map(function(singleton,i) {
            if(singleton.checked==true)
            {
              if($scope.select_PCT.item!==undefined&&$scope.select_PCT.item!==null
                &&$scope.select_PCT.field!==undefined&&$scope.select_PCT.field!==null)
              {
                if($scope.select_PCT.matched!==undefined&&$scope.select_PCT.matched!==null)
                  $scope.select_PCT.item[$scope.select_PCT.field]=singleton[$scope.select_PCT.matched];
                else
                  $scope.select_PCT.item[$scope.select_PCT.field]=singleton;
              }
            }
          });
        }
        $scope.select_PCT.modal.hide();
      };
      /*** bind select_province_city_town modal ***/

      $scope.selectPTC=function(){
        $scope.open_selectPCTModal();
      }

      $scope.area={
        province:'山东省',
        city:'济南市',
        town:'历下区'
      }

      $scope.Mutex=function(item,field,cluster) {
        if(item[field])
        {
          item[field]=false;
        }
        else{
          item[field]=true;
          cluster.map(function(cell,i) {
            if(cell!=item)
              cell[field]=false;
          })
        }
      };


      $scope.Toggle=function(item,field) {
        if(item[field]==true)
          item[field]=false;
        else
          item[field]=true;
      };

      $scope.Set=function(item,field,value)
      {
        item[field]=value;
      }


      $scope.fetchCitiesByProvince=function(pro) {
        $http({
          method: "POST",
          url: "/proxy/node_server/svr/request",
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token,
          },
          data:
          {
            request:'fetchCitiesByProvince',
            info:{
              provinceName:pro
            }
          }
        }).then(function(res) {
          var json=res.data;
          if(json.re==1) {
            $scope.cities=json.data;
            $scope.area.city='请选择';
            $scope.tab_change('city');
          }
        }).catch(function(err) {
          var str='';
          for(var field in err)
            str+=err[field];
          console.error('error=\r\n' + str);
        })
      };

      $scope.fetchTownsByCity=function(city) {
        $http({
          method: "POST",
          url: "/proxy/node_server/svr/request",
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token,
          },
          data:
          {
            request:'fetchTownsByCity',
            info:{
              cityName :city,
              provinceName:$scope.area.province
            }
          }
        }).then(function(res) {
          var json=res.data;
          if(json.re==1) {
            $scope.towns=json.data;
            $scope.area.town='请选择';
            $scope.tab_change('town');
          }
        }).catch(function(err) {
          var str='';
          for(var field in err)
            str+=err[field];
          console.error('error=\r\n' + str);
        })
      };

      $scope.fetchMaintenancesInArea=function(){
        $http({
          method: "POST",
          url: "/proxy/node_server/svr/request",
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token,
          },
          data:
          {
            request:'fetchMaintenanceInArea',
            info:{
              provinceName:$scope.area.province,
              cityName:$scope.area.city,
              townName:$scope.area.town
            }
          }
        }).then(function(res) {
          var json=res.data;
          if(json.re==1) {
            $scope.cities=json.data;
            $scope.area.city='请选择';
            $scope.tab_change('city');
          }
        }).catch(function(err) {
          var str='';
          for(var field in err)
            str+=err[field];
          console.error('error=\r\n' + str);
        })
      }



      //var geolocation = new BMap.Geolocation();
      //geolocation.getCurrentPosition(function(r){
      //  if(this.getStatus() == BMAP_STATUS_SUCCESS){
      //    //var mk = new BMap.Marker(r.point);
      //    //map.addOverlay(mk);
      //    //map.panTo(r.point);
      //
      //    //map.setCenter(new BMap.Point(r.point.lng, r.point.lat));
      //
      //
      //    var pointArr = [];
      //    alert(r.point.lng + ',' + r.point.lat);
      //
      //
      //  }
      //  else {
      //    alert('failed'+this.getStatus());
      //  }
      //},{enableHighAccuracy: true});


    });

  });
