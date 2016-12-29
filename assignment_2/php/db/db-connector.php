<?php
    /*
        This file provides a connection to the mysql database. Note: a user should have
        been made with only access to the stored procedures used but I did not have the
        correct level of permissions to do this.
     */
    $host = "localhost";
    $user = '';
    $passwd = "";

    // Create connection
    $conn = new mysqli($host, $user, $passwd);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    // Selecting database (b00451753 is the only db available on the university server).
    mysqli_query($conn, 'use b00451753');
?>