//Module here
var terminal = require('color-terminal'),
    should = require('should'),
    express = require('express')

console.term = function(color, text){
    terminal.color(color).write(text).reset().nl(1);
}

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


//Classes here
var getPoints = require(__dirname + '/getPoints.js'), 
    gSats = require(__dirname + '/getGdocsJson.js'),
    calcDistance = require(__dirname + '/calcDist.js')

//Routes
app.get('/sat/:id/:lat?/:lng?/:dur?/:tz?', function(req, res){
    var sat = req.params.id,
        lat = req.params.lat || '-34.603723',
        lng = req.params.lng || '-58.381593',
        dur = req.params.dur || 100,
        tz = req.params.tz || '-3'; 
    console.term('cyan','Requested: ' + 'SAT: '+sat + ' LAT: '+lat + ' LNG: '+lng + ' DUR: '+dur + ' TZ: '+tz)
    getPoints.getSatPoints(sat, lat, lng, dur, tz, function(data){
	res.header('Access-Control-Allow-Origin','*')
        res.json(data);
    });
});

app.get('/orbit/:id', function(req, res){
    var sat = req.params.id;
    console.term('cyan','Requested: ' + 'SAT: '+sat)
    getPoints.getOrbitPoints(sat, function(data){
	res.header('Access-Control-Allow-Origin','*')
        res.json(data);
    });
});

app.get('/near/:lat?/:lng?/:tz?', function(req, res){

  var lat = req.params.lat || '-34.603723',
      lng = req.params.lng || '-58.381593',
      dur = req.params.dur || 1,
      tz = req.params.tz || '-3';  

  var candidates = []

  gSats(function(d){
      var responded = false

      for(sat in d){
        var i = 0
        terminal.color('red').write('Requesting: ').reset();
        console.term('cyan',d[sat].name + ' ' + d[sat].id);

        getPoints.getSatPoints(d[sat].id, lat, lng, 3, tz, function(data, id){
              i++
              console.log(sat, i)
              var candidate = {"satId": id, "distance": +calcDistance(data[0][0], data[0][1], lat, lng)}
              candidates.push(candidate)
              if(i === 14){
                responded = true
		res.header('Access-Control-Allow-Origin','*')
		console.log(candidates)
                res.json(candidates)
              }
        })

      }

      setTimeout(function(){
        if(!responded){
	  res.header('Access-Control-Allow-Origin','*')
          res.json({error: 'Not enough data retrieved.'})
        }
      },10000)

  });

});


app.listen(3003);
