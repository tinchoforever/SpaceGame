<?php
$data = $signed_request_data['app_data'];
echo "SELECT * FROM invites WHERE accept = NULL AND id = $data AND receiver_id = ".$_SESSION["user_id"];
die();
$q = $mysql->query("SELECT * FROM invites WHERE accept = NULL AND id = $data AND receiver_id = ".$_SESSION["user_id"];
if( $q->num_rows > 0 || DEV){
$r = $q->fetch_assoc();
var_dump($r);
die();
?><!DOCTYPE html>
<html xmlns:og="http://ogp.me/ns#" xmlns:fb="http://www.facebook.com/2008/fbml">
<head>
<meta charset="utf-8" />
<title>JoseCuervo - Concurso - Facebook</title>
<link rel="stylesheet" href="css/stylesheet.css" media="screen" />
<link rel="stylesheet" href="css/facebook.css" media="screen" />
<link rel="stylesheet" href="css/jfmfs.css" media="screen" />
<!--[if IE]><script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
</head>
<body>

<!-- <?php /* var_dump( $signed_request_data );*/ ?> -->

<input type="hidden" value="<?=$data?>" id="app_data" />
<div id="box" class="remove-padding">
	<article id="invitation-received">
		<a href="#">
		</a>
	</article>
	<article id="select-secret" class="active">
		<div id="this-one">
			<a href="#"></a>
		</div>
		<div class="secretsHolder">
			<a id="secret-1-link" href="#"></a>
			<a id="secret-2-link" href="#"></a>
			<a id="secret-3-link" href="#"></a>
		</div>
		<div id="instructions"></div>
		<?php
		$numbers = range(1, 3);
		shuffle($numbers);
		$i = 0;
		while($r = $q->fetch_assoc()){
		?>
		<div id="secret-<?=$numbers[$i++]?>" class="secret" data-id="<?=$r['id']?>">
			<div class="titleHolder">
				<?=$r['title']?>
			</div>
			<div class="placeTitle">
				<?=$r['place']?>
			</div>
			<div class="textHolder">
				<?=$r['body']?>
			</div>
		</div>
		<?php
		}
		?>
		<div id="lightbox-bg"></div>
		<div id="lightbox-content">
			<a class="close" href="#"></a>
			<a class="confirm" href="#"></a>
			<a class="cancel" href="#"></a>
		</div>
	</article>
	<article id="hit-it">
		<a href="index.php?page=look-secrets"></a>
	</article>
	<article id="select-error">
		<a href="index.php?page=tell-secret"></a>
	</article>
</div>
<script src="js/env.js"></script>
<script src="js/jquery-1.7.1.min.js"></script>
<script src="js/jfmfs.js"></script>
<script src="js/fanpage.js"></script>
<div id="fb-root"></div>
<script>
var thenv;
window.fbAsyncInit = function() {
	FB.init({
	    apiKey: "<?= FB_APP_ID; ?>",
	    status: true,
	    cookie: true,
		xfbml: true
	});
	thenv = new env("<?= FB_APP_ID; ?>");
	jQuery(DT);
};
(function() {
	var e = document.createElement('script'); e.async = true;
	e.src = document.location.protocol + '//connect.facebook.net/es_ES/all.js';
	document.getElementById('fb-root').appendChild(e);
}());
</script>
</body>
</html>
<?php
}
else{
	header("Location: index.php");
	exit;
}
