<?php

session_start();
include('lib/functions.php');

$id = $_POST["satelliteId"];
$userId = $_POST["userId"];

if($userId){
	$query = "select * from spaceobjects_users where soid= '$id' and uid = '$userId'";
	$result = $mysql->query($query);
	if( !$result ){ die('error: ' . $mysql->error); }	

	$row = $result->fetch_assoc();
	if(!$row){
		$query = "insert into spaceobjects_users (soid, uid) values ('$id', '$userId')";
		$result = $mysql->query($query);
		if( !$result ){ die('error: ' . $mysql->error); }	
	}

	$query = "update users set points = points + 10 where id = $userId";
	$result = $mysql->query($query);
	if( !$result ){ die('error:' . $mysql->error); }	
}

$query = "SELECT * FROM spaceobjects WHERE id = '$id'";
$result = $mysql->query($query);
if( !$result ){ die('error' . $mysql->error); }

?>

<html>
<head>

</head>
<body>
	
<ul>
<?
while ($row = $result->fetch_assoc()) {
    ?><li>
    	<p>id <?echo $row['id']?><br/>
		name <?echo $row['name']?><br/>
		category <?echo $row['category']?><br/>
		nomradId <?echo $row['nomradId']?><br/>
		intCode <?echo $row['intCode']?><br/>
		launchDate <?echo $row['launchDate']?><br/>
		period <?echo $row['period']?>
		</p>
	<p>
		<ul>
	<?
		$query = "SELECT * FROM users WHERE id in (SELECT uid FROM spaceobjects_users WHERE soid = '$id')";		
		$users = $mysql->query($query);
		if( !$users ){ die('error' . $mysql->error); }

		while ($row = $users->fetch_assoc()) {
			?>
			<li>
				name <?echo $row['name']?> - 
				badges <?echo $row['badges']?> - 
				points <?echo $row['points']?>
			</li>
			<?
		}
	?>	
	</ul></p>	
	</li><?
}
?>
</ul>


</body>
</html>
