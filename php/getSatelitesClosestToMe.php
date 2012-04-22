<?php

session_start();
include("lib/functions.php");
$id = $_GET["satelliteId"];
$query = "SELECT * FROM spaceobjects WHERE id = '$id'";
$result = $mysql->query($query);
if( !$result ){ die('error' . $mysql->error); }
$row = $result->fetch_assoc();

$a = array (
			'category'=>$row["name"],
			'name'=>$row["category"],
			'nomradId'=>$row["id"],
			'intCode'=>$row["intCode"],
			'launchDate'=>$row["launchDate"],
			'period'=>$row["period"]);
echo json_encode($a);
?>