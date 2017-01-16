/**
 * 
 * @param {type} activeAnchor
 * @returns {undefined}
 */
function update(activeAnchor) {
    var group = activeAnchor.getParent();

    var topLeft = group.get('.topLeft')[0];
    var topRight = group.get('.topRight')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var bottomLeft = group.get('.bottomLeft')[0];
    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();

    // update anchor positions
    switch (activeAnchor.getName()) {
        case 'topLeft':
            topRight.setY(anchorY);
            bottomLeft.setX(anchorX);
            break;
        case 'topRight':
            topLeft.setY(anchorY);
            bottomRight.setX(anchorX);
            break;
        case 'bottomRight':
            bottomLeft.setY(anchorY);
            topRight.setX(anchorX);
            break;
        case 'bottomLeft':
            bottomRight.setY(anchorY);
            topLeft.setX(anchorX);
            break;
    }

    var width = topRight.getX() - topLeft.getX();
    var height = bottomLeft.getY() - topLeft.getY();
    var rect = group.children[0];
    rect.position(topLeft.position());

    if (width && height) {
        rect.width(width);
        rect.height(height);
    }
    
    //find image.id === dragerresizer.id
    var obj = findSampleObjOnLayer(dragLayer.findOne('.dragerresizer').attrs.id);//rect.attrs.id

    if (obj && width && height) {
        obj.width(width);
        obj.height(height);
        
        obj.position(rect.getAbsolutePosition());  
        obj.setAttr('offsetX', 0).setAttr('offsetY', 0);
        obj.getLayer().draw();
    }
}

/**
 * 
 * @param {type} group
 * @param {type} x
 * @param {type} y
 * @param {type} name
 * @returns {undefined}
 */
function addAnchor(group, x, y, name) {
    var stage = group.getStage();
    var layer = group.getLayer();

    var anchor = new Konva.Circle({
        x: x,
        y: y,
        stroke: '#666',
        fill: '#ddd',
        strokeWidth: 1,
        radius: 4,
        name: name,
        draggable: true,
        dragOnTop: false
    });

    anchor.on('dragmove', function () {
        update(this);
        layer.draw();
    });
    anchor.on('mousedown touchstart', function () {
        group.setDraggable(false);
        this.moveToTop();
    });
    anchor.on('dragend', function () {
        group.setDraggable(true);
        layer.draw();
        
    });
    // add hover styling
    anchor.on('mouseover', function () {
        var layer = this.getLayer();
        document.body.style.cursor = 'pointer';
        this.setStrokeWidth(4);
        layer.draw();
    });
    anchor.on('mouseout', function () {
        var layer = this.getLayer();
        document.body.style.cursor = 'default';
        this.setStrokeWidth(2);
        //layer.draw();
    });

    group.add(anchor);
}

/**
 * 
 * @param {type} obj
 * @returns {undefined}
 */
function addDraggerResizer(obj) {

    var resizeSample = new Konva.Group({
        x: obj.x,
        y: obj.y,
        width: obj.width,
        height: obj.height,
        id: obj.id,
        name: obj.name

    });

    dragLayer.add(resizeSample);

    var Dragger = new Konva.Rect({
        x: 0,
        y: 0,
        width: obj.width,
        height: obj.height,
        id: obj.id,
        name: obj.name,
        stroke: 'black',
        strokeWidth: 1
    });
    //
    resizeSample.add(Dragger);
    //
    addAnchor(resizeSample, 0, 0, 'topLeft');
    addAnchor(resizeSample, 0 + obj.width, 0, 'topRight');
    addAnchor(resizeSample, 0 + obj.width, 0 + obj.height, 'bottomRight');
    addAnchor(resizeSample, 0, 0 + obj.height, 'bottomLeft');

    /*overhead of draggerresizer*/

    var overhead = new Konva.Circle({
        x: obj.width / 2,
        y: -obj.height/6,
        radius: 8,
        stroke: '#666',
        fill: '#ddd',
        strokeWidth: 1,
        name: 'over'
    });
    resizeSample.add(overhead);
    
}

/**
 * 
 * @param {type} mes
 * @returns {undefined}
 */
function journalOperation(mes) {
    //console.log(mes);
}
/**
 * 
 * @returns {undefined}
 */
var json = null;
function saveStageToHistory() {
    /* SAVE TO JSON */
    json = stage.toJSON();
    //console.log(json);

}
/**
 * 
 * @param {type} obj
 * @param {type} layer
 * @returns {undefined}
 */
function addImage(obj, layer) {

    var imageObj = new Image();
    imageObj.onload = function () {
        var node = new Konva.Image({
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height,
            image: imageObj,
            id: obj.id,
            type: obj.type,
            src: obj.src
        });

        layer.add(node);
        layer.draw();
    };
    imageObj.src = obj.src;
    //
    journalOperation('image add ' + obj.id);
}
/**
 * 
 * @param {type} sample_id
 * @returns {Konva.Layer.children|findSampleObjOnLayer.objects}
 */
function findSampleObjOnLayer(sample_id) {
    var objects = sample_layer.children;
    var r = null;
    for (var i = 0; i < objects.length; i++) {
        if (objects[i].attrs.id === sample_id) {
            r = objects[i];
            break;
        }
    }
    return r;
}

/*
 * @param {type} obj
 * @param {type} layer
 * @param {undefined}
 */
function addText(obj, layer) {

    var textObj = new Text();

    var node = new Konva.Text({
        x: obj.x,
        y: obj.y,
        id: obj.id,
        fontSize: obj.fontSize,
        lineCap: obj.lineCap,
        lineJoin: obj.lineJoin,
        width: obj.width,
        height: obj.height,
        text: obj.text,
        type: obj.type,
        fontStyle: obj.fontStyle
    });

    layer.add(node);
    layer.draw();
    //
    journalOperation('text add ' + obj.id);
}
/*
 * 
 * @returns {undefined}
 */
function saveNavigatorToJSON() {
    json = navigator_collection.toJSON();
}
