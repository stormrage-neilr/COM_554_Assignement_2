/**
 * Created by neilrafferty on 06/12/2016.
 */
$(document).ready(function()
{
    /*
        Initial setup.
     */

    // Initially populating the site from the URL.
    populateFromUrl();

    // Initiating the bootstrap tool tip.
    $('[data-toggle="tooltip"]').tooltip();

    /*
        AJAX Functions.
     */

    // Feeding news items that have been viewed into the panels.
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

    // Feeding news items that match the search text into the panels.
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

    // Feeding news items that match the channel name into the panels.
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

    // Using the link to populate the modal description in more detail than provided by the bbc rss feeds.
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

    /*
        Populating Panels.
     */

    // Updating the main body of the site. This happens when the user searches, clicks nav item or user browser navigation.
    function updateFeed(urlSuffixOrButtonText){
        window.scrollTo(0, 0);
        // If the URL suffix or button text starts with most popular update the panels by view count.
        if (urlSuffixOrButtonText.toLowerCase().indexOf('most popular') === 0){
            updatePanelsFromViews();
            $('#search-box').val(''); // Emptying the search box so that the placeholder text appears again.
        }// If the URL suffix starts with search continue to run search.
        else if (urlSuffixOrButtonText.indexOf('search') === 0){
            var searchValue = urlSuffixOrButtonText.split('search=')[1].split('+modal=')[0];// Getting search text from url.
            $('#search-box').val(searchValue);// Updating the search box value.
            updatePanelsFromSearch(searchValue);// Loading search results.
        }
        else {
            var channelString = urlSuffixOrButtonText.split('+modal=')[0];// Getting channel string from URL or button text.
            updatePanelsForFeed(channelString);
            $('#search-box').val(''); // Emptying the search box so that the placeholder text appears again.
        }
        // Changing the highlighted nav menu item.
        var listItems = $('li');
        listItems.removeClass('active');
        for (var i = 0; i < listItems.length; i ++) {
            // If the button text equals the start of the URL Suffix or button text parameter highlight the button.
            if (listItems.get(i).getElementsByTagName('a')[0].innerText.toLowerCase() === urlSuffixOrButtonText.toLowerCase()) {
                $(listItems.get(i)).addClass('active')
            }
        }
    }

    // This function takes the news items results in XML string format and pass them into the panels.
    function updatePanels(newsItemsXML) {
        // Getting news items in an array.
        var items = $(newsItemsXML).find('Item');
        $('#news-feed').empty(); // Clearing pre-existing site content.
        amountOfNewsItems = items.length;
        // If there are no news items display no result found text.
        if (amountOfNewsItems === 0){
            $('#news-feed').append("<h2>No search result found for '" + $('#search-box').val() + "' :(</h2>");
        }else {
            // If results are from a search display the search string.
            if ($('#search-box').val().length > 0){
                $('#news-feed').append("<h2>Search result found for '" + $('#search-box').val() + "'.</h2>");
            }
            // Creating a group of panels based on the information from the news items.
            $('#news-feed').append('<div class="panel-group">');
            for (var i = 0; i < amountOfNewsItems; i++) {
                var title = items[i].getElementsByTagName('Title')[0].innerHTML;
                var description = items[i].getElementsByTagName('Description')[0].innerHTML;
                var imageSrc = items[i].getElementsByTagName('Image_Source')[0].innerHTML;
                var link = items[i].getElementsByTagName('News_Link')[0].innerHTML;
                var views = items[i].getElementsByTagName('Views')[0].innerHTML;
                var image = '';
                // Handling undefined image from the BBC (One or two have been discovered in the bbc news feed).
                if (imageSrc !== "undefined") {
                    image = '<img class="news-image"src="' + imageSrc + '" alt="" class="img"/>';
                }
                $('#news-feed').append('<div class="col-sm-6 col-lg-3">' + // Setting bootstrap columns.
                    '<div class="panel panel-default " value="' + link + '">' + // Adding the link of the news article to use in finding modal information.
                    '<div class="panel-heading"><label class="news-title">' + title + '</label></div>' +
                    image +
                    '<div class="panel-body">' +
                    '<p>' + description + '</p>' +
                    '<label>Views:</label><span> ' + views + '</span></div>' +
                    '</div></div>');
            }
            $('#news-feed').append('</div');
            // Matching panel heights after an image has been loaded.
            $('.news-image:eq(0)').on('load', function () {
                $('.panel').matchHeight(false);
            });
            // Adding event to toggle modal to the newly generated panels.
            $('.panel').click(function () {
                var link = $(this).attr('value'); // Getting link value from panel to generate modal.
                history.pushState(null, null, "news_site.html?" + location.hash + "+modal=" + link); // Saving modal launch to history.
                launchModal(link);
            });
        }
    }

    /*
     Modal Functionality.
     */

    // Launch modal functionality - called when panel is clicked on or possibly when user navigates using the browser back and forward buttons.
    function launchModal(link) {
        emptyModal();
        populateModalDesc(link);
        populateAndToggleModal(link);
    }

    // Updating the modal with the result from the ajax request.
    function updateModalDesc(linkDoc){
        // Filtering out the news story (different queries are used for different feeds).
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

    // Updating the modal with new information. Note: the description is updated elsewhere as it uses information from a different source.
    function updateModal(newsItem){
        var item = $(newsItem).find('Item').eq(0); // Retrieving the item from the XML.
        var imageSrc = item.find('Image_Source').text();
        $('#modal-title').html(item.find('Title').text());
        $('#modal-views').html(' ' + item.find('Views').text());
        $('#modal-pubDate').html(' ' + item.find('Publish_Date').text());
        $('#modal-channel').html(' ' + item.find('Channels')[0].innerHTML);
        $('#modal-link').attr('href', item.find('News_Link')[0].innerHTML);
        // Handling undefined image from the BBC (One or two have been discovered in the bbc news feed).
        if (imageSrc === "undefined") {
            image = '';
        } else {
            image = '<img src="' + imageSrc + '" alt="" class="img"/>';
        }
        $('#modal-picture').attr('src', imageSrc);
        // Launching the modal now that the new information has been entered.
        $('.modal').modal('toggle');
    }

    // Removing information from the modal to ensure it does not display the previous information before the new information has loaded.
    function emptyModal(){
        $('#modal-title').html('');
        $('#modal-description').html('');
        $('#modal-views').html(' ');
        $('#modal-pubDate').html(' ');
        $('#modal-channel').html(' ');
        $('#modal-picture').attr('src', '')
    }

    /*
        History Functionality.
     */

    // Loading form history when the browser back and forward buttons are pushed.
    $(window).on('popstate', function (){
        populateFromUrl();
    });

    // Using the url to repopulate the users information.
    function populateFromUrl() {
        var pageRef = location.hash.split('#').pop(); // Getting the end of the url.
        // Prepending the string with home if it has no feed name.
        var splitPageRef = pageRef.split('+modal=');
        if (splitPageRef[0] === '') {
            pageRef = 'home';
            if (splitPageRef.length === 2){
                pageRef += '+modal=' + splitPageRef[1];
            }
        }
        // Updating the panels with the feed name or search text.
        updateFeed(pageRef);
        // Launching the modal if this was opened.
        if (pageRef.indexOf('+modal=') !== -1) {
            launchModal(pageRef.split('+modal=')[1]);
        } else {
            $('#modal').modal('hide');
        }
    }

    // Saving to browser history when the modal is closed.
    $('#modal').on('hidden.bs.modal', function () {
        var newUrlTail = "news_site.html?" + location.hash.split("+modal=")[0];// Concatenating the new url from the current one.
        history.pushState(null, null, newUrlTail);// Saving the new url to the browser history.
    });

    /*
        Navigation Bar Functionality.
     */

    // Adding click events to the navigation items.
    $('li').click(function () {
        var buttonText = $(this).get(0).getElementsByTagName('a')[0].innerText;
        history.pushState(null, 'News - ' + buttonText, "news_site.html?#" + buttonText.toLocaleLowerCase());
        updateFeed(buttonText);
    });

    // Adding search functionality to trigger on input change in the search bar.
    $('#search-box').bind('input', function() {
        // Saving the new search to the browser history.
        history.pushState(null, null, "news_site.html?#search=" + $(this).val());
        // Removing nav bar selection.
        $('.nav.navbar-nav li').removeClass('active');
        // Updating panels with the search result.
        updatePanelsFromSearch($(this).val());
    });
});