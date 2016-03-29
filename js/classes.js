var appClasses = (function($) {

    // cache dom
    var $body = $(document).find('body'),
        $container = $('<div class="container"/>'),
        $row = $('<div class="row"/>'),
        $section = $('<section/>');



    $container.append($row);
    $row.append($section);
    //$section.append($article);

    $container.prependTo($body);


    var Base = {
        extend: function(properties) {
            // create a new object with this object as its prototype
            var obj = Object.create(this);
            // add properties to the new object
            Object.assign(obj, properties);
            return obj;
        }
    };

    var classMemory = {};

    classMemory.BaseWP = Base.extend({
        render: function() {},
    });

    classMemory.Post        = classMemory.BaseWP.extend({
        render: function() {
            var $title = $('<h2/>'),
                $article = $('<article/>');
                $section.html($article.append([$title.append(this.title.rendered), this.content.rendered]));
        },
        teaser: function() {
            var $title = $('<h2/>'),
                $link = $('<a class="link" data-id="' + this.id + '" data-type="' + this.type + '"></a>'),
                $article = $('<article/>');
                $section.append($article.append([$title.append($link.append(this.title.rendered)), this.excerpt.rendered]));
//console.log(this);
        }
    });



    classMemory.Page        = classMemory.BaseWP.extend({});



    classMemory.Tag         = classMemory.BaseWP.extend({});



    classMemory.Media       = classMemory.BaseWP.extend({});



    classMemory.User        = classMemory.BaseWP.extend({});



    classMemory.Category    = classMemory.BaseWP.extend({});



    classMemory.Static    = classMemory.BaseWP.extend({
        render: function(url) {
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'html',
            })
            .done(function(data) {
                $('section').html(data);
            })
            .fail(function() {
                console.log("error");
            });
        },
        getTitle: function() {
            var urls = this.static_urls;

            urls.forEach(function(url) {
                var urlArr = url.split(/[ .:;?!~,\[\]\r\n/\\]+/),
                    title = urlArr.slice(3, 4),

                $title = $('<h2/>'),
                $link = $('<a class="html" data-href="' + url + '"></a>'),
                $article = $('<article/>');
                $section.append($article.append($title.append($link.append(title))));

            });
        }
    });

    return {
        classMemory: classMemory
    }
})(jQuery);
