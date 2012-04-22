<?php

session_start();
include('lib/functions.php');

$query = "SELECT * FROM spaceobjects LIMIT 12";
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
 <div id="fb-root"></div>
      <script>
        window.fbAsyncInit = function() {
          FB.init({
            appId      : '317084905031656',
            status     : true, 
            cookie     : true,
            xfbml      : true,
            oauth      : true,
          });
        };
        (function(d){
           var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
           js = d.createElement('script'); js.id = id; js.async = true;
           js.src = "//connect.facebook.net/en_US/all.js";
           d.getElementsByTagName('head')[0].appendChild(js);
         }(document));
      </script>
<div id="homepage" class="container separated">
	<h1>This are the Satellites nearby</h1>
	<div class="fb-login-button" scope="email,user_checkins">
        Login with Facebook to checkin on them!
      </div>
	<table class="table table-striped satellite-checkin-list">
<?php while ($row = $result->fetch_assoc()) { ?>
		<tr data-href="SatelitePreview.php?satelliteId=<?= $row["id"]?>">
			<td><strong><?echo $row["name"]?></strong> - <?echo $row["category"]?></td>
			<td><!-- distancia -->0km</td>
		</tr>
<? } ?>
	</table>
	
	<nav>
		<ul class="nav nav-pills">
			<li><a href="about-us.html">Privacy</a></li>
			<li><a href="about-us.html">About</a></li>
			<li><a href="about-us.html">#spaceapps</a></li>
		</ul>
	</nav>
</div>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="js/jquery-1.7.1.min.js"><\/script>')</script>
<script src="js/main.js"></script>

</body>
</html>