
//Mains Obj
var MainModel = Backbone.Model.extend({
});

var mainsObj1 = ({
    src: 'images/base.png'
});

var MainsCollection = Backbone.Collection.extend({
    model: MainModel,
});

var MainsCollection = new MainsCollection([mainsObj1]);
//console.log(MainsCollection);

var MainView = Backbone.View.extend({
    tagName: 'img',
    id: mainsObj1.id,
    initialize: function () {
        this.render();
    },
    render: function () {

        this.el.src = mainsObj1.src;

        //Creates massive of images in .passive_base
        $('.passive_base').append(this.$el);
        $('.passive_base img').on('click', function () {
            addImage(mainsObj[0], base_layer);
        });

    }
});

var MainView = new MainView({collection: MainsCollection});


//Prints Obj
var PrintModel = Backbone.Model.extend({
});
var PrintsCollection = Backbone.Collection.extend({
    model: PrintModel
});
var printsObj1 = ({
    src: 'images/4.jpg',
});
var printsObj2 = ({
    src: 'images/5.jpg',
});

var PrintsCollection = new PrintsCollection([printsObj1, printsObj2]);
//console.log(PrintsCollection);

var PrintView = Backbone.View.extend({
    initialize: function () {
        this.render();
    },
    render: function () {
        // Creates massive of images in .passive_prints
        for (i = 0; i < PrintsCollection.length; i++) {
            var print = $('<img/>');
            print.attr('data-id', i);

            print.attr('src', printsObj[i].src);
            print.appendTo('.passive_prints');
        }
        var counter = -1;

        //on click prints add to Konva
        $('.passive_prints img').on('click', function () {
            i = $(this).attr('data-id');
            var prints = printsObj[i];
            addImage(prints, sample_layer);


            // counter show in what order image is coming
            counter++;
            var number = counter;

            //add <li> to .passive_navigator
            var nav_i = document.createElement('li');
            nav_i.setAttribute('data-id', number);
            nav_i.innerHTML = 'Image' + number;
            $('.passive_navigator ul').find('li:first').before(nav_i);

            //add dragerresizer with his own settings to Konva
            $('.passive_navigator li').on('click', function () {
              
                if (nav_i.getAttribute('data-id') === $(this).attr('data-id')) {
                    if (dragLayer.findOne('.dragerresizer')) {
                        dragLayer.findOne('.dragerresizer').remove();
                    }
                    addDraggerResizer(dragers[1]);

                    //arrey of images on Konva
                    var arr = sample_layer.find('Image');
                    //if we have two or more equal images on Stage their id not equal
                    for (i = 0; i < arr.length; i++) {
                        var count = 0;
                        for (k = 0; k < arr.length; k++) {
                            if (arr[i].attrs.id === arr[k].attrs.id) {
                                count++;
                            }
                            if (count >= 0) {
                                arr[k].attrs.id = k;
                                arr[k].attrs.name = ('Image' + k);
                                //get offset x,y for the equel image
                                arr[arr[number].getAttr('id')].setAttr('offsetX', '50').setAttr('offsetY', '50');

                            }
                        }
                    }

                    //choose clicked dragerresizer
                    dragLayer.findOne('.dragerresizer').setAttr('id', arr[number].getAttr('id'));
                    sample_layer.find('.Image' + (arr[number].getAttr('id'))).setAttr('offsetX', '50').setAttr('offsetY', '50');

                    saveStageToHistory();
                    // save rotation of dragerresizer  
                    var objRotate = JSON.parse(json);

                    var Obj = objRotate.children[1].children[number];
                    var rotation = Obj.attrs.rotation;

                    // save coordinates x y of draderresizer
                    var objX = Obj.attrs.x;
                    var objY = Obj.attrs.y;
                    dragLayer.findOne('.dragerresizer').setAttr('offsetX', '50')
                            .setAttr('offsetY', '50')
                            .setAttr('rotation', rotation)
                            .setAttr('x', objX)
                            .setAttr('y', objY);
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

                if ((node.attrs.name === ("Image1") || (node.attrs.name === ("Image" + number)))) {
                    if (dragLayer.findOne('.dragerresizer')) {
                        dragLayer.findOne('.dragerresizer').remove();
                    }
                    addDraggerResizer(dragers[1]);
                    
                    //if we have two or more equal images on Stage their id not equal
                    var imgId = sample_layer.find('Image');
                    for (i = 0; i < imgId.length; i++) {
                        var count = 0;
                        for (k = 0; k < imgId.length; k++) {
                            if (imgId[i].attrs.id === imgId[k].attrs.id) {
                                count++;
                            }
                            if (count >= 0) {
                                imgId[k].attrs.id = k;
                                imgId[k].attrs.name = ('Image' + k);

                            }
                        }
                    }
                    dragLayer.findOne('.dragerresizer').setAttr('id', node.attrs.id);
                    node.setAttr('offsetX', '50').setAttr('offsetY', '50');
                    //JSON.parse
                    saveStageToHistory();
                    var objRotate = JSON.parse(json);
                    //get node index === number
                    var Obj = objRotate.children[1].children[node.index];
                    var rotation = Obj.attrs.rotation;

                    // save coordinates x y of draderresizer
                    var objX = Obj.attrs.x;
                    var objY = Obj.attrs.y;
                    dragLayer.findOne('.dragerresizer').setAttr('offsetX', '50')
                            .setAttr('offsetY', '50')
                            .setAttr('rotation', rotation)
                            .setAttr('x', objX)
                            .setAttr('y', objY);
                    dragLayer.draw();
                    sample_layer.draw();
                    //click image on Konva highlights the same li in Konva
                    $('.passive_navigator li').css('background', 'inherit');
                    $('.passive_navigator li').each(function (i, elem) {
                        var data = node.index;
                        if ($(elem).attr('data-id') == data) {
                            $(elem).css('background', '#fff');
                        }
                    });

                }
            });

        });
       
    }
});

var PrintView = new PrintView({collection: PrintsCollection});

//text
var TextModel = Backbone.Model.extend({
});

var textObj1 = ({
    name: 'text',
    id: ''
});
var GeneralNavigator = Backbone.Model.extend({
});
var Navigator = Backbone.Collection.extend({
});
var NaviView = Backbone.View.extend({
    initialize: function () {
        this.render();
    },
    render: function () {

    }
});

var NaviView = new NaviView();