
/*
 * @author Anastasia Popova
 */

//create objStage
var objStage = {
    width: '600',
    height: '253'
};

//DRAGERRESIZER
var dragers = [];
dragers[1] = {
    x: 150,
    y: 150,
    width: 93,
    height: 104,
    id: 0,
    name: 'dragerresizer'
};
/* INIT STAGE */

var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
    container: 'container',
    width: objStage.width,
    height: objStage.height
});

/* INIT LAYER */
var base_layer = new Konva.Layer();
var sample_layer = new Konva.Layer();
var dragLayer = new Konva.Layer();

/* ADD LAYER TO STAGE */
stage.add(base_layer);
stage.add(sample_layer);
stage.add(dragLayer);


/* EVENTS */
//mouseover mousemove
stage.on('dragmove', function (evt) {

    var node = evt.target;

    if (node && node.attrs.name === 'dragerresizer') {
        //get node id
        var id = node.attrs.id;
        document.body.style.cursor = 'pointer';
        //
        journalOperation('drag image - ' + JSON.stringify(node));
        var obj = findSampleObjOnLayer(id);

        if (obj) {

            journalOperation('drag image -+ ' + id);

            obj.position({
                x: node.attrs.x,
                y: node.attrs.y
            });
            sample_layer.draw();
        } else {
            journalOperation('image not found');
        }
    }
});

stage.on('mouseout', function () {
    document.body.style.cursor = 'default';
});

stage.on('mousedown', function (evt) {

    var node = evt.target;

    if (node && node.attrs.name === 'dragerresizer') {
        //get node id
        var id = node.attrs.id;
        document.body.style.cursor = 'pointer';
        journalOperation('drag image ' + id);
        var layer = node.getLayer();
        layer.draw();
        node.parent.startDrag();
    }
});

stage.on('mouseup', function (evt) {

    var node = evt.target;

    if (node && node.attrs.name === 'dragerresizer') {
        document.body.style.cursor = 'pointer';
        journalOperation('stop drag image');
        var layer = node.getLayer();
        layer.draw();
        node.parent.stopDrag();
        //
        saveStageToHistory();
    }
});
/*
 * Click on buttons open .passive_prints || .passive_base || .passive_text and close another two
 * @returns {undefined}
 */
$('#button_base').on('click', function () {
    //.passive_base is visible
    $('.passive_text').css('display', 'none');
    $('.passive_base').css('display', 'block');
    $('.passive_prints').css('display', 'none');
});

$('#button_print').on('click', function () {
    //.passive_prints is visible
    if (base_layer.findOne('Image')) {
        $('.passive_text').css('display', 'none');
        $('.passive_base').css('display', 'none');
        $('.passive_prints').css('display', 'block');
    }
});

$('#button_text').on('click', function () {
    //.passive_text is visible
    if (base_layer.findOne('Image')) {
        $('.passive_text').css('display', 'block');
        $('.passive_base').css('display', 'none');
        $('.passive_prints').css('display', 'none');
    }
});

/*
 * rotate draggerresizer
 */
$(document).ready(function () {

    stage.on('mouseup', function () {
        dragers[1].controlled = false;
    });

    stage.on('mousedown', function () {
        dragers[1].controlled = true;

        mousePos = stage.getPointerPosition();
        x = mousePos.x;
        y = mousePos.y;

    });

    var nodeX = null;
    var nodeY = null;
    var getRotation;

    //get dragerresizer rotation
    stage.on('mousedown', function (evt) {
        var node = evt.target;

        if (node && node.attrs.name === 'over') {

            getRotation = dragLayer.findOne('.dragerresizer').attrs.rotation;
            getRotation = (getRotation / 360) * (2 * Math.PI);
        }
    });

    stage.on('mousemove', function (evt) {
        var node = evt.target;

        if (node && node.attrs.name === 'over') {
            if (dragers[1].controlled) {
                if (nodeX === null) {
                    mousePos = stage.getPointerPosition();
                    nodeX = mousePos.x;
                    nodeY = mousePos.y;
                }

                //coordinates of dragerresizer
                var centerX = dragLayer.findOne('.dragerresizer').getAttr('x');
                var centerY = dragLayer.findOne('.dragerresizer').getAttr('y');

                var rotation_degree_start = (getRotation) ? getRotation : 0;

//                if (x > centerX && y < centerY) {
//
//                    var rotate = ((nodeX - x) > 0 ) ? 2 : -2;
//
//                } else if (x > centerX && y > centerY) {
//
//                    var rotate = ((nodeX - x) > 0) ? -2 : 2;
//
//                } else if (x < centerX && y > centerY) {
//
//                    var rotate = ((nodeX - x) > 0) ? -2 : 2;
//
//                } else if (x < centerX && y < centerY) {
//
//                    var rotate = ((nodeX - x) > 0) ? 2 : -2;
//                }

                var s_rad = Math.atan2(nodeY - centerY, nodeX - centerX); // current to origin
                s_rad -= Math.atan2(y - centerY, x - centerX);// handle to origin
                s_rad += rotation_degree_start; // start angle
                var rotate = (s_rad * (360 / (2 * Math.PI)));

                dragLayer.findOne('.dragerresizer').rotation(rotate);

                //rotate the target image with dragerresizer
                var arr = sample_layer.find('Image');
                for (a = 0; a < arr.length; a++) {

                    var dragId = dragLayer.findOne('.dragerresizer').getAttr('id');
                    if (dragId === arr[a].getAttr('id')) {
                        arr[a].rotation(rotate);
                    }
                }

                //rotate the target text with dragerresizer
                var array = sample_layer.find('Text');
                for (b = 0; b < array.length; b++) {

                    var dragId = dragLayer.findOne('.dragerresizer').getAttr('id');
                    if (dragId === array[b].getAttr('id')) {
                        array[b].rotation(rotate);
                    }
                }
                nodeX = null;
                nodeY = null;
            }

            dragLayer.draw();
            sample_layer.draw();
        }

    });

    /*
     * Make draggable node onclick in Konva, save parametrs x,y, rotation of dragerresizer
     * remove center of rotation
     * 
     * @param {obj} evt
     * @returns {undefined}
     */
    stage.on('click', function (evt) {
        var node = evt.target;
        if ((node.attrs.type === ("Image")) || (node.attrs.type === ("textForm"))) {
            if (dragLayer.findOne('.dragerresizer')) {
                dragLayer.findOne('.dragerresizer').remove();
            }
            //make dragerresizer resize it's width and height the same as object 
            dragers[1].height = node.attrs.height;
            dragers[1].width = node.attrs.width;

            addDraggerResizer(dragers[1]);

            dragLayer.findOne('.dragerresizer').setAttr('id', node.attrs.id);
            node.setAttr('offsetX', (node.attrs.width) / 2).setAttr('offsetY', (node.attrs.height) / 2);
            //JSON.parse
            saveStageToHistory();
            var objRotate = JSON.parse(json);

            //Obj show which obj in Konva we need
            var Obj = objRotate.children[1].children[node.index];
            var rotation = Obj.attrs.rotation;

            // save coordinates x y of draderresizer
            var objX = Obj.attrs.x;
            var objY = Obj.attrs.y;

            dragLayer.findOne('.dragerresizer')
                    .setAttr('offsetX', (node.attrs.width) / 2)
                    .setAttr('offsetY', (node.attrs.height) / 2)
                    .setAttr('rotation', rotation)
                    .setAttr('x', objX)
                    .setAttr('y', objY);

            //click image on Konva highlights the same li in Konva
            $('.passive_navigator li').css('background', 'inherit');
            $('.passive_navigator li').each(function (i, elem) {
                if (node.attrs.id == $(elem).attr('data-id')) {
                    $(elem).css('background', '#fff');
                }
            });
            //input on "focus" change text.value to obj.attrs.text
            if (node.attrs.type === ("textForm")) {
                $('textarea').on('focus', function () {
                    this.value = node.attrs.text;
                });
                $('textarea').focus();
                $('textarea').select();
            }
            //make buttons "italic" and "bold" not active
            $('#italic').removeClass('active');
            $('#bold').removeClass('active');
            if (node.attrs.fontStyle === 'italic') {
                $('#italic').toggleClass('active');
            }
            if (node.attrs.fontStyle === 'bold') {
                $('#bold').toggleClass('active');
            }
            if (node.attrs.fontStyle === 'italic bold') {
                $('#italic').toggleClass('active');
                $('#bold').toggleClass('active');
            }


            dragLayer.draw();
            sample_layer.draw();
        }
    });
    /**
     * update dragerresizer after it's resize on dragend 
     * param{type} evt 
     * returns node = circle
     */
    stage.on('dragend', function (evt) {
        var node = evt.target;
        if (node.className === "Circle") {
            var oldPos = dragLayer.findOne('.dragerresizer').position();
            var current = $('.passive_navigator').find("[data-id='" + dragLayer.findOne('.dragerresizer').attrs.id + "']");
            current.click();
            dragLayer.findOne('.dragerresizer').position(oldPos);
            var obj = findSampleObjOnLayer(dragLayer.findOne('.dragerresizer').attrs.id);
            obj.position(oldPos);
            sample_layer.draw();
            dragLayer.draw();
        }
    });
    /*
     * onkeypress = change text in Konva 
     * @returns {undefined}
     */
    $('textarea').on('keyup', function () {

        var choosedText = dragLayer.findOne('.dragerresizer').getAttr('id');
        var texts = this.value;
        sample_layer.find('Text').forEach(function (textItem) {

            if (textItem.attrs.id == choosedText) {
                textItem.setAttr('text', texts);
            }
        });
        sample_layer.draw();
    });

    /*
     * changes text align in Konva
     * @returns {undefined}
     */
    $('#leftSide').on('click', function () {
        var choosedText = dragLayer.findOne('.dragerresizer').getAttr('id');
        sample_layer.find('Text').forEach(function (textItem) {

            if (textItem.attrs.id == choosedText) {
                textItem.setAttr('align', 'left');
            }
        });
        sample_layer.draw();
    });

    $('#rightSide').on('click', function () {
        var choosedText = dragLayer.findOne('.dragerresizer').getAttr('id');
        sample_layer.find('Text').forEach(function (textItem) {

            if (textItem.attrs.id == choosedText) {
                textItem.setAttr('align', 'right');
            }
        });
        sample_layer.draw();
    });

    $('#centerSide').on('click', function () {
        var choosedText = dragLayer.findOne('.dragerresizer').getAttr('id');
        sample_layer.find('Text').forEach(function (textItem) {

            if (textItem.attrs.id == choosedText) {
                textItem.setAttr('align', 'center');
            }
        });
        sample_layer.draw();
    });

    /*
     *  make text in Konva italic or||and bold
     *  @returns {undefined}
     */
    var italic = $('#italic');
    var bold = $('#bold');

    function italic_bold() {
        var choosedText = dragLayer.findOne('.dragerresizer').getAttr('id');

        if (italic.hasClass('active') && bold.hasClass('active')) {

            sample_layer.find('Text').forEach(function (textItem) {
                if (textItem.attrs.id == choosedText) {
                    textItem.setAttr('fontStyle', 'italic bold');
                }
            });
            sample_layer.draw();
        }
        if (!italic.hasClass('active') && !bold.hasClass('active')) {
            sample_layer.find('Text').forEach(function (textItem) {
                if (textItem.attrs.id == choosedText) {
                    textItem.setAttr('fontStyle', 'normal');
                }
            });
            sample_layer.draw();
        }
    }
    italic.on('click', function () {
        $(this).toggleClass('active');
        var choosedText = dragLayer.findOne('.dragerresizer').getAttr('id');
        if ($(this).hasClass('active')) {
            sample_layer.find('Text').forEach(function (textItem) {
                if (textItem.attrs.id == choosedText) {
                    textItem.setAttr('fontStyle', 'italic');
                }
            });
        } else {
            sample_layer.find('Text').forEach(function (textItem) {
                if (textItem.attrs.id == choosedText) {
                    textItem.setAttr('fontStyle', 'bold');
                }
            });
        }
        sample_layer.draw();
        italic_bold();
    });
    bold.on('click', function () {
        $(this).toggleClass('active');
        var choosedText = dragLayer.findOne('.dragerresizer').getAttr('id');
        if ($(this).hasClass('active')) {
            sample_layer.find('Text').forEach(function (textItem) {
                if (textItem.attrs.id == choosedText) {
                    textItem.setAttr('fontStyle', 'bold');
                }
            });
        } else {
            sample_layer.find('Text').forEach(function (textItem) {
                if (textItem.attrs.id == choosedText) {
                    textItem.setAttr('fontStyle', 'italic');
                }
            });
        }
        sample_layer.draw();
        italic_bold();
    });


});

/*
 * button ".active_delete" onclick delete image in Konva
 */
$('.passive_navigator').mouseover(function () {

    $(this).find('.active_delete').on('click', function () {
        $(this).parent().remove();
        var arrayOfImagesAndTexts = sample_layer.children;

        for (i = 0; i < arrayOfImagesAndTexts.length; i++) {
            if ($(this).parent().attr('data-id') == arrayOfImagesAndTexts[i].attrs.id) {
                arrayOfImagesAndTexts[i].remove();
                sample_layer.draw();
                if (dragLayer.findOne('.dragerresizer')) {
                    dragLayer.findOne('.dragerresizer').remove();
                    dragLayer.draw();
                }
            }
        }
        navigator_collection.forEach(function (number) {
            if ($(this).parent().attr('data-id') == number.attributes.id) {
                navigator_collection.remove(number);
            }
        });
    });
});


/*
 * changes text style in Konva
 * @returns {undefined}
 */
function fontSelect() {
    var $val = $('.active_font').find('option:selected').val();

    var choosedText = dragLayer.findOne('.dragerresizer').getAttr('id');
    sample_layer.find('Text').forEach(function (textItem) {

        if (textItem.attrs.id == choosedText) {
            textItem.setAttr('fontFamily', $val);
        }
    });
    sample_layer.draw();
}

/*
 * changes text size in Konva
 * @returns {undefined}
 */
function fontSizeSelect() {

    var $val = $('.active_fontSize option:selected').val();
    $val = parseInt($val);
    if ($val >= 10 && $val <= 34) {
        var choosedText = dragLayer.findOne('.dragerresizer').getAttr('id');
        sample_layer.find('Text').forEach(function (textItem) {

            if (textItem.attrs.id == choosedText) {
                textItem.setAttr('fontSize', $val);
            }
        });
        sample_layer.draw();
    }
}
/*
 * hide .passive_base
 */
$('#close').on('click', function () {
    $('.passive_base').hide();
});

/**
 * 
 * @type Number
 * buttons ".active_scale_plus" and ".active_scale_minus" change .base_layer size 
 */
var current_width = objStage.width;
var current_height = objStage.height;
var current = 1;
var offsetX = 0;
var offsetY = 0;
$('.active_minus').on('click', function(){
    
    current = current-0.1;
    offsetX = offsetX - 20;
    //offsetY = offsetY - 5;
    if(current<= 0.5){
        offsetX = -100;
        current = 0.5;
    }
    base_layer.scaleX(current).scaleY(current).offsetX(offsetX).offsetY(offsetY);//.setAttr('draggable', true);
    base_layer.draw();
    
});
$('.active_plus').on('click', function(){
    
    current = current+0.1;
    offsetX = offsetX + 20;
    if(current>= 1.5){
        offsetX = 100;
        current = 1.5;
    }
    //offsetY = offsetY + 5;
    base_layer.scaleX(current).scaleY(current).offsetX(offsetX).offsetY(offsetY);//.setAttr('draggable', true);
    base_layer.draw();
    
});



   