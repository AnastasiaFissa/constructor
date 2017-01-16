/*
 * @author Anastasia Popova
 */

/*
 * View: {main image}
 * View for the array of main images
 */
var MainView = Backbone.View.extend({
   
    initialize: function () {
        this.render();
    },
    render: function () {

        //Creates massive of images in .passive_base
        mainsCollection.each(function(main, index){
           var img = $('<img/>');
           img.attr('src', main.get('src'));
           img.appendTo('.passive_base');
        });
        
    }
});


