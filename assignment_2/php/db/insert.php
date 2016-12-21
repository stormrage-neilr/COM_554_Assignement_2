<?php
    // Connecting to database.
    require_once('db-connector.php');

    // Creating insert query from parameters from request.
    $query =
        "call sp1_insert('" . $_POST['link'] . "', '" .
        $_POST['title'] . "', '" .
        $_POST['imgSrc'] . "', '" .
        $_POST['desc'] . "', '" .
        $_POST['chan'] ."', '" .
        $_POST['pubDate'] .
        "')";

    // Calling query.
    mysqli_query($conn, $query);

    // Ending Connection.
    mysqli_close($conn);
?>