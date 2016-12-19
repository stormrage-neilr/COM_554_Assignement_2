<?php
    require_once('../../../../db-connector.php');

    $sql_result = mysqli_query($conn, 'call sp4_getNewsByViews()');

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
    echo ($xml_result_string);
    mysqli_close($conn);
?>