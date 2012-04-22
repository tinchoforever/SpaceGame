<?php
    $arr = array (
		'a'=> array(
			'category'=>'Geostationary',
			'name'=>'WGS F4 (USA 233)',
			'nomradId'=>'38070',
			'intCode'=>'2012-003A',
			'launchDate'=>'1/20/2012',
			'period'=>'1436.1')
		'b'=>2,
		'c'=>3,
		'd'=>4,
		'e'=>5);

    echo json_encode($arr); // {"a":1,"b":2,"c":3,"d":4,"e":5}
?>