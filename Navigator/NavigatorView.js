
/*
 * @author Anastasia Popova
 */

/*
 * View : {navigator's objects}
 * View for navigator, create template for li in navigator 
 */
var NavigatorView = Backbone.View.extend({
    tagName: "li",
    template: _.template($('#navigator').html()),
    initialize: function () {
        this.render();
    },
    show: function(){
        console.log('Покажем задачу с id ' + id);
    },
    render: function () {
        
        /*
         * .passive_navigator li is sortable 
         * create new reset collection and then copy it ilements to navigator_collection
         * sample_layer.children sort(in Konva)
         */
        var massiv = new NavigatorCollection();
        var helpArray = [];
        $(function () {
            $('.passive_navigator ul').sortable({
                containment: '.passive_navigator',
                cursor: 'move',
                cancel: 'li[data-id="main"]'
            });
            $('.passive_navigator ul').disableSelection();
            $('.passive_navigator ul').sortable({
                stop: function () {
                    //reset the collection
                    massiv.reset();

                    $('.passive_navigator li').each(function (i, item) {

                        number = $(item).attr('data-id');

                        navigator_collection.forEach(function (letter) {

                            if (letter.get('id') == number) {
                                massiv.unshift(letter);
                            }
                        });
                        //sample_layer.children sort
                        sample_layer.children.forEach(function (layerItem) {

                            if (layerItem.attrs.id == number) {
                                helpArray.unshift(layerItem);
                                layerItem.remove();
                            }
                        });
                    });

                    for (i = 0; i < helpArray.length; i++) {
                        sample_layer.add(helpArray[i]);
                    }
                    sample_layer.draw();

                    navigator_collection.reset();
                    navigator_collection = massiv.clone();
                    saveNavigatorToJSON();


                }
            });
        });
        this.$el.html(this.template(this.model.toJSON()));

    },
    events: {
        
        'click': 'addDragerresizer',
        'click ': 'highlight'
    },
    highlight: function () {
        //highlight choosed <li> in .passive_navigator 
        $('.passive_navigator li').css('background', 'inherit');
            this.$el.css('background', '#fff');
            //if we click on <li[data-id="main"> it does not hightlight's
            $('.passive_navigator li[data-id="main"]').css('background', 'inherit');
    },
    /*
     * Make draggable nodes with navigator
     * each <li "data-id"=[number]> in .passive_navigator is associated with object in Konva
     */
    addDragerresizer: function () {
        var number = this.$el.attr('data-id');
        navigator_collection.forEach(function (item) {
            if (number == item.attributes.id) {

                //choose all texts and images in Konva
                var arrayOfImagesAndTexts = sample_layer.children;

                arrayOfImagesAndTexts.forEach(function (image) {
                    if (image.attrs.id == item.attributes.id) {
                        if (dragLayer.findOne('.dragerresizer')) {
                            dragLayer.findOne('.dragerresizer').remove();
                        }
                        //make dragerresizer resize it's width and height the same as object 
                        dragers[1].height = image.attrs.height;
                        dragers[1].width = image.attrs.width;

                        addDraggerResizer(dragers[1]);
                        dragLayer.findOne('.dragerresizer').setAttr('id', item.attributes.id);
                        image.setAttr('offsetX', (image.attrs.width) / 2).setAttr('offsetY', (image.attrs.height) / 2);

                        //JSON.parse
                        saveStageToHistory();
                        var objRotate = JSON.parse(json);

                        //Obj show which obj in Konva we need
                        var Obj = objRotate.children[1].children[image.index];
                        var rotation = Obj.attrs.rotation;
                        // save coordinates x y of draderresizer
                        var objX = Obj.attrs.x;
                        var objY = Obj.attrs.y;

                        dragLayer.findOne('.dragerresizer')
                                .setAttr('offsetX', (image.attrs.width) / 2)
                                .setAttr('offsetY', (image.attrs.height) / 2)
                                .setAttr('rotation', rotation)
                                .setAttr('x', objX)
                                .setAttr('y', objY);

                        //make buttons "italic" and "bold"  active/not active
                        $('#italic').removeClass('active');
                        $('#bold').removeClass('active');
                        if (image.attrs.fontStyle === 'italic') {
                            $('#italic').toggleClass('active');
                        }
                        if (image.attrs.fontStyle === 'bold') {
                            $('#bold').toggleClass('active');
                        }
                        if (image.attrs.fontStyle === 'italic bold') {
                            $('#italic').toggleClass('active');
                            $('#bold').toggleClass('active');
                        }

                        dragLayer.draw();
                        sample_layer.draw();
                    }
                });
                //input on "focus" change text.value to obj.attrs.text
                arrayOfImagesAndTexts.forEach(function (text) {
                    if (text.attrs.id == item.attributes.id) {
                        if (text.attrs.type === ("textForm")) {
                            $('textarea').on('focus', function () {
                                this.value = text.attrs.text;
                            });
                            $('textarea').focus();
                            $('textarea').select();
                        }
                    }
                });
            }
        });
    }

});



