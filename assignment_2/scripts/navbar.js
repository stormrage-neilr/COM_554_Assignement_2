$(document).ready(function (){
    //Initial setup
    $('.feed').hide();
    $('#home-feed').show();

    $('.nav.navbar-nav li').click(function(){

        $('.nav.navbar-nav li').removeClass('active');
        $(this).toggleClass('active');

        $('.feed').hide();
        $('#' + $(this).find('a')[0].innerHTML.toLowerCase() + '-feed').show()
    })

    $('.navbar-brand').click(function(){
        $('.nav.navbar-nav li').removeClass('active');
        $('.nav.navbar-nav li').first().addClass('active');
        $('.feed').hide();
        $('#home-feed').show();
    })
});