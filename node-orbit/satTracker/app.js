var terminal = require('color-terminal')

console.term = function(color, text){
	terminal.color(color).write(text).reset().nl(1);
}

var express = require('express')
  , request = require('request')
  , getPointsSat = function (sat, lat, lng, dur, tz, cb){

  		var satArray = [],
  			retry_limit = 10;
  			i = 0

		request({uri:'http://www.n2yo.com/sat/instant-tracking.php?s='+sat+'&hlat='+lat+'&hlng='+lng+'&d='+dur+'&tz='+tz}, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
			  	var data = JSON.parse(body);
				if(data[0].pos.length > 2 && data[0].id == sat){
					for(i=0, l=data[0].pos.length;i<l;i++){
						var temp = data[0].pos[i].d.split('|'),
							satMark = [temp[0], temp[1], temp[9]];

						satArray.push(satMark)
					}

					cb(satArray);
					console.term('green','Request finished')

				}else{
					if(retry_limit === i){
						cb({error: 'NO DATA'});
						return false
					}
					getPointsOrbit(sat, cb);
					console.term('red','Retry, no data recieved')
				}

		    }
		});
	}
  , getPointsOrbit = function (sat, cb){

  		var orbitArray = [],
  			retry_limit = 10;
  			i = 0

		request({uri:'http://www.n2yo.com/sat/jtest.php?s='+sat}, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		    	i++
			  	var data = JSON.parse(body);
				if(data[0].pos.length !== 0 && data[0].id == sat){
					for(i=0, l=data[0].pos.length;i<l;i++){
						var temp = data[0].pos[i].d.split('|'),
							orbitMark = [temp[0], temp[1]];

						orbitArray.push(orbitMark)
					}

					cb(orbitArray);
					console.term('green','Request finished')

				}else{
					if(retry_limit === i){
						cb({error: 'NO DATA'});
						return false
					}
					getPointsOrbit(sat, cb);
					console.term('red','Retry, no data recieved')
				}

		    }
		});
	};

var app = module.exports = express.createServer();


app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/sat/:id/:lat?/:lng?/:dur?/:tz?', function(req, res){

	var sat = req.params.id,
		lat = req.params.lat || '-34.603723',
		lng = req.params.lng || '-58.381593',
		dur = req.params.dur || 100,
		tz = req.params.tz || '-3';	

	console.term('cyan','Requested: ' + 'SAT: '+sat + ' LAT: '+lat + ' LNG: '+lng + ' DUR: '+dur + ' TZ: '+tz)
	getPointsSat(sat, lat, lng, dur, tz, function(data){

		res.json(data);

	});

});

app.get('/orbit/:id', function(req, res){

	var sat = req.params.id;

	console.term('cyan','Requested: ' + 'SAT: '+sat)
	getPointsOrbit(sat, function(data){

		res.json(data);

	});

});

app.listen(3000);