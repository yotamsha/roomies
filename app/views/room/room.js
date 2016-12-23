'use strict';

angular.module('myApp.room', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/room', {
            templateUrl: 'views/room/room.html',
            controller: 'RoomCtrl',
            controllerAs: 'ctrl'
        });
    }])

    .controller('RoomCtrl', ['$scope', 'EngineService', '$firebaseObject', '$rootScope', 'RoomService',
        function ($scope, EngineService, $firebaseObject, $rootScope, RoomService) {
            var ctrl = this;
            var Rooms = firebase.database().ref('roomies/rooms');
            ctrl.storageBasePath = "../../assets/images/furniture/";
            function _init() {
                ctrl.availableItems = RoomService.getItemsInventory();
                ctrl.roomId = window.localStorage.roomId;
                if (window.localStorage && window.localStorage.roomId) {
                    RoomService.getRoom(window.localStorage.roomId).then(function (data) {
                        $scope.roomData = data;
                        $scope.$apply();
                        console.log("RoomData loaded: ", data);
                    });
                } else {
                    // $scope.roomData = null;
                }
                _initListeners();
            }

            function _initListeners() {
                // CLIENT EVENTS //

                // Every user interaction on the stage triggers an event which is then updating the server.
                $rootScope.$on('STAGE_OBJECT_CHANGED', function (e, data) {
                    console.log('STAGE_OBJECT_CHANGED', data);
                    RoomService.setItem(ctrl.roomId, data.key, data);
                });

                $rootScope.$on('STAGE_CREATED', function (e, data) {
                    // Triggered when a new user enters.
                    // Room should be created for the new user.
                    // room ID should be saved in user session (localStorage or Firebase eventually)
                    var newRoomRef = Rooms.push();
                    newRoomRef.set({items: {}});
                    // TODO replace this with two separate calls, one for adding an item, and one for adding the item to the room.
                    ctrl.roomItemsRef = firebase.database().ref('roomies/rooms/' + newRoomRef.key + '/items');

                    for (var i = 0; i < data.items.length; i++) {
                        var itemRef = ctrl.roomItemsRef.push(); // add item to room
                        itemRef.set(data.items[i]);
                    }
                    ctrl.roomId = newRoomRef.key;
                    ctrl.roomRef = newRoomRef;
                    localStorage.setItem('roomId', newRoomRef.key);
                    console.log('STAGE_CREATED', ctrl.roomId);
                });

                // SERVER EVENTS //

                // Every event  on the server triggers a client event which then produces a change in the stage.

                $rootScope.$on('EXISTING_ROOM_LOADED', function (e, data) {
                    // Triggered when a new user enters.
                    // The room should be rendered with the loaded data
                    console.log('USER_ROOM_LOADED', data);
                });
                $rootScope.$on('NO_EXISTING_ROOM_FOUND', function (data) {
                    // Triggered when no room was found in session.
                    // Room should be rendered.
                    console.log('NO_EXISTING_ROOM_FOUND', data);
                });
                $rootScope.$on('ROOM_OBJECT_CHANGED', function (e, data) {
                    console.log('ROOM_OBJECT_CHANGED', data);
                });

                Rooms.on("value", function (snapshot) {
                    // We should listen to when a child is changed, if it has the same ID as the one we are looking at
                    // then the change should immediately appear in the room.
                    $rootScope.$broadcast('ROOM_OBJECT_CHANGED', snapshot.val());

                });
            }
            
            ctrl.scrollToClass = function(className){
                var $target = $(className);
                console.log("$target.offset().top: " + $target.offset().top);
                $("body").animate({scrollTop: $target.offset().top}, 600); // scroll to discussion top
            };
            
            _init();
            

        }]);