var satArray = [],
	sat = require('optimist').argv.sat || 28357,
	lat = require('optimist').argv.lat || '-34.603723',
	lng = require('optimist').argv.lng || '-58.381593',
	tz = require('optimist').argv.tz || '-3',
	dur = require('optimist').argv.dur || '3600';
	
console.log(sat)

var request = require('request'),
	getPoints = function (){
		request({uri:'http://www.n2yo.com/sat/instant-tracking.php?s='+sat+'&hlat='+lat+'&hlng='+lng+'&d='+dur+'&tz='+tz}, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
			  	var data = JSON.parse(body);
				if(data[0].pos.length > 1 && data[0].id == sat){
					for(i=0, l=data[0].pos.length;i<l;i++){
						var temp = data[0].pos[i].d.split('|'),
							satMark = [temp[0], temp[1], temp[9]];

						satArray.push(satMark)
					}

					console.log(satArray, satArray.length)

				}else{
					getPoints();
				}

		    }
		});
	};

getPoints();