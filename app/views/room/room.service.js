/**
 * Created by yotam on 22/12/2016.
 */
angular.module('myApp.room')

    .service('RoomService', ['$rootScope', function ($rootScope) {
        var Rooms = firebase.database().ref('roomies/rooms');
        var _roomRef;
        var Service = {
            getRoom : function(roomId){
                var roomRef = firebase.database().ref('roomies/rooms/' + roomId);
                return roomRef.once('value').then(function(snapshot) {
                    $rootScope.$broadcast('EXISTING_ROOM_LOADED', snapshot.val());
                    return snapshot.val();
                });
            },
            setItem : function(roomId, itemKey, data){
                delete data.key;
                var itemRef = firebase.database().ref('roomies/rooms/' + roomId + '/items/' + itemKey);
                return itemRef.set(data);
            },
        };

        return Service;
    }]);
