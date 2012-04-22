<?php
define('DEV', false);
define('PROD', (stripos($_SERVER['HTTP_HOST'], 'niceandfancyapps') !== false ) ? true : false );
define('DB_HOST',			( DEV ? 'localhost' : 'localhost' ));
define('DB_USER',			( PROD ? '582145_doritosx' : 'root' ) );
define('DB_PASS',			( PROD ? 'Xn4q3gKwyUX6kjPHCIoq' : '' ) );
define('DB_NAME',			( PROD ? '582145_doritos2012' : 'space' ) );


session_start();
include('lib/functions.php');
 
error_reporting(E_ALL);

$string = file_get_contents("satellites.json");
$json_a=json_decode($string);

foreach ( $json_a->satellites as $satellite )
{	
	if($satellite->name != ''){
	    $query = "INSERT INTO spaceObjects (category, name, nomradId, intCode, launchDate, period) ".
				 "VALUES (".
				 	"'" . $satellite->category . "', ".
				 	"'" . $satellite->name . "', ".
				 	"'" . $satellite->nomradId . "', ".
				 	"'" . $satellite->intCode . "', ".
				 	"'" . $satellite->launchDate . "', ".
				 	"'" . $satellite->period . "'".
			 	 ")";

		$q = $mysql->query($query);
		if( !$q ){
			die('error' . $mysql->error);
		}
    }
}

die('ok');

?>