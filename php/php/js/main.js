var NASA = {};

// TODO: this should not be hardcoded
LAT = -34;
LNG = -58;
SATELLITE = 25544;

(function($, App){
	
	var toKM = function(km) {
		return (km).toFixed(1) + 'km';
	};
	
	App.list = function(){
		var list = $('.satellite-checkin-list'),
			template = list.html(),
			markup = [];
		if (!list || !template){
			return false;
		}

		list.on('click', 'tr', function(){
			window.location.href = $(this).data('href');
		});
			
		var parseSatellites = function(satellites) {
			satellites.sort(function(a, b) {
				return a.distance - b.distance;
			});
			
			for (var i = 0, item; item = satellites[i++]; ) {
				markup.push(
					template.replace('{{name}}', (item.name || item.satId))
							.replace('{{distance}}', toKM(item.distance))
							.replace('{{id}}', item.satId)
				);
				// item.cat;
			}
		};
		
		var build = function() {
			list.html( markup.join('') ).removeClass('hide');
			
			list.on('click', 'tr', function(){
				window.location.href = $(this).data('href');
			});
		};
		
		/*console.log('Requesting...');
		$.get('http://sockets.brunolazzaro.com.ar/near/' + LAT + '/' + LNG, function(r) {
			console.log('Response received.');
			if (r[0].error) {
				// TODO: handle this
				// fuck it
				alert('Failure');
			} else {
				parseSatellites(r);
				build();
			}
		});*/
	};
	
	App.maps = new function(){
		var self = this;
		
		self.initialize = function() {
			var mapDiv = document.getElementById('map');
			self.map = new google.maps.Map(mapDiv, {
				center: new google.maps.LatLng(+self.marker.lat, +self.marker.lng),
				zoom: 3,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});
			google.maps.event.addListenerOnce(self.map, 'tilesloaded', self.addMarker);
		};

		self.addMarker = function() {
			var lat = +self.marker.lat,
				lng = +self.marker.lng,
				place = new google.maps.LatLng(lat, lng),
				marker = new google.maps.Marker({
					icon: 'http://www.n2yo.com/inc/saticon.php?t=0&s=' + SATELLITE,
					position: place,
					map: self.map
				});
			// self.map.panTo(place);
		};
	};
	
	App.satellite = function() {
		var parsePositions = function(data) {
			var output = [], info;
			for(var i = 0, item; item = data[i++]; ) {
				info = item.d.split("|");
				info[9] && output.push({
					lat: info[0],
					lng: info[1],
					time: info[9]
				});
			}
			output.sort(function(a, b) {
				return a.time - b.time;
			});
			var timeNow = Math.floor(new Date().getTime() / 1000),
				diff = output[0].time, closest;
			for(var i = 0, item; item = output[i++]; ) {
				if(Math.abs(item.time - timeNow) < diff) {
					closest = item;
				}
			}
			
			App.maps.marker = closest;
			App.maps.initialize();
			
		};
		var url = "http://www.n2yo.com/sat/instant-tracking.php?s=" + SATELLITE + "&hlat=" + LAT + "&hlng=" + LNG + "&d=3600&tz=GMT-03:00";
		//TODO: should be URL instead of hardcoded version
		$.get('dummy-instant.json', function(data) {
			var data = eval(data); // FML
			parsePositions(data[0].pos);
		});
	};
	
	App.list();
	App.satellite();
	
}(jQuery, NASA));