<?php

session_start();
include("lib/functions.php");

$id = $_GET["satelliteId"];

$query = "SELECT id FROM spaceobjects WHERE id = '$id'";
$result = $mysql->query($query);
if( !$result ){ die("error" . $mysql->error); }

?><!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>NASA</title>
	<link rel="stylesheet" href="css/bootstrap.css" media="screen" />
	<link rel="stylesheet" href="css/nasa.css" media="screen" />
</head>
<body>

<div id="checkin" class="container separated">
	<h1>International Space Station</h1>
	
	<div id="map" class="container"></div>

	<form action="SateliteDetail.php" method="post" id="f">
		<a href="#" onclick="document.getElementById('f').submit()" class="btn btn-info container">Beam me up, Scoffy!</a>
		<input type="hidden" name="satelliteId" id="satelliteId" value="<?echo $id?>" />
		<input type="hidden" name="userId" id="userId" value="1" />
	</form>
	
	<div class="hero-unit">
<?
while ($row = $result->fetch_assoc()) {
	$count = 0;

	$query = "SELECT count(*) as count spaceObjects_usrs WHERE soid = '$id'";
	$countResult = $mysql->query($query);
	if( !$result ){ $count = $countResult["count"];}
} ?>
		<div class="span2">
			<h1><?= $count?></h1>
			<p>Beamed</p>
		</div>
		<div class="span2">
			<h1>10</h1>
			<p>Points you receive</p>
		</div>
	</div>
	
</div>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"></script>
<script src="http://maps.google.com/maps/api/js?sensor=false"></script>
<script>window.jQuery || document.write('<script src="js/jquery-1.7.1.min.js"><\/script>')</script>
<script src="js/main.js"></script>

</body>
</html>