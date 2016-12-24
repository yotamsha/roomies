'use strict';

angular.module('myApp.room', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/room', {
            templateUrl: 'views/room/room.html',
            controller: 'RoomCtrl',
            controllerAs: 'ctrl',
            reloadOnSearch : false
        });
    }])

    .controller('RoomCtrl', ['$scope', 'EngineService', '$firebaseObject', '$rootScope', 'RoomService','$anchorScroll','$location',
        function ($scope, EngineService, $firebaseObject, $rootScope, RoomService, $anchorScroll, $location) {
            var ctrl = this;
            var $canvasElement = angular.element(document.getElementsByClassName('stage'));
            var Rooms = firebase.database().ref('roomies/rooms');
            ctrl.storageBasePath = "../../assets/images/furniture/";
            ctrl.showRoomsPopupBox = false;
            var defaultRoom = {
                "items": {
                    "1": {
                        "height": 220.00000000000003,
                        "path": "bookshelf-1.png",
                        "width": 220.00000000000003,
                        "x": 351.5,
                        "y": 449
                    },
                    "2": {"height": 165, "path": "desk.png", "width": 165, "x": 610.5, "y": 473},
                    "3": {"height": 275, "path": "library.png", "width": 275, "x": 911.5, "y": 438},
                    "4": {"height": 100, "path": "lamp-3.png", "width": 100, "x": 1126.5, "y": 228},
                    "5": {"height": 100, "path": "plant.png", "width": 100, "x": 457.5, "y": 198},
                    "6": {"height": 100, "path": "plant-1.png", "width": 100, "x": 374.5, "y": 197},
                    "7": {"height": 100, "path": "plant-2.png", "width": 100, "x": 650.5, "y": 198},
                    "8": {"height": 100, "path": "plant-3.png", "width": 100, "x": 549.5, "y": 197},
                    "9": {"height": 130, "path": "cactus-1.png", "width": 130, "x": 37.5, "y": 632},
                    "10": {"height": 130, "path": "cactus-1.png", "width": 130, "x": 1239.5, "y": 630}
                }
            };
            function _init() {
                ctrl.availableItems = RoomService.getItemsInventory();
                ctrl.roomId = window.localStorage.roomId;
                ctrl.isRoomOwned = true;
                if (window.localStorage && window.localStorage.roomId) {
                    ctrl.userRoomId = window.localStorage.roomId;

                    console.log("Loading data for room ID: ", window.localStorage.roomId);
                    RoomService.getRoom(window.localStorage.roomId).then(function (data) {
                        EngineService.redrawChanges($canvasElement, data);
                        console.log("RoomData loaded: ", data);
                        ctrl.roomData = data;

                    });
                } else {
                    // create a room in the server.
                    var newRoomRef = Rooms.push();
                    newRoomRef.set(defaultRoom);
                    ctrl.roomId = newRoomRef.key;
                    ctrl.roomRef = newRoomRef;
                    localStorage.setItem('roomId', newRoomRef.key);
                    ctrl.userRoomId = newRoomRef.key;
                    console.log("Room Created: ", newRoomRef.key);

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
/*                    var newRoomRef = Rooms.push();
                    newRoomRef.set({items: {}});
                    // TODO replace this with two separate calls, one for adding an item, and one for adding the item to the room.
                    ctrl.roomItemsRef = firebase.database().ref('roomies/rooms/' + newRoomRef.key + '/items');

                    for (var i = 0; i < data.items.length; i++) {
                        var itemRef = ctrl.roomItemsRef.push(); // add item to room
                        itemRef.set(data.items[i]);
                    }*/
/*                    ctrl.roomId = newRoomRef.key;
                    ctrl.roomRef = newRoomRef;
                    localStorage.setItem('roomId', newRoomRef.key);*/
                    console.log('STAGE_CREATED', ctrl.roomId);
                });

/*                $rootScope.$on('OBJECT_PICKED', function (e, data) {
                    // Add item on server
                    console.log('OBJECT_PICKED', data);
                });*/


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
                    console.log('ROOM_OBJECT_CHANGED', snapshot.val());
                    var roomsData = snapshot.val();
                    // We should listen to when a child is changed, if it has the same ID as the one we are looking at
                    // then the change should immediately appear in the room.
                    //$scope.roomData = roomsData[ctrl.roomId];
                    if (roomsData[ctrl.roomId] && roomsData[ctrl.roomId].items){
                        EngineService.redrawChanges($canvasElement, roomsData[ctrl.roomId]);
                    }
                    ctrl.rooms = roomsData;
/*                    if(!$scope.$$phase) { // check that no digest is taking place.
                        $scope.$apply();
                    }*/

                });
            }
            
            ctrl.scrollToElement = function(hash){
                $location.hash(hash);
                $anchorScroll();
            };
            ctrl.addItemToRoom = function(item) {
                var newItem = EngineService.generatedNewItem(item);
                RoomService.addItem(ctrl.roomId, newItem).then(function(data){ // Add item on server
                });
            };
            ctrl.showRoomsPopup = function(){
                ctrl.showRoomsPopupBox = true;
            };
            ctrl.switchToRoom = function(roomId, switchToMyRoom){
                if (!roomId || switchToMyRoom){
                    roomId = window.localStorage.roomId;
                }
                RoomService.getRoom(roomId).then(function (data) {
                    EngineService.redrawChanges($canvasElement, data, true);
                    ctrl.roomId = roomId;
                    ctrl.isRoomOwned = roomId === window.localStorage.roomId;
                    ctrl.showRoomsPopupBox = false;
                    $scope.$apply();
                });

            };
            
            _init();
            

        }]);