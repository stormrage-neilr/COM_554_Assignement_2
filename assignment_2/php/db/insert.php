<?php
    require_once('db-connector.php');

    $query =
        "call sp1_insert('" . $_POST['link'] . "', '" .
        $_POST['title'] . "', '" .
        $_POST['imgSrc'] . "', '" .
        $_POST['desc'] . "', '" .
        $_POST['chan'] ."', '" .
        $_POST['pubDate'] .
        "')";
    mysqli_query($conn, $query);

    mysqli_close($conn);
?>

