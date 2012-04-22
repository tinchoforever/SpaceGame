<?php

session_start();
include('lib/functions.php');

$query = "SELECT * FROM spaceobjects LIMIT 10";
$result = $mysql->query($query);
if( !$result ){ die('error' . $mysql->error); }

?><!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>NASA</title>
	<link rel="stylesheet" href="css/bootstrap.css" media="screen" />
	<link rel="stylesheet" href="css/nasa.css" media="screen" />
</head>
<body>

<div id="homepage" class="container separated">
	<h1>Satellites nearby</h1>
	
	<table class="table table-striped satellite-checkin-list">
<?php while ($row = $result->fetch_assoc()) { ?>
		<tr data-href="SatelitePreview.php?satelliteId=<?= $row["id"]?>">
			<td><strong><?echo $row["name"]?></strong></td>
			<td><!-- distancia -->0km</td>
		</tr>
<? } ?>
	</table>
	
	<nav>
		<ul class="nav nav-pills">
			<li><a href="about-us.html">Team</a></li>
		</ul>
	</nav>
</div>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="js/jquery-1.7.1.min.js"><\/script>')</script>
<script src="js/main.js"></script>

</body>
</html>