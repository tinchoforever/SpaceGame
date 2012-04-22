<?php

$mysql = new mysqli('localhost', 'root', 'tomasl00n mysql', 'space');
if( mysqli_connect_error() ){
	echo "<h1>Downtime: " . mysqli_connect_errno() . "</h1>";
	//echo '<p>Connect Error (' . mysqli_connect_errno() . ') ' . mysqli_connect_error() . '</p>';
	exit;
}