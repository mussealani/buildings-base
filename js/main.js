(function($) {
var $body = $('body');

    /**
     * API Documentation:
     * http://v2.wp-api.org/reference/
     *
     * API URLs:
     */
    var baseHref = $('head .baseUrl').attr('href'),
        themeHref = $('head .themeUrl').attr('href'),
        uploadsUrl = $('head .uploadsUrl').attr('href'),
        // api available after saving permalinks settings
        apiBase = baseHref + 'wp-json/wp/v2/';
    // the add-on menu plugin has a different base
    //menuApiBase = baseHref + 'wp-json/wp-api-menus/v2/';

    // create object to hold our RESTapi routes
    var resources = [{
        route: apiBase + "users",
        className: "User",
        type: 'user',
        list: "users"
    }, {
        route: apiBase + "posts",
        className: "Post",
        type: 'post',
        list: "posts"
    }, {
        route: apiBase + "tags",
        className: "Tag",
        type: 'tag',
        list: "tags"
    }, {
        route: apiBase + "categories",
        className: "Category",
        type: 'category',
        list: "categories"
    }, {
        route: themeHref + 'json/static-pages.json',
        className: "Static",
        type: "html",
        list: "htmls"
    }];


        // REST-object
    var memory = {},
        countLoadedResources = 0;



    resources.forEach(function(resource) {
        var url = resource.route;
        $.getJSON(url, function(data) {
            memory[resource.list] = data;
            countLoadedResources++;
            if (countLoadedResources == resources.length) {
                classify();
                buildCatMenu();
                getTermObj();
                getPostTeaser();
                getStaticHtmlPages();
            }
        })
    });


    function classify() {
        for (listName in memory) {
            var list = memory[listName];
            var className = resourcesByList[listName].className;

            var classObj = appClasses.classMemory[className];


            // A map loop through the array of objects
            // and replace with "classified" objects
            // (i.e. objects that have a certain prototype)
            // Replace the old list with the new one in the
            // memory variable
            if (list.push) { // array, classify each item
                memory[listName] = list.map(function(listItem) {

                    return classObj.extend(listItem);
                });
            } else { // object, classify it
                memory[listName] = classObj.extend(list);
            }
            //console.log('memory.' + listName, memory[listName]);
        }
    };

    function buildCatMenu() {
        var categories = memory.categories;
        for (var i = 0; i < categories.length; i++) {
            $dropDownLink = $('<a href="#" class="dropdown-toggle" data-toggle="dropdown" data-id="' + categories[i].id + '">' + categories[i].name + '</a>');

            $dropDownList = $('<li class="dropdown dropdown-submenu" data-id="' + categories[i].id + '"/>');
            $dropDownMenu = $('<ul class="dropdown-menu" data-id="' + categories[i].id + '"/>');
            if (categories[i].parent == 0) {
                $('.buildings').prepend($dropDownList.append([$dropDownLink, $dropDownMenu]));
            } else {
                var parentId = categories[i].parent;
                //console.log(categories[i].parent);
                $parent = $body.find('.dropdown-menu[data-id="' + parentId + '"]');
                if ($parent.length) {
                    //console.log($parent);
                    $body.find('.dropdown-menu[data-id="' + parentId + '"]').append($dropDownList.append([$dropDownLink, $dropDownMenu]));


                }else {
                    var $parent = $dropDownList.closest($dropDownMenu).attr('data-id', categories[i].parent).html('<h1>This is submenu</h1>');
                    console.log(this);


                    console.log($dropDownList.attr('data-id', categories[i].parent));
                    console.log(categories[i].parent);
                }
            }
        }
    };

    function getTermObj() {
        var posts = memory.posts;
        for (var i = 0; i < posts.length; i++) {
            var links = posts[i]._links;
            for (var j in links) {
                if (links[j].length > 1) {
                    links[j].forEach(function(link) {
                        getTags(posts[i].id, links['https://api.w.org/term']);
                    });
                }
            }
            // var url = posts[i]._links['https://api.w.org/term'][i];
            // if (url !== undefined) {

            //     $.getJSON(url.href, function(data) {
            //         // for (var i = 0; i < data.length; i++) {
            //         //     var tagName = data[i].name;

            //         //     console.log(data);
            //         // };
            //     });
            // }
            //console.log(posts[i].tags);

        }
    };



    function getTags(id, terms) {
        for (var i = 0; i < terms.length; i++) {

            var url = terms[i].href;
            $.getJSON(url, function(data) {
                //console.log(id, data);
            });
        //console.log(terms[i].href);
        }
    };

    function getPostTeaser() {
        var posts = memory.posts;
        for(var i = 0; i < posts.length; i++) {
            memory.posts[i].teaser();
        }
    }


    var resourceByType = {};
    var resourcesByList = {};
    for (i in resources) {
        resourceByType[resources[i].type] = resources[i];
        resourcesByList[resources[i].list] = resources[i];
    }

function getStaticHtmlPages() {
    memory.htmls.getTitle();
}


    function displayResource(type, id) {

        var url = resourceByType[type].route + '/' + id;
        var className = resourceByType[type].className;
        //console.log(className);

        $.getJSON(url, function(data) {
            data = appClasses.classMemory[className].extend(data);
            data.render();

        });
    };


    // click event
    $('body').delegate('.link', 'click', getContent);
    $('body').delegate('.html', 'click', getHtmlPage);



    function getContent(event) {

        var type = $(this).attr('data-type');
        var id = $(this).attr('data-id');
        displayResource(type, id);

    };

    function getHtmlPage(event) {
        var url = $(this).attr('data-href');
            memory.htmls.render(uploadsUrl + url);
        };

})(jQuery);
