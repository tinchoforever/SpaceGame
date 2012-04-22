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

$satellite = $result->fetch_assoc();

?>

<!DOCTYPE HTML>
<html>
	<head>
		<link rel="stylesheet" type="text/css" href="css/960.min.css" />
		<link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
		<link rel="stylesheet" type="text/css" href="css/data.css" />
		<link rel="stylesheet" href="css/nasa.css" media="screen" />
		<!--[if lt IE 9]>
		<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
		<script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key=AIzaSyBJeLmIIMUcaqw1rKIQSEQ-viv5FAaVCMU" type="text/javascript"></script>
	</head>
<body>
	
	<div id="checkin" class="container separated container_12">
			
			<h1><?echo $satellite["name"]?></h1>		
			<h3>You have been Beamed up!</h3>		
			<div id="satmap" class="container" style="width: 100%; height: 250px; border: 1px solid #999999">&nbsp;</div>
			<section class="grid_12 span2">
				<div class="span2 grid_4 alpha">
					<h2>Wikipedia</h2>
				</div>
				<div class="span2 grid_4">
					<h2>Crew</h2>
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
					</ul>
				</div>
				<div class="span2 grid_4 omega">
					<h2>Photos</h2>
				</div>
			</section>
			<section class="grid_12">
				<h1>Tech Data</h1>
				<div id="paneldata">
					<table width=100% class="tblsattrk" border=0>
						<tr>
							<td>LOCAL TIME:</td><td align="left" colspan="2" width="75"><div id="localtime"></div></td>
						</tr>
						<tr>
							<td>UTC:</td><td align="left" colspan="2"><div id="utctime"></div></td>
						</tr>
						<tr>
							<td>LATITUDE:</td><td align="left" colspan="2"><div id="satlat"></div></td>
						</tr>
						<tr>
							<td>LONGITUDE:</td><td align="left" colspan="2"><div id="satlng"></div></td>
						</tr>
						<tr>
							<td>ALTITUDE [km]:</td><td align="left" colspan="2"><div id="sataltkm"></div></td>
						</tr>
						<tr>
							<td>ALTITUDE [mi]:</td><td align="left" colspan="2"><div id="sataltmi"></div></td>
						</tr>
						<tr>
							<td>SPEED [km/s]:</td><td align="left" colspan="2"><div id="satspdkm"></div></td>
						</tr>
						<tr>
							<td>SPEED [mi/s]:</td><td align="left" colspan="2"><div id="satspdmi"></div></td>
						</tr>
						<tr>
							<td>AZIMUTH:</td><td align="left"><div id="sataz"></div><td align="left"><div id="satazcmp"></div></td>
						</tr>
						<tr>
							<td>ELEVATION:</td><td align="left" colspan="2"><div id="satel"></div></td>
						</tr>
						<tr>
							<td>RA:</td><td align=left colspan="2"><div id="satra"></div></td>
						</tr>
						<tr>
							<td>DEC:</td><td align="left" colspan="2"><div id="satdec"></div></td>
						</tr>
						<tr>
							<td align="center" colspan="3"><b><div id="satshadow"><b></div></td>
						</tr>
						<tr>
							<td>PERIOD:</td><td align="left" colspan="2"><div id="period"></div></td>
						</tr>
						<tr>
							<td align="left" colspan=3><div id="prediction"></div></td>
						</tr>
					</table>
				</div>
			</section>
		</div>
		<?
			$c = curl_init('http://www.n2yo.com/sat/jtest.php?s=25544&r='.time().'.0000');
			curl_setopt($c,CURLOPT_RETURNTRANSFER, true);

			$html = curl_exec($c);

			if (curl_error($c))
			    die(curl_error($c));

			// Get the status code
			$status = curl_getinfo($c, CURLINFO_HTTP_CODE);

			curl_close($c);
			
		?>
		<script>var sArray = <?=$html?>;</script>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
		<script type="text/javascript" src="js/test.js"></script>

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
	
	</ul></p>	
	</li><?
}
?>
</ul>


</body>
</html>
