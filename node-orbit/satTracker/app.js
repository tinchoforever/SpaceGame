var terminal = require('color-terminal'),
	should = require('should')

console.term = function(color, text){
	terminal.color(color).write(text).reset().nl(1);
}

var express = require('express')
  , getPoints = require('./getpoints.js');
  
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
	getPoints.getSatPoints(sat, lat, lng, dur, tz, function(data){

		res.json(data);

	});

});

app.get('/orbit/:id', function(req, res){

	var sat = req.params.id;

	console.term('cyan','Requested: ' + 'SAT: '+sat)
	getPoints.getOrbitPoints(sat, function(data){

		res.json(data);

	});

});

app.get('/near/:lat?/:lng?', function(){

	

})


app.listen(3000);