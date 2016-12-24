/**
 * Created by yotam on 22/12/2016.
 */
angular.module('myApp.services')

    .service('EngineService', ['$rootScope', function ($rootScope) {
        var _stage, _renderer, _stageItems = {}, _rendered = false;

        var Consts = {
            FLOOR_Y_THRESHOLD: 513,
            DEFAULT_SCALE: 0.2,
            ITEM_WIDTH: 100,
            ITEM_HEIGHT: 100,
            STAGE_WIDTH: 1300,
            STAGE_HEIGHT: 700,
        }
        var basePath = "../../assets/images/furniture/";
        // Drag is the best layer, dragged element is above everything else
        var dragLayer = new PIXI.DisplayGroup(2, false);
        var defaultLayer = new PIXI.DisplayGroup(-1, false);
        // z-index = 0, sorting = true;
        var floorLayer = new PIXI.DisplayGroup(1, false);
        var _lastDraggedObject = null;

        function animate() {

            requestAnimationFrame(animate);

            // render the stage
            _renderer.render(_stage);
        }

        function addShadow(obj) {
            var blurFilter = new PIXI.filters.BlurFilter();
            blurFilter.blur = 0.8;

            var gr = new PIXI.Graphics();
            gr.beginFill(0x0, 1);
            //yes , I know bunny size, I'm sorry for this hack
            var scale = 1.1;
            gr.drawRect(obj.width / 2, obj.width / 2, obj.width, obj.width);
            gr.endFill();
            gr.filters = [blurFilter];

            // gr.displayGroup = shadowLayer;
            obj.addChild(gr);
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

        function isInFloorArea(object) {
            var OFFSET = 35; // y offset is needed to make sure the item bottom is tested against the threshold.
            return (object.position.y + (object.height / 2) - OFFSET > Consts.FLOOR_Y_THRESHOLD);
        }

        function onDragStart(event) {
            // store a reference to the data
            // the reason for this is because of multitouch
            // we want to track the movement of this particular touch
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;
            this.oldGroup = this.displayGroup;

        }

        function onDragEnd(event) {
            console.log("ID: " + this.ID);
            this.alpha = 1;
            this.dragging = false;

            _lastDraggedObject = this;
            // set the interaction data to null
            this.data = null;
            var distance = this.position.y - Consts.FLOOR_Y_THRESHOLD;
            if (isInFloorArea(this)) { // the object was dragged towards the floor
                console.log("In floor!!!!!");
                var scale = Math.ceil((distance + 100) / 100);
                this.width = this.metaData.originalWidth * (1 + scale / 10);
                this.height = this.metaData.originalHeight * (1 + scale / 10);
                this.displayGroup = floorLayer;

            } else { // object is back at the background
                this.width = this.metaData.originalWidth;
                this.height = this.metaData.originalHeight;
                this.displayGroup = defaultLayer;

            }
            $rootScope.$broadcast('STAGE_OBJECT_CHANGED', {
                key: this.key,
                height: this.height,
                width: this.width,
                x: this.position.x,
                y: this.position.y,
                path: this.path
            });
        }

        function onDragMove() {
            if (this.dragging) {
                if (_lastDraggedObject && _lastDraggedObject !== this) { // remove last dragged object from top.
                    _lastDraggedObject.displayGroup = this.oldGroup;
                }
                if (!isInFloorArea) {
                    this.displayGroup = defaultLayer;
                } else {
                    this.displayGroup = floorLayer;
                }

                var newPosition = this.data.getLocalPosition(this.parent);
                this.position.x = newPosition.x;
                this.position.y = newPosition.y;
            }
        }

        function onMouseOver() {
            this.alpha = 0.5;
        }

        function onMouseOut() {
            this.alpha = 1;
        }

        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }

        function createStageItem(key, item) {
            var texture = PIXI.Texture.fromImage(basePath + item.path);

            // create our little stageItem friend..
            var stageItem = new PIXI.Sprite(texture);
            stageItem.metaData = {
                originalWidth: item.width,
                originalHeight: item.height
            };
            // enable the stageItem to be interactive... this will allow it to respond to mouse and touch events
            stageItem.interactive = true;

            // this button mode will mean the hand cursor appears when you roll over the stageItem with your mouse
            stageItem.buttonMode = true;

            // center the stageItem's anchor point
            stageItem.anchor.set(0.5);
            stageItem.width = item.width;
            stageItem.height = item.height;
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
                .on('touchmove', onDragMove)
                .on('mouseover', onMouseOver)
                .on('mouseout', onMouseOut)

            // move the sprite to its designated position
            stageItem.position.x = item.x;
            stageItem.position.y = item.y;
            stageItem.path = item.path;
            stageItem.key = key;
            // addShadow(stageItem);
            // add it to the stage
            _stage.addChild(stageItem);
            _stageItems[key] = stageItem;
        }

        function updateStageItem(stageItem, newState) {
            stageItem.width = newState.width;
            stageItem.height = newState.height;
            stageItem.position.x = newState.x;
            stageItem.position.y = newState.y;
        }

        function updateStageState(newData, reset) {
            if (newData && newData.items) {
                if (reset) {
                    for (var i = _stage.children.length - 1; i >= 0; i--) {
                        _stage.removeChild(_stage.children[i]);
                    }
                    ;
                    _stageItems = {};
                }
                for (var key in newData.items) {
                    var item = newData.items[key];
                    if (!_stageItems[key]) {
                        console.log("creating item: " + key);
                        createStageItem(key, item);
                    } else {
                        console.log("updating item: " + key);
                        updateStageItem(_stageItems[key], item);
                    }
                }
            }
        }

        var Service = {

            redrawChanges: function ($element, roomData, reset) {
                if (roomData && roomData.items && roomData.items !== "null") {
                    if (!_rendered) {
                        _rendered = true;
                        _renderer = PIXI.autoDetectRenderer(Consts.STAGE_WIDTH, Consts.STAGE_HEIGHT, {transparent: true});
                        $element.append(_renderer.view);
                        // create the root of the scene graph
                        _stage = new PIXI.Container();
                        //specify display list component
                        _stage.displayList = new PIXI.DisplayList();
                        requestAnimationFrame(animate);
                    }
                    updateStageState(roomData, reset);
                }
            },

            generatedNewItem: function (item) {
                return {
                    path: item.path,
                    height: Consts.ITEM_HEIGHT * (item.scale || 1),
                    width: Consts.ITEM_WIDTH * (item.scale || 1),
                    x: (Consts.STAGE_WIDTH / 2) + getRandomArbitrary(-200, 200),
                    y: (Consts.STAGE_HEIGHT / 2) + getRandomArbitrary(-200, 200)
                }
            },

            /*            addItem : function(data){
             createStageItem(data.key, {path : data.path, width: 100, height:100, x: Consts.STAGE_WIDTH / 2, y:Consts.STAGE_HEIGHT / 2});
             }*/
        };

        return Service;
    }]);
