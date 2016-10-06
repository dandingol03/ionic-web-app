/**
 * Created by danding on 16/9/6.
 */
angular.module('starter')

  .controller('chatterController',function($scope,$http,$rootScope,$cordovaMedia,$ionicLoading,$cordovaCapture){


    //搜索可用聊天客服
    $http({
      method: "post",
      url: "/proxy/node_server/svr/request",
      headers: {
        'Authorization': "Bearer " + $rootScope.access_token
      },
      data:
      {
        request:'searchFreeServicePerson'
      }
    }).then(function(res) {
      var json=res.data;
      if(json.re==1) {
        console.log('...');
      }
    }).catch(function(err) {
      var str='';
      for(var field in err)
        str+=err[field];
      console.error('err=\r\n' + str);
    });

    $scope.messages=[
      {
        userId: '534b8e5aaa5e7afc1b23e69b',
        date: new Date(),
        text: 'Lorem ipsum dolor sit amet, ' +
        'consectetur adipiscing elit, ' +
        'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      },
      {
        userId: '134b8e5aa53e2afc1b23e78b',
        date: new Date(),
        text: 'i hate this guy, tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'
      }];

    $scope.input={

    };

    $scope.sendMsg=function(){
      if($scope.input.message!==undefined&&$scope.input.message!==null)
      {
        $http({
          method: "post",
          url: "/proxy/node_server/svr/request",
          headers: {
            'Authorization': "Bearer " + $rootScope.access_token,
          },
          data:
          {
            request:'pushTextMsg',
            info:{
              msg:$scope.input.message,
              type:'customer'
            }
          }
        })
      }
    }


    $scope.viewProfile=function(msg){
      console.log('...');
    }




    //录音
    $scope.startRecord=function(){

      var src = "audio.mp3";
      $scope.mediaRec =$cordovaMedia.newMedia(src);
      alert('mediarec=\r\n' + $scope.mediaRec);
      $scope.mediaRec.startRecord();

    }

    $scope.stopRecord=function(){
      $scope.mediaRec.stopRecord();
    }

    $scope.play=function(){
      $scope.mediaRec.play();
    }

    $scope.startCapture=function(){
      var options = { limit: 3, duration: 15 };
      $cordovaCapture.captureVideo(options).then(function(videoData) {
        // Success! Video data is here
        $scope.videoData=videoData[0];
        for(var field in $scope.videoData) {
          alert('field=' + field);
          alert('data=\r\n' + $scope.videoData[field]);
        }
      }, function(err) {
        // An error occurred. Show a message to the user
        var str='';
        for(var field in err)
          str+=err[field];
        console.error('error=\r\n' + str);
      });
    }


    $scope.stopCapture=function(){

    }
  });
