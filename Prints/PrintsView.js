
/*
 * @author Anastasia Popova
 */

/*
 * View : {prints images}
 * View for prints images in .passive_prints
 */
var PrintView = Backbone.View.extend({
    
    initialize: function () {
        this.render();
    },
    render: function () {
        // Creates massive of images in .passive_prints
        printscollection.each(function(print, index){
           var img = $('<img/>');
           img.attr('src', print.get('src'));
           img.appendTo('.passive_prints');
        });
    }
});


