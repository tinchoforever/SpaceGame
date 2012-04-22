<?php
    $arr = array (
		'0	' => array(
			'satelite'=> array(
				'category'=>'Geostationary',
				'name'=>'WGS F4 (USA 233)',
				'nomradId'=>'38070',
				'intCode'=>'2012-003A',
				'launchDate'=>'1/20/2012',
				'period'=>'1436.1'),
			'distance' => '100' ),
		'1' => array(
			'satelite'=> array(
				'category'=>'Geostationary',
				'name'=>'WGS F4 (USA 233)',
				'nomradId'=>'38070',
				'intCode'=>'2012-003A',
				'launchDate'=>'1/20/2012',
				'period'=>'1436.1'),
			'distance' => '500' ),
		'2' => array(
			'satelite'=> array(
				'category'=>'Geostationary',
				'name'=>'WGS F4 (USA 233)',
				'nomradId'=>'38070',
				'intCode'=>'2012-003A',
				'launchDate'=>'1/20/2012',
				'period'=>'1436.1'),
			'distance' => '3400' ),
		'3' => array(
			'satelite'=> array(
				'category'=>'Geostationary',
				'name'=>'WGS F4 (USA 233)',
				'nomradId'=>'38070',
				'intCode'=>'2012-003A',
				'launchDate'=>'1/20/2012',
				'period'=>'1436.1'),
			'distance' => '5000' )
	);

    echo json_encode($arr); // {"a":1,"b":2,"c":3,"d":4,"e":5}
?>