var orbitArray = [],
	satPointsArray = [],
	sat = require('optimist').argv.sat || 28357;
	
console.log(sat)

var request = require('request'),
	getPoints = function (){
		request({uri:'http://www.n2yo.com/sat/jtest.php?s=' + sat}, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
			  	var data = JSON.parse(body);
				if(data[0].pos.length !== 0 && data[0].id == sat){
					for(i=0, l=data[0].pos.length;i<l;i++){
						var temp = data[0].pos[i].d.split('|'),
							orbitMark = [temp[0], temp[1]]
						orbitArray.push(orbitMark)
					}

					console.log(orbitArray)

				}else{
					getPoints();
				}

		    }
		});
	};

getPoints();