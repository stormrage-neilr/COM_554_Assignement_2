<?php
    require_once('../../../../db-connector.php');
    $query =
        "call sp1_insert('" . $_POST['link'] . "', '" .
        $_POST['title'] . "', '" .
        $_POST['imgSrc'] . "', '" .
        $_POST['desc'] . "', '" .
        $_POST['chan'] ."', '" .
        $_POST['pubDate'] .
        "')";
    mysqli_select_db($conn, 'b00451753');
    mysqli_query($conn, $query);
?>