'use strict';

angular.module('myApp.stage.stage-directive', [])

.directive('stageRenderer', ['EngineService' , function(EngineService) {
  return {
    scope : {
      roomData : "="
    },
    link : function(scope, elm, attrs) {
      var initialized = false;
      scope.$watch(attrs.roomData, function (roomData) {
        if (roomData !== undefined){
          // EngineService.redrawChanges(elm,roomData);
          initialized = true;
        }
      });
      //

    }
  };
}]);
