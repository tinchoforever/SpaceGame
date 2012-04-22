<?
	header('Cache-Control: no-cache, must-revalidate');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
	header('Content-type: application/json');
	$satlist = $_GET["s"];
	$homeLat = $_GET["hlat"];
	$homeLng = $_GET["hlng"];
	$DURATION = $_GET["d"];
	$r = $_GET["r"];
	$intTimezone_now_tzstring = $_GET["tz"];
	$url = "http://www.n2yo.com/sat/instant-tracking.php?s=".$satlist."&hlat=".$homeLat."&hlng=".$homeLng."&d=".$DURATION."&r=".$r."&tz=" . $intTimezone_now_tzstring;
	$c = curl_init($url);
	curl_setopt($c,CURLOPT_RETURNTRANSFER, true);

	$html = curl_exec($c);

	if (curl_error($c))
	    die(curl_error($c));

	// Get the status code
	$status = curl_getinfo($c, CURLINFO_HTTP_CODE);

	curl_close($c);
	
	echo $html;
	
?>