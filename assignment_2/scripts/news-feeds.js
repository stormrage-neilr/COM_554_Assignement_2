/**
 * Created by neilrafferty on 06/12/2016.
 */
$(document).ready(function()
{
    var xmlStr = "<News></News>";
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlStr, "text/xml");

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
            success: updateXmlDoc
        });
    }

    function indexWithLink(text) {
        var items = $(xmlDoc).find('Item');
        for (var i = 0; i < $(xmlDoc).find('Item').length; i++){
            if (items[0].getElementsByTagName('Link')[0].innerHTML.indexOf(text) > -1) return i;
        }
        return -1;
    }

    function updateXmlDoc(feed){
        var channelTitle = $(feed).find("channel").eq(0).find("title").eq(0).text();
        for (var i = 0; i < $(feed).find("item").length || i < 52; i++) {
            var item = xmlDoc.createElement("Item");
            var title = xmlDoc.createElement("Title");
            var imgSrc = xmlDoc.createElement("Image_Source");
            var desc = xmlDoc.createElement("Description");
            var channels = xmlDoc.createElement("Channels");
            var channel = xmlDoc.createElement("Channel");
            var link = xmlDoc.createElement("Link");
            var pubDate = xmlDoc.createElement("Publish_Date");
            var views = xmlDoc.createElement("Views");

            title.append($(feed).find("item").eq(i).find("title").text());
            imgSrc.append($(feed).find("item").eq(i).find('thumbnail').attr('url'));
            desc.append($(feed).find("item").eq(i).find("description").text());
            channel.append(channelTitle);
            link.append($(feed).find("item").eq(i).find("link").text());
            pubDate.append($(feed).find("item").eq(i).find("pubDate").text());
            views.append("0");

            item.appendChild(title);
            item.appendChild(imgSrc);
            item.appendChild(desc);
            channels.append(channel);
            item.appendChild(channels);
            item.appendChild(link);
            item.appendChild(pubDate);
            item.appendChild(views);

            xmlDoc.getElementsByTagName("News")[0].appendChild(item);
        }
        updateFeed(getFeedName(feed.getElementsByTagName('description')[0].textContent), xmlDoc);
    }

    function getIndexFromLink(link) {
        var items = $(xmlDoc).find('Item');
        for (var i = 0; i < items.length; i++){
            if (items[i].getElementsByTagName('Link')[0].innerHTML.indexOf(link) > -1) return i;
        }
        return -1;
    }

    function updateFeed(feedName) {
        var feedId = '#' + feedName + '-feed';
        var items = xmlDoc.getElementsByTagName('Item');
        $(feedId).append('<div class="panel-group">');
        for (var i = 0; i < items.length; i++) {
            if(feedName === getFeedName(items[i].getElementsByTagName('Channel')[0].innerHTML)) {
                var title = items[i].getElementsByTagName('Title')[0].innerHTML;
                var description = items[i].getElementsByTagName('Description')[0].innerHTML;
                var imageSrc = items[i].getElementsByTagName('Image_Source')[0].innerHTML;
                var link = items[i].getElementsByTagName('Link')[0].innerHTML;
                var image;
                if (imageSrc === "undefined") {
                    image = '';
                } else {
                    image = '<img id="news-image"src="' + imageSrc + '" alt="" class="img"/>';
                }

                $(feedId).append('<div class="col-sm-6 col-md-3 col-lg-2 ">' +
                    '<div class="panel panel-default ' + feedName + '" value="' + link + '">' +
                    '<div class="panel-heading">' + title + '</div>' +
                    image +
                    '<div class="panel-body">' + description + '</div>' +
                    '</div></div></div>');
            }
        }
        $(feedId).append('<div class="panel-group">');
        $('.'+feedName).matchHeight(false);
        $('.'+feedName).click(function(){
            itemIndex = getIndexFromLink($(this).attr('value'));
            xmlDoc.getElementsByTagName("Item")[itemIndex].getElementsByTagName('Views')[0].innerHTML++;
            populateModal(itemIndex);
            $('.modal').modal('toggle');
            updateMostPopularSection();
        });
    }

    function updateMostPopularSection() {
        var items = $(xmlDoc).find('Item');
        $('#most-popular-feed').empty();
        $('#most-popular-feed').append('<div class="panel-group">');
        for (var i = 0; i < items.length; i++){
            if (items[i].getElementsByTagName('Views')[0].innerHTML > 0) {
                var title = items[i].getElementsByTagName('Title')[0].innerHTML;
                var description = items[i].getElementsByTagName('Description')[0].innerHTML;
                var imageSrc = items[i].getElementsByTagName('Image_Source')[0].innerHTML;
                var link = items[i].getElementsByTagName('Link')[0].innerHTML;
                var image;
                if (imageSrc === "undefined") {
                    image = '';
                } else {
                    image = '<img id="news-image"src="' + imageSrc + '" alt="" class="img"/>';
                }
                $('#most-popular-feed').append('<div class="col-sm-6 col-md-3 col-lg-2 ">' +
                    '<div class="panel panel-default most-popular" value="' + link + '">' +
                    '<div class="panel-heading">' + title + '</div>' +
                    image +
                    '<div class="panel-body">' + description + '</div>' +
                    '</div></div></div>');
            }
        }
        $('#most-popular-feed').append('<div class="panel-group">');
        $('.most-popular').matchHeight(false);
        $('.most-popular').click(function(){
            itemIndex = getIndexFromLink($(this).attr('value'));
            xmlDoc.getElementsByTagName("Item")[itemIndex].getElementsByTagName('Views')[0].innerHTML++;
            populateModal(itemIndex);
            $('.modal').modal('toggle');
            updateMostPopularSection();
        });
    }

    function populateModal(index) {
        var item = $(xmlDoc).find('Item').eq(index);
        var imageSrc = item.find('Image_Source').text();
        $('#modal-title').html(item.find('Title').text());
        $('#modal-description').html(item.find('Description').text());
        $('#modal-views').html(' ' + item.find('Views').text());
        $('#modal-pubDate').html(' ' + item.find('Publish_Date').text());
        $('#modal-channel').html(' ' + item.find('Channel')[0].innerHTML);
        if (imageSrc === "undefined") {
            image = '';
        } else {
            image = '<img id="news-image"src="' + imageSrc + '" alt="" class="img"/>';
        }
        $('#modal-picture').attr('src', imageSrc)
    }

    function getFeedName(channel){
        var words = channel.substring(11).split(" ");
        if (words.length == 2){
            return words[1].toLowerCase();
        }else {
            return words[0].toLowerCase();
        }
    }
});
