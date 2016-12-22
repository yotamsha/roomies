/**
 * Created by yotam on 22/12/2016.
 */
angular.module('myApp.services')

    .service('EngineService', ['$rootScope', function ($rootScope) {
        var _stage, _renderer, _stageItems = [];
        var _images = [
            {
                path: 'armchair.png'
            },
            {
                path: 'plant-2.png'
            },
            {
                path: 'plant-3.png'
            },
            {
                path: 'bed.png',
                width: 300,
                height: 300,
            },
            {
                path: 'closet.png',
                width: 200,
                height: 200,
            },
            {
                path: 'chest-of-drawers-2.png',
                width: 200,
                height: 200,
            },
        ];
        var Consts = {
            FLOOR_Y_THRESHOLD: 513,
            DEFAULT_SCALE: 0.2,
            ITEM_WIDTH : 100,
            ITEM_HEIGHT : 100,
            STAGE_WIDTH : 1300,
            STAGE_HEIGHT : 700,
        }
        var basePath = "../../assets/images/furniture/";

        function createStageItem(key, image, width, height, x, y) {
            var texture = PIXI.Texture.fromImage(basePath + image);

            // create our little stageItem friend..
            var stageItem = new PIXI.Sprite(texture);
            stageItem.metaData = {
                originalWidth: width,
                originalHeight: height
            };
            // enable the stageItem to be interactive... this will allow it to respond to mouse and touch events
            stageItem.interactive = true;

            // this button mode will mean the hand cursor appears when you roll over the stageItem with your mouse
            stageItem.buttonMode = true;

            // center the stageItem's anchor point
            stageItem.anchor.set(0.5);
            stageItem.width = width;
            stageItem.height = height;
/*
            stageItem.scale.set(scale)
*/
            // setup events
            stageItem
            // events for drag start
                .on('mousedown', onDragStart)
                .on('touchstart', onDragStart)
                // events for drag end
                .on('mouseup', onDragEnd)
                .on('mouseupoutside', onDragEnd)
                .on('touchend', onDragEnd)
                .on('touchendoutside', onDragEnd)
                // events for drag move
                .on('mousemove', onDragMove)
                .on('touchmove', onDragMove);
            // move the sprite to its designated position
            stageItem.position.x = x;
            stageItem.position.y = y;
            stageItem.imageKey = image;
            stageItem.key = key;
            // add it to the stage
            _stage.addChild(stageItem);
            _stageItems.push({
                key : stageItem.key,
                x : stageItem.position.x,
                y : stageItem.position.y,
                width : stageItem.width,
                height : stageItem.height,
                image : stageItem.imageKey,
            });
        }

        function animate() {

            requestAnimationFrame(animate);

            // render the stage
            _renderer.render(_stage);
        }

        /*        function onthisDropped(event){
         var resizing = false;
         if (resizing){
         onResizeEnd(this, event);
         } else {
         onDragEnd(this, event);
         }
         }
         function onthisSelected(){
         var isCorner = false;
         if (isCorner){
         onResizeStart(this, event);
         } else {
         onDragStart(this, event);
         }

         }

         function onResizeStart(this, event){
         console.log("onResizeStart", event);
         this.data = event;
         this.alpha = 0.5;
         this.data.resizing = true;

         }
         function onResizeEnd(this, event){
         console.log("onResizeEnd", event);

         this.scale.x += 0.3;
         this.scale.y += 0.3;
         this.alpha = 1;
         this.resizing = false;
         // set the interaction data to null
         this.data = null;

         }*/

        function onDragStart(event) {
            // store a reference to the data
            // the reason for this is because of multitouch
            // we want to track the movement of this particular touch
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;

        }

        function onDragEnd(event) {
            console.log("ID: " + this.ID);
            this.alpha = 1;
            this.dragging = false;

            // set the interaction data to null
            this.data = null;
            var distance = this.position.y - Consts.FLOOR_Y_THRESHOLD;
            if (distance > 0) { // the object was dragged towards the floor
                var scale = Math.ceil((distance + 100) / 100) ;
                this.width = this.metaData.originalWidth * (1 + scale / 10);
                this.height = this.metaData.originalHeight * (1 + scale / 10);
            } else { // object is back at the background
                this.width = this.metaData.originalWidth;
                this.height = this.metaData.originalHeight;
            }
            $rootScope.$broadcast('STAGE_OBJECT_CHANGED',{
                key: this.key,
                height: this.height,
                width: this.width,
                x: this.position.x,
                y: this.position.y,
                image : this.imageKey
            });
        }

        function onDragMove() {
            if (this.dragging) {
                var newPosition = this.data.getLocalPosition(this.parent);
                this.position.x = newPosition.x;
                this.position.y = newPosition.y;
            }
        }

        var Service = {
            init: function ($element, roomData) {
                _renderer = PIXI.autoDetectRenderer(Consts.STAGE_WIDTH, Consts.STAGE_HEIGHT, {transparent: true});
                $element.append(_renderer.view);

                // create the root of the scene graph
                _stage = new PIXI.Container();
                if (roomData){
                    for (var key in roomData.items) {

                        var item = roomData.items[key];
                        var image = item.image || 'plant-2.png';
                        var texture = PIXI.Texture.fromImage(basePath + image);
                        var width = item.width || Consts.ITEM_WIDTH;
                        var height = item.height || Consts.ITEM_HEIGHT;
                        createStageItem(key, image, width, height, item.x, item.y);
                    }
                    requestAnimationFrame(animate);
                } else {
                    // create a texture from an image path
                    var len = _images.length;
                    for (var i = 0; i < len; i++) {
                        var image = _images.pop()
                        var width = image.width || Consts.ITEM_WIDTH;
                        var height = image.height || Consts.ITEM_HEIGHT;
                        createStageItem(null, image.path, width, height,
                            Math.floor(Math.random() * Consts.STAGE_WIDTH), Math.floor(Math.random() * Consts.STAGE_HEIGHT));
                    }
                    requestAnimationFrame(animate);
                    $rootScope.$broadcast('STAGE_CREATED',{
                        items : _stageItems
                    });
                }




            }
        };

        return Service;
    }]);
