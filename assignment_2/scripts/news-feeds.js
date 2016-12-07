/**
 * Created by neilrafferty on 06/12/2016.
 */
$(document).ready(function()
{
    requestFeed('news');
    requestFeed('entertainment');
    requestFeed('politics');
    requestFeed('science');
    requestFeed('technology');
    requestFeed('world');

    function requestFeed(feedName){
        $.ajax({
            type: "GET",
            url: "feeds/rss_proxy_bbc_" + feedName + ".php",
            dataType: "xml",
            cache: false,
            success: updateFeed
        });
    }

    function updateFeed(feed) {
        var feedName = getFeedName(feed);
        var feedId = '#' + feedName + '-feed';
        $(feedId).append('<div class="panel-group">');
        for (var i = 0; i < $(feed).find("item").length; i++) {
            var title = $(feed).find("item").eq(i).find("title").text();
            var description = $(feed).find("item").eq(i).find("description").text();
            var imageSrc = $(feed).find("item").eq(i).find('thumbnail').attr('url');
            var image;
            if (imageSrc === undefined) {
                image = '';
            }else {
                image = '<img id="news-image"src="' + imageSrc + '" alt="" class="img"/>';
            }

            $(feedId).append('<div class="col-sm-6 col-md-3 col-lg-2 ">' +
                '<div class="panel panel-default ' + feedName + '">' +
                '<div class="panel-heading">' + title + '</div>' +
                image +
                '<div class="panel-body">' + description + '</div>' +
                '</div></div></div>');
        }
        $(feedId).append('<div class="panel-group">');
        $('.'+feedName).matchHeight(false);
    }

    function getFeedName(feed){
        var words = feed.getElementsByTagName('description')[0].textContent.substring(11).split(" ");
        if (words.length == 2){
            return words[1].toLowerCase();
        }else {
            return words[0].toLowerCase();
        }
    }
});

$(window).on("load", function(){
    $('.panel').matchHeight(false);
});