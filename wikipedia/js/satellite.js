var Satellites = function( cb ){
	var self = this,
	satelliteList = [];
	
	self.getSatellites = function(){
		return satelliteList;
	};
	
	self.setSatellites = function(){
		var key = "0Ags17NNDNMYKdHl1MDJ0WGl6QXBieXZudG4zMDhKTXc";
	    var wid = "od6";
		$.getJSON('//spreadsheets.google.com/feeds/cells/' +
			key + '/' + wid + '/public/basic?alt=json-in-script&callback=?',function( data ){
				satelliteList = self.parseDocs( data );
			}                                                                                                                                                                      
		);
	};
	
	self.parseDocs = function( root ){
		var feed = root.feed,
		entries = feed.entry || [],
		data;
		data = [];
		for (var i = 6; i < entries.length; i = i+5) {
			var satelliteobj = new Object();
			satelliteobj.category = entries[i].content.$t;
			try{
				satelliteobj.name= entries[i+1].content.$t;
				satelliteobj.nomradId = entries[i+2].content.$t;
				satelliteobj.intCode= entries[i+3].content.$t;
				satelliteobj.launchDate = entries[i+4].content.$t;
				satelliteobj.period= entries[i+5].content.$t;
				data.push( satelliteobj );
			}	
			catch(e)
			{
			}
	    }
	    return data;
	};
	
	(function(){
		self.setSatellites();
	}());
};

var wikipedia = {
	wikiSearch : function( title,callback ){
		var wikiQuery = "//en.wikipedia.org/w/api.php?action=query&prop=revisions&titles="
		+ encodeURI(title.replace(" ","")) +"&rvprop=timestamp|user|comment|content&format=json&callback=?";
		$.getJSON( wikiQuery,function( data ){
				if ( callback ){ callback(data.query.pages, encodeURI(title)); }
			}                                                                                                                                                                      
		);
	}
};