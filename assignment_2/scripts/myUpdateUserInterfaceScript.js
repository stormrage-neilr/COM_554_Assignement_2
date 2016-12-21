/**
 * Created by neilrafferty on 06/12/2016.
 */
$(document).ready(function()
{
    populateFromUrl();

    $('[data-toggle="tooltip"]').tooltip();

    $('#modal').on('hidden.bs.modal', function () {
        history.pushState(null, null, "news_site.html?" + location.hash.split("+modal=")[0]);
    });

    $('li').click(function () {
        var buttonText = $(this).get(0).getElementsByTagName('a')[0].innerText;
        history.pushState(null, null, "news_site.html?#" + buttonText.toLocaleLowerCase());
        updateFeed(buttonText);
    });

    function updateFeed(feed){
        if (feed.toLowerCase() === 'most popular'){
            updatePanelsFromViews();
            $('#search-box').val('');
        }else if (feed.indexOf('search') === 0){
            var searchValue = feed.split('search=')[1].split('+modal=')[0];
            $('#search-box').val(searchValue);
            updatePanelsFromSearch(searchValue);
        }
        else {
            updatePanelsForFeed(feed.split('+modal=')[0]);
            $('#search-box').val('');
        }
        var listItems = $('li');
        listItems.removeClass('active');
        for (var i = 0; i < listItems.length; i ++) {
            if (listItems.get(i).getElementsByTagName('a')[0].innerText.toLowerCase() === feed.toLowerCase()) {
                $(listItems.get(i)).addClass('active')
            }
        }
    }

    function updatePanelsFromViews(){
        $.ajax({
            type: "GET",
            url: "php/db/get-by-views.php",
            cache: false,
            success: updatePanels,
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    }

    function updatePanelsFromSearch(search){
        $.ajax({
            type: "GET",
            url: "php/db/get-by-search.php",
            data: {search: search},
            cache: false,
            success: updatePanels,
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    }

    function updatePanelsForFeed(feedName){
        $.ajax({
            type: "GET",
            url: "php/db/get-by-type.php",
            data: {feedName: feedName},
            cache: false,
            success: updatePanels,
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    }

    function launchModal(link) {
        emptyModal();
        populateModalDesc(link);
        populateAndToggleModal(link);
    }

    function updatePanels(newsItemsXML) {
        var items = $(newsItemsXML).find('Item');
        $('#news-feed').empty();
        amountOfNewsItems = items.length;
        if (amountOfNewsItems === 0){
            $('#news-feed').append("<h2>No search result found for '" + $('#search-box').val() + "' :(</h2>");
        }else {
            $('#news-feed').append('<div class="panel-group">');
            for (var i = 0; i < amountOfNewsItems; i++) {
                var title = items[i].getElementsByTagName('Title')[0].innerHTML;
                var description = items[i].getElementsByTagName('Description')[0].innerHTML;
                var imageSrc = items[i].getElementsByTagName('Image_Source')[0].innerHTML;
                var link = items[i].getElementsByTagName('News_Link')[0].innerHTML;
                var views = items[i].getElementsByTagName('Views')[0].innerHTML;
                var image = '';
                if (imageSrc !== "undefined") {
                    image = '<img class="news-image"src="' + imageSrc + '" alt="" class="img"/>';
                }
                $('#news-feed').append('<div class="col-sm-6 col-md-3 col-lg-2 ">' +
                    '<div class="panel panel-default " value="' + link + '">' +
                    '<div class="panel-heading"><label class="news-title">' + title + '</label></div>' +
                    image +
                    '<div class="panel-body">' +
                    '<p>' + description + '</p>' +
                    '<label>Views:</label><span> ' + views + '</span></div>' +
                    '</div></div>');
            }
            $('#news-feed').append('</div');
            // Matching panel heights.
            $('.news-image:eq(0)').on('load', function () {
                $('.panel').matchHeight(false);
            });
            // Adding event to toggle modal, count views and update the most popular section.
            $('.panel').click(function () {
                var link = $(this).attr('value');
                history.pushState(null, null, "news_site.html?" + location.hash + "+modal=" + link);
                launchModal(link);
            });
        }
    }

    function populateModalDesc(link) {
        $.ajax({
            type: "GET",
            url: "php/get_news_item_article.php",
            data: {link: link},
            cache: false,
            success: updateModalDesc,
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    }

    function updateModalDesc(linkDoc){
        desc = $(linkDoc).find('.story-body__inner p');
        if (desc.length === 0) {
            desc = $(linkDoc).find('.map-body p');
        }
        if (desc.length === 0) {
            desc = $(linkDoc).find('#story-body p');
        }
        if (desc.length === 0) {
            desc = $(linkDoc).find('.main_article_text p');
        }
        desc.each(function(){
            $('#modal-description').append($(this)[0].outerHTML);
            $('#modal-description').append('<br>');
        });
    }

    // This method populates the modal with data from the selected news article.
    function populateAndToggleModal(link) {
        $.ajax({
            type: "GET",
            url: "php/db/get-by-link.php",
            data: {link: link},
            cache: false,
            success: updateModal,
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    }

    function updateModal(newsItem){
        var item = $(newsItem).find('Item').eq(0); // Retrieving Item
        var imageSrc = item.find('Image_Source').text();
        $('#modal-title').html(item.find('Title').text());
        $('#modal-views').html(' ' + item.find('Views').text());
        $('#modal-pubDate').html(' ' + item.find('Publish_Date').text());
        $('#modal-channel').html(' ' + item.find('Channels')[0].innerHTML);
        $('#modal-link').attr('href', item.find('News_Link')[0].innerHTML);
        if (imageSrc === "undefined") {
            image = '';
        } else {
            image = '<img src="' + imageSrc + '" alt="" class="img"/>';
        }
        $('#modal-picture').attr('src', imageSrc);
        $('.modal').modal('toggle');
    }

    function emptyModal(){
        $('#modal-title').html('');
        $('#modal-description').html('');
        $('#modal-views').html(' ');
        $('#modal-pubDate').html(' ');
        $('#modal-channel').html(' ');
        $('#modal-picture').attr('src', '')
    }

    // Adding search functionality to trigger on input change in the search bar.
    $('#search-box').bind('input', function() {
        // Showing the search section.
        history.pushState(null, null, "news_site.html?#search=" + $(this).val());
        $('.nav.navbar-nav li').removeClass('active');
        updatePanelsFromSearch($(this).val());
    });

    // handeling history
    $(window).on('popstate', function (){
        populateFromUrl();
    })
    function populateFromUrl() {
        var pageRef = location.hash.split('#').pop();
        if (pageRef.split('+modal=')[0] === '') {
            pageRef = 'home';
        }
        updateFeed(pageRef);
        if (pageRef.indexOf('+modal=') !== -1) {
            launchModal(pageRef.split('+modal=')[1]);
        } else {
            $('#modal').modal('hide');
        }
    }
});