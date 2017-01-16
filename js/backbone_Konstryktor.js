
/*
 * @author Anastasia Popova
 */

/*
 * Create collection of mains images in div.libery > .passive_base
 * mainsCollection {image}
 * @type MainsCollection
 */
var mainsCollection = new MainsCollection([
    {src: 'images/base.png', id: '0'}
]);
var MainView = new MainView({collection: mainsCollection});

/*
 * Create collection of print images in div.libery > .passive_prints
 * printscollection {image}
 * @type PrintsCollection
 */
var printscollection = new PrintsCollection([
    {src: 'images/4.jpg', id: '0'},
    {src: 'images/5.jpg', id: '1'}
]);
var PrintView = new PrintView({collection: printscollection});

/*
 * click on .passive_prints or .passive_text buttons add li with {params} to the navigator 
 * create array of <li> {object image} or {object text} in .passive_navigator ul
 * array {view}
 * add each view to the navigator_collection
 * @type NavigatorCollection
 */
var navigator_collection = new NavigatorCollection();
var array = [];
$(document).ready(function () {
    //images
    $('.passive_prints img').on('click', function () {

        var navi = new NavigatorView({
            model: new NavigatorModel({id: array.length, type: 'Image',
                src: $(this).attr('src')})
        });
        //add el to navigator_collection
        navigator_collection.add(new NavigatorModel({id: array.length,
            type: 'Image',
            src: $(this).attr('src')}));
        //add .passive_navigator li to JSON
        saveNavigatorToJSON();
        array[array.length] = navi;
        $('.passive_navigator ul').find('li:first').before(navi.el);
        $('.passive_navigator ul').find('li:first').attr('data-id', array.length - 1);
        addImage(navi.model.attributes, sample_layer);
        
        //create button .active_delete with <li>
         $('.passive_navigator ul').find('li:first').append('<button>delete</button>').find('button').attr('class', 'active_delete');
        
    });

    //texts 
    $('#button_text').on('click', function () {
        if (base_layer.findOne('Image')) {
            var navi = new NavigatorView({
                model: new NavigatorModel({id: array.length,
                    text: 'Ваш текст',
                    lineCap: 'round',
                    lineJoin: 'round',
                    fontSize: 20,
                    fontStyle: 'normal',
                    fontFamily: 'Arial'
                })
            });
            //add el to navigator_collection
            navigator_collection.add(new NavigatorModel({id: array.length,
                text: 'Ваш текст',
                lineCap: 'round',
                lineJoin: 'round',
                fontSize: 20,
                fontStyle: 'normal',
                fontFamily: 'Arial'
            }));
            //add .passive_navigator li to JSON
            saveNavigatorToJSON();
            array[array.length] = navi;
            $('.passive_navigator ul').find('li:first').before(navi.el);
            $('.passive_navigator ul').find('li:first').attr('data-id', array.length - 1);
            addText(navi.model.attributes, sample_layer);
            
            //create button .active_delete with <li>
            $('.passive_navigator ul').find('li:first').append('<button>delete</button>').find('button').attr('class', 'active_delete');
        }
    });

    //add main image(theme) 
    $('.passive_base img').on('click', function () {
        //remove old main theme
        $('.passive_navigator ul li[data-id = "main"]').remove();
        var navi = new NavigatorView({
            model: new NavigatorModel({id: 'main',
                type: 'image',
                x: '0',
                y: '0',
                width: '600',
                height: '253',
                src: $(this).attr('src')
            })
        });

        navigator_collection.add(new NavigatorModel({id: 'main',
            type: 'image',
            x: '0',
            y: '0',
            width: '600',
            height: '253',
            src: $(this).attr('src')
        }));
        $('.passive_navigator ul').append(navi.el);
        $('.passive_navigator ul li').attr('data-id', 'main');
        $('.passive_navigator ul li').attr('class', 'main');
        //add main image(theme)to Konva
        addImage(navi.model.attributes, base_layer);
        
        
    });

});

//
////create router
//var Router = Backbone.Router.extend({
//    routes: {
//        ''                       : 'index',
//        'page/:id/:tra/*simbo'   : 'page',
//        'search/:query'          : 'search',
//        '*other'                 : 'default'
//    },
// 
//    index: function() {
//        console.log('индексный роут');
//        
//    },
// 
//    page: function(id, tra, simbo) {
//        console.log(id+' '+tra+' '+simbo+' роут');
//    
//    },
// 
//    search: function(query) {
//        console.log(query+' роут');
//        
//    },
// 
//    default: function(other) {
//        alert('Хммм...вы уверены, что вы попали туда куда хотели? Вы находитесь на роуте ' + other);
//    }
//});
//
//var router = new Router;
//
//Backbone.history.start();//{pushState: true, root: '/'}

