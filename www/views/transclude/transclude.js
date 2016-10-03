/**
 * Created by danding on 16/9/6.
 */
angular.module('starter')

  .controller('transcludeController',function($scope,$state,$ionicLoading,$http){


  })
  .directive('sidebox', function () {
    return ({
      restrict:'EA',
      scope:{
        title:'@'
      },
      transclude:true,
      template:'<div class=\'sidebox\'>' +
      '<div class=\'content\'>' +
      '<h2 class=\'header\'>{{title}}</h2>' +
      '<span class=\'content\' ng-transclude>' +
      '</span>' +
      '</div>' +
      '</div>'
    })
  })


