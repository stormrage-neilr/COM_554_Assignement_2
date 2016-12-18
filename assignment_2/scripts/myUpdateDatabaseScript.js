/**
 * Created by neilrafferty on 18/12/2016.
 *
 * This script updates the MySql database with new news feeds using AJAX and PHP.
 */
$(document).ready(function()
{
    //Updating the database with all bbc rss feeds.
    updateDatabaseFromBBCFeeds();

    //Calling AJAX request for each news feed.
    function updateDatabaseFromBBCFeeds() {
        updateDatabaseFromBBCFeed('');
        updateDatabaseFromBBCFeed('entertainment_and_arts/');
        updateDatabaseFromBBCFeed('politics/');
        updateDatabaseFromBBCFeed('science_and_environment/');
        updateDatabaseFromBBCFeed('technology/');
        updateDatabaseFromBBCFeed('world/');
    }

    //The parameter gets passed into the php file to form the rss feed url.
    function updateDatabaseFromBBCFeed(feedName){
        $.ajax({
            type: "GET",
            url: "php/rss_bbc_feed.php",
            data: {feedName: feedName},
            dataType: "xml",
            cache: false,
            success: updateDatabase,
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    }

    //This function saves an individual news article to the database. It calls the sp1_insert store procedure in database.sql.
    function saveToDatabase(feedItem, channelTitle){
        $.ajax({
            type: "POST",
            url: "php/db/insert.php",
            data: {
                title: feedItem.find("title").text().split("'").join("\\'"),
                imgSrc: feedItem.find('thumbnail').attr('url').split("'").join("\\'"),
                desc: feedItem.find("description").text().split("'").join("\\'"),
                link: feedItem.find("link").text().split("'").join("\\'"),
                pubDate: feedItem.find("pubDate").text().split("'").join("\\'"),
                chan: channelTitle
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    }

    // Takes the ajax news feed result and passes each article into the database.
    function updateDatabase(feed){
        var channelTitle = $(feed).find("channel").eq(0).find("title").eq(0).text();
        for (var i = 0; i < $(feed).find("item").length ; i++) {
            saveToDatabase($(feed).find("item").eq(i), channelTitle);
        }
    }

    setInterval(updateDatabaseFromBBCFeeds(), 30000)
});
