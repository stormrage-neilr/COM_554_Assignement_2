<?php
    header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
    header("Cache-Control: max-age=0");
    header("Content-Type: text/xml");
?>
<?php
    function get_url_contents($url){
        $crl = curl_init();
        $timeout = 0;
        curl_setopt ($crl, CURLOPT_URL,$url);
        curl_setopt ($crl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt ($crl, CURLOPT_CONNECTTIMEOUT, $timeout);
        $ret = curl_exec($crl);
        curl_close($crl);
        return $ret;
    }
    $url = "http://feeds.bbci.co.uk/news/rss.xml?edition=uk";
    $str = file_get_contents($url);
    echo $str;
?>