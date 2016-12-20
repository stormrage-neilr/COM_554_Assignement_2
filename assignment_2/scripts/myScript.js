/**
 * Created by neilrafferty on 06/12/2016.
 */
$(document).ready(function()
{
    updatePanelsForFeed('home');

    $('[data-toggle="tooltip"]').tooltip();

    $('li').click(function () {
        var buttonText = $(this).get(0).getElementsByTagName('a')[0].innerText;
        if (buttonText === 'Most Popular'){
            updatePanelsFromViews();
        }else {
            updatePanelsForFeed($(this).get(0).getElementsByTagName('a')[0].innerText);
        }
        $('li').removeClass('active');
        $(this).addClass('active');
    });

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

    function updatePanels(newsItemsXML) {
        var items = $(newsItemsXML).find('Item');
        $('#news-feed').empty();
        amountOfNewsItems = items.length;
        if (amountOfNewsItems === 0){
            $('#news-feed').append('<h2></h2>');
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
                    '<div class="panel-heading">' + title + '</div>' +
                    image +
                    '<div class="panel-body">' + description + '</div>' +
                    '<div class="panel-body"><label>Views:</label><span> ' + views + '</span></div>' +
                    '</div></div></div>');
            }
            $('#news-feed').append('</div');
            // Matching panel heights.
            $('.news-image:eq(0)').on('load', function () {
                $('.panel').matchHeight(false);
            });
            // Adding event to toggle modal, count views and update the most popular section.
            $('.panel').click(function () {
                var link = $(this).attr('value');
                emptyModal();
                populateModalDesc(link);
                populateAndToggleModal(link);
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
        $('.nav.navbar-nav li').removeClass('active');
        updatePanelsFromSearch($(this).val());

    });

});
