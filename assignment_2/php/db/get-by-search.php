<?php
    // Connecting to database.
    require_once('db-connector.php');

    // Getting news item from a search query.
    $sql_result = mysqli_query($conn, 'call sp5_getNewsBySearch(\'' . $_GET['search'] .'\')');

    // Creating an XML string from this query result.
    $xml_result_string = '<News>';
    while($row = mysqli_fetch_assoc($sql_result)) {
        $xml_result_string .= '<Item>';
        $xml_result_string .= '<Title>' . $row['Title'] . '</Title>';
        $xml_result_string .= '<Image_Source>' . $row['Image_Source'] . '</Image_Source>';
        $xml_result_string .= '<Description>' . $row['Description'] . '</Description>';
        $xml_result_string .= '<News_Link>' . $row['Link'] . '</News_Link>';
        $xml_result_string .= '<Channels>' . $row['Channels'] . '</Channels>';
        $xml_result_string .= '<Publish_Date>' . $row['Publish_Date'] . '</Publish_Date>';
        $xml_result_string .= '<Views>' . $row['Views'] . '</Views>';
        $xml_result_string .= '</Item>';
    }
    $xml_result_string .= '</News>';

    // Returning the XML string.
    echo ($xml_result_string);

    // Ending database connection.
    mysqli_close($conn);
?>