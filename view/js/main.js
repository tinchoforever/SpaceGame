var NASA = {};

(function($, App){
	
	var toKM = function(km) {
		return (km).toFixed(1) + 'km';
	};
	
	App.checkin = function(){
		var list = $('.satellite-checkin-list'),
			template = list.html(),
			markup = [];
		if (!list || !template){
			return false;
		}
			
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
		
		var build = function(){
			list.html( markup.join('') ).removeClass('hide');
			
			list.on('click', 'tr', function(){
				window.location.href = $(this).data('href');
			});
		};
		
		console.log('Requesting...');
		$.get('http://sockets.brunolazzaro.com.ar/near/-34/-58', function(r) {
			console.log('Response received.');
			if (r[0].error) {
				// fuck it
				alert('Failure');
			} else {
				parseSatellites(r);
				build();
			}
		});
	};
	
	App.checkin();
	
	
}(jQuery, NASA));