/**
 * Created by neilrafferty on 06/12/2016.
 */
$(document).ready(function()
{
    /*
        Getting News information and using it to populate the site.
     */
    var xmlStr = "<News></News>";
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlStr, "text/xml");//Creating xml object to hold ajax results.

    // Send ajax request for each rss feed and on sucess populate relevant section.
    requestFeed('news');// The home section is done first for a better user experience.
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

    // This method takes an item from the feed and constructs a node for xml object.
    function createItem(feedItem, channelTitle){
        var item = xmlDoc.createElement("Item");
        var title = xmlDoc.createElement("Title");
        var imgSrc = xmlDoc.createElement("Image_Source");
        var desc = xmlDoc.createElement("Description");
        var channel = xmlDoc.createElement("Channel");
        var link = xmlDoc.createElement("Link");
        var pubDate = xmlDoc.createElement("Publish_Date");
        var views = xmlDoc.createElement("Views");

        title.append(feedItem.find("title").text());
        imgSrc.append(feedItem.find('thumbnail').attr('url'));
        desc.append(feedItem.find("description").text());
        channel.append(channelTitle);
        link.append(feedItem.find("link").text());
        pubDate.append(feedItem.find("pubDate").text());
        views.append("0");

        item.appendChild(title);
        item.appendChild(imgSrc);
        item.appendChild(desc);
        item.append(channel);
        item.appendChild(link);
        item.appendChild(pubDate);
        item.appendChild(views);

        return item;
    }

    // Takes the ajax news feed result, passes it into the xml object and the updates the website to show the information.
    function updateXmlDoc(feed){
        var channelTitle = $(feed).find("channel").eq(0).find("title").eq(0).text();
        for (var i = 0; i < $(feed).find("item").length ; i++) {
            xmlDoc.getElementsByTagName("News")[0].appendChild(createItem($(feed).find("item").eq(i), channelTitle));
        }
        updateFeed(getFeedName(feed.getElementsByTagName('description')[0].textContent), xmlDoc);
    }

    // This returns the index of a news item within the xml object given its link.
    function getIndexFromLink(link) {
        var items = $(xmlDoc).find('Item');
        for (var i = 0; i < items.length; i++){
            if (items[i].getElementsByTagName('Link')[0].innerHTML.indexOf(link) > -1) return i;
        }
        return -1;
    }

    // Updates the sections with the relative feed items.
    function updateFeed(feedName) {
        var feedId = '#' + feedName + '-feed';
        var items = xmlDoc.getElementsByTagName('Item');
        $(feedId).append('<div class="panel-group">');
        // Looping through feed items and adding them to the html.
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
        // Matching panel heights.
        $('.'+feedName).matchHeight(false);
        // Adding event to toggle modal, count views and update the most popular section.
        $('.'+feedName).click(function(){
            itemIndex = getIndexFromLink($(this).attr('value')); // Getting index of the selected item in the xml object.
            xmlDoc.getElementsByTagName("Item")[itemIndex].getElementsByTagName('Views')[0].innerHTML++; // Incrementing number of views.
            populateModal(itemIndex);
            $('.modal').modal('toggle');
            updateMostPopularSection();
        });
    }

    // Updating the most popular section with viewed items.
    function updateMostPopularSection() {
        var items = $(xmlDoc).find('Item');
        $('#most-popular-feed').empty(); // clearing setion to prevent duplicates
        $('#most-popular-feed').append('<div class="panel-group">');
        // Looping through feed items and adding them to the html it they have been viewed.
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
                    '<div class="panel-body"><label>Views:</label><span> ' + items[i].getElementsByTagName('Views')[0].innerHTML + '</span></div>' +
                    '</div></div></div>');
            }
        }
        $('#most-popular-feed').append('<div class="panel-group">');
        // Matching panel heights.
        $('#most-popular-feed .panel').matchHeight(false);
        // Adding event to toggle modal, count views and update the most popular section.
        $('#most-popular-feed .panel').click(function(){
            itemIndex = getIndexFromLink($(this).attr('value'));
            xmlDoc.getElementsByTagName("Item")[itemIndex].getElementsByTagName('Views')[0].innerHTML++;
            populateModal(itemIndex);
            $('.modal').modal('toggle');
            updateMostPopularSection();
        });
    }

    // This method populates the modal with data from the xml object at the index provided.
    function populateModal(index) {
        var item = $(xmlDoc).find('Item').eq(index); // Retrieving Item
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

    // This method generates the feed name from the chanel name (e.g. 'BBC News - Home' -> 'home')
    function getFeedName(channel) {
        var words = channel.substring(11).split(" ");
        if (words.length == 2) {
            return words[1].toLowerCase();
        } else {
            return words[0].toLowerCase();
        }
    }

    /*
        Navigation bar functionality.
     */

    // Navigation button function.
    $('.nav.navbar-nav li').click(function(){
        // Setting the new button to selected.
        $('.nav.navbar-nav li').removeClass('active');
        $(this).toggleClass('active');
        // displaying the relative feed.
        $('.feed').hide();
        $(('#' + $(this).find('a')[0].innerHTML.toLowerCase() + '-feed').replace(/\s+/g, '-')).show()
    });

    // Adding functionallity to the brand link in the nav bar.
    $('.navbar-brand').click(function(){
        // Selecting the home button.
        $('.nav.navbar-nav li').removeClass('active');
        $('.nav.navbar-nav li').first().addClass('active');
        // Displaying the home section
        $('.feed').hide();
        $('#home-feed').show();
    });

    // Adding search functionality to trigger on input change in the search bar.
    $('#search-box').bind('input', function() {
        // Showing the search section.
        $('.feed').hide();
        $('.nav.navbar-nav li').removeClass('active');
        $('#search-feed').empty();
        $('#search-feed').show();
        // Retrieving the input from the search box.
        var inputText = $(this).val();
        // Retrieving all news items.
        var items = $(xmlDoc).find('Item');
        //creating new XML object for the results.
        var result = parser.parseFromString(xmlStr, "text/xml");
        // If the input is empty display all news items.
        if (inputText.length = 0){
            result = xmlDoc;
        }else {
            // Loop through items and if any of the xml elements text contents contains the search string add them to the results.
            for (var i = 0; i < items.length; i ++){
                if (items[i].textContent.toLowerCase().includes(inputText.toLowerCase())){
                    var item = result.createElement("Item");
                    item.innerHTML = items[i].innerHTML;
                    result.getElementsByTagName("News")[0].appendChild(item);
                }
            }
        }
        var resultItems = $(result).find('Item');
        $('#search-feed').append('<div class="panel-group">');
        // This function checks if the news item is already in the search results (this is needed due to the same item being in multiple channels).
        function hasBeenUsed(resultItems, index) {
            for (var i = 0; i < index; i++){
                if (resultItems[i].getElementsByTagName('Link')[0].innerHTML === resultItems[index].getElementsByTagName('Link')[0].innerHTML){
                    return true;
                }
            }
            return false;
        }

        // Looping through the results and adding them to the search section.
        for (var i = 0; i < resultItems.length; i++){
            if (!hasBeenUsed(resultItems, i)) {
                var title = resultItems[i].getElementsByTagName('Title')[0].innerHTML;
                var description = resultItems[i].getElementsByTagName('Description')[0].innerHTML;
                var imageSrc = resultItems[i].getElementsByTagName('Image_Source')[0].innerHTML;
                var link = resultItems[i].getElementsByTagName('Link')[0].innerHTML;
                var image;
                if (imageSrc === "undefined") {
                    image = '';
                } else {
                    image = '<img id="news-image" src="' + imageSrc + '" alt="" class="img"/>';
                }
                $('#search-feed').append('<div class="col-sm-6 col-md-3 col-lg-2 ">' +
                    '<div class="panel panel-default most-popular" value="' + link + '">' +
                    '<div class="panel-heading">' + title + '</div>' +
                    image +
                    '<div class="panel-body">' + description + '</div>' +
                    '</div></div>');
            }
        }
        // Adding default text if no items are found.
        if (resultItems.length === 0){
            $('#search-feed').append("<h2>No search result found for '" + inputText + "' :(</h2>");
        }

        // Adding modal functionallity to panel click.
        $('#search-feed').append('<div class="panel-group">');
        $('#search-feed .panel').matchHeight(false); // Matching height of panels.
        // Adding event to toggle modal, count views and update the most popular section.
        $('#search-feed .panel').click(function(){
            itemIndex = getIndexFromLink($(this).attr('value'));
            xmlDoc.getElementsByTagName("Item")[itemIndex].getElementsByTagName('Views')[0].innerHTML++;
            populateModal(itemIndex);
            $('.modal').modal('toggle');
            updateMostPopularSection();
        });
    });
});
