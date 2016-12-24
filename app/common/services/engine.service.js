/**
 * Created by yotam on 22/12/2016.
 */
angular.module('myApp.services')

    .service('EngineService', ['$rootScope', function ($rootScope) {
        var _stage, _renderer, _stageItems = {}, _rendered = false;
        var _images = [
            {"path": "air-conditioner-1.png"},
            {"path": "armchair.png"},
            {"path": "armchair-1.png"},
            {"path": "armchair-2.png"},
            {"path": "armchair-3.png"},
            {"path": "armchair-4.png"},
            {"path": "armchair-5.png"},
            {"path": "armchair-6.png"},
            {"path": "armchair-7.png"},
            {"path": "bathtub.png"},
            {"path": "bathtub-1.png"},
            {"path": "bathtub-2.png"},
            {"path": "bed.png"},
            {"path": "bed-1.png"},
            {"path": "bed-2.png"},
            {"path": "blender.png"},
            {"path": "boiler.png"},
            {"path": "bonsai.png"},
            {"path": "bookcase.png"},
            {"path": "bookcase-1.png"},
            {"path": "bookshelf.png"},
            {"path": "bookshelf-1.png"},
            {"path": "bookshelf-2.png"},
            {"path": "bookshelf-3.png"},
            {"path": "bookshelf-4.png"},
            {"path": "cactus.png"},
            {"path": "cactus-1.png"},
            {"path": "chair.png"},
            {"path": "chair-1.png"},
            {"path": "chair-2.png"},
            {"path": "chair-3.png"},
            {"path": "chair-4.png"},
            {"path": "chair-5.png"},
            {"path": "chandelier.png"},
            {"path": "chest-of-drawers.png"},
            {"path": "chest-of-drawers-1.png"},
            {"path": "chest-of-drawers-2.png"},
            {"path": "chest-of-drawers-3.png"},
            {"path": "chest-of-drawers-4.png"},
            {"path": "chest-of-drawers-5.png"},
            {"path": "chest-of-drawers-6.png"},
            {"path": "chest-of-drawers-7.png"},
            {"path": "closet.png"},
            {"path": "closet-1.png"},
            {"path": "closet-2.png"},
            {"path": "closet-3.png"},
            {"path": "closet-4.png"},
            {"path": "coffee-machine.png"},
            {"path": "cooker.png"},
            {"path": "cooler.png"},
            {"path": "couch.png"},
            {"path": "couch-1.png"},
            {"path": "couch-2.png"},
            {"path": "couch-3.png"},
            {"path": "couch-4.png"},
            {"path": "couch-5.png"},
            {"path": "couch-6.png"},
            {"path": "couch-7.png"},
            {"path": "couch-8.png"},
            {"path": "couch-9.png"},
            {"path": "couch-10.png"},
            {"path": "couch-11.png"},
            {"path": "desk.png"},
            {"path": "desk-1.png"},
            {"path": "desk-2.png"},
            {"path": "desk-3.png"},
            {"path": "desk-4.png"},
            {"path": "dishwasher.png"},
            {"path": "door.png"},
            {"path": "door-1.png"},
            {"path": "door-2.png"},
            {"path": "door-3.png"},
            {"path": "door-4.png"},
            {"path": "door-5.png"},
            {"path": "door-6.png"},
            {"path": "dressing.png"},
            {"path": "dressing-1.png"},
            {"path": "dressing-2.png"},
            {"path": "fireplace.png"},
            {"path": "fireplace-1.png"},
            {"path": "fireplace-2.png"},
            {"path": "fireplace-3.png"},
            {"path": "flower.png"},
            {"path": "flower-1.png"},
            {"path": "food-steamer.png"},
            {"path": "fridge.png"},
            {"path": "fridge-1.png"},
            {"path": "fridge-2.png"},
            {"path": "garage.png"},
            {"path": "hanger.png"},
            {"path": "hanger-1.png"},
            {"path": "hanger-2.png"},
            {"path": "heater.png"},
            {"path": "hood.png"},
            {"path": "iron.png"},
            {"path": "juicer.png"},
            {"path": "lamp.png"},
            {"path": "lamp-1.png"},
            {"path": "lamp-2.png"},
            {"path": "lamp-3.png"},
            {"path": "lamp-4.png"},
            {"path": "lamp-5.png"},
            {"path": "lamp-6.png"},
            {"path": "lamp-7.png"},
            {"path": "library.png"},
            {"path": "light-bulb.png"},
            {"path": "light-bulb-1.png"},
            {"path": "light-bulb-2.png"},
            {"path": "light-bulb-3.png"},
            {"path": "light-bulb-4.png"},
            {"path": "light-bulb-5.png"},
            {"path": "light-bulb-6.png"},
            {"path": "light-bulb-7.png"},
            {"path": "light-bulb-8.png"},
            {"path": "light-bulb-9.png"},
            {"path": "lights.png"},
            {"path": "living-room.png"},
            {"path": "livingroom.png"},
            {"path": "livingroom-1.png"},
            {"path": "livingroom-2.png"},
            {"path": "meat-grinder.png"},
            {"path": "microwave.png"},
            {"path": "microwave-1.png"},
            {"path": "mixer.png"},
            {"path": "mixer-1.png"},
            {"path": "mixer-2.png"},
            {"path": "mixer-3.png"},
            {"path": "nightstand.png"},
            {"path": "nightstand-1.png"},
            {"path": "nightstand-2.png"},
            {"path": "office-chair.png"},
            {"path": "office-chair-1.png"},
            {"path": "office-chair-2.png"},
            {"path": "office-chair-3.png"},
            {"path": "office-chair-4.png"},
            {"path": "office-chair-5.png"},
            {"path": "office-chair-6.png"},
            {"path": "office-chair-7.png"},
            {"path": "office-chair-8.png"},
            {"path": "office-chair-9.png"},
            {"path": "office-chair-10.png"},
            {"path": "office-chair-11.png"},
            {"path": "ottoman.png"},
            {"path": "pipe.png"},
            {"path": "pipe-1.png"},
            {"path": "pipe-2.png"},
            {"path": "pipe-3.png"},
            {"path": "pipe-4.png"},
            {"path": "pipe-5.png"},
            {"path": "pipe-6.png"},
            {"path": "plant.png"},
            {"path": "plant-1.png"},
            {"path": "plant-2.png"},
            {"path": "plant-3.png"},
            {"path": "radiator.png"},
            {"path": "radiator-1.png"},
            {"path": "radiator-2.png"},
            {"path": "radiator-3.png"},
            {"path": "radiator-4.png"},
            {"path": "sandwich-maker.png"},
            {"path": "sewing-machine.png"},
            {"path": "shower.png"},
            {"path": "shower-1.png"},
            {"path": "shower-2.png"},
            {"path": "sink.png"},
            {"path": "sink-1.png"},
            {"path": "sofa.png"},
            {"path": "sofa-1.png"},
            {"path": "sofa-2.png"},
            {"path": "sofa-3.png"},
            {"path": "sofa-4.png"},
            {"path": "sofa-5.png"},
            {"path": "sofa-6.png"},
            {"path": "sofa-7.png"},
            {"path": "sofa-8.png"},
            {"path": "sofa-9.png"},
            {"path": "sofa-10.png"},
            {"path": "sofa-11.png"},
            {"path": "sofa-12.png"},
            {"path": "sofa-13.png"},
            {"path": "sofa-14.png"},
            {"path": "sofa-15.png"},
            {"path": "sofa-16.png"},
            {"path": "sofa-17.png"},
            {"path": "sofa-18.png"},
            {"path": "stairs.png"},
            {"path": "stairs-1.png"},
            {"path": "stool.png"},
            {"path": "stool-1.png"},
            {"path": "stool-2.png"},
            {"path": "stove.png"},
            {"path": "stove-1.png"},
            {"path": "table.png"},
            {"path": "table-1.png"},
            {"path": "table-2.png"},
            {"path": "table-3.png"},
            {"path": "table-4.png"},
            {"path": "table-5.png"},
            {"path": "table-6.png"},
            {"path": "table-7.png"},
            {"path": "tap.png"},
            {"path": "television.png"},
            {"path": "television-1.png"},
            {"path": "television-2.png"},
            {"path": "television-3.png"},
            {"path": "television-4.png"},
            {"path": "toilet.png"},
            {"path": "tulips.png"},
            {"path": "vacuum-cleaner.png"},
            {"path": "valve.png"},
            {"path": "valve-1.png"},
            {"path": "valve-2.png"},
            {"path": "wall.png"},
            {"path": "wardrobe.png"},
            {"path": "wardrobe-1.png"},
            {"path": "wardrobe-2.png"},
            {"path": "washing-machine.png"},
            {"path": "washing-machine-1.png"},
            {"path": "water-heater.png"},
            {"path": "window.png"},
            {"path": "window-1.png"},
            {"path": "window-2.png"},
            {"path": "window-3.png"},
            {"path": "window-4.png"},
            {"path": "window-5.png"},
            {"path": "window-6.png"},
            {"path": "window-7.png"},
            {"path": "window-8.png"},
            {"path": "window-9.png"}]

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
        function onMouseOver(){
            this.alpha = 0.5;
        }
        function onMouseOut(){
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

        function updateStageState(newData, reset){
            if (newData && newData.items) {
                if (reset){
                    for (var i = _stage.children.length - 1; i >= 0; i--) {
                        _stage.removeChild(_stage.children[i]);
                    };
                    _stageItems = {};
                }
                for (var key in newData.items) {
                    var item = newData.items[key];
                    if (!_stageItems[key]){
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
                if (roomData && roomData.items && roomData.items !== "null"){
                    if (!_rendered){
                        _rendered = true;
                        _renderer = PIXI.autoDetectRenderer(Consts.STAGE_WIDTH, Consts.STAGE_HEIGHT, {transparent: true} );
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

            generatedNewItem : function(item){
                return {
                    path : item.path,
                    height : Consts.ITEM_HEIGHT,
                    width : Consts.ITEM_WIDTH,
                    x : (Consts.STAGE_WIDTH / 2) + getRandomArbitrary(-200, 200) ,
                    y : (Consts.STAGE_HEIGHT / 2) + getRandomArbitrary(-200, 200)
                }
            },
            
/*            addItem : function(data){
                createStageItem(data.key, {path : data.path, width: 100, height:100, x: Consts.STAGE_WIDTH / 2, y:Consts.STAGE_HEIGHT / 2});
            }*/
        };
        
        return Service;
    }]);
