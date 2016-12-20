<?php
    $host = "localhost";
    $user = '';
    $passwd = "";

    // Create connection
    $conn = new mysqli($host, $user, $passwd);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    mysqli_query($conn, 'use b00451753');
?>
