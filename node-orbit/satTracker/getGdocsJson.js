var request = require('request'),
    should = require('should'),
    satellites = [];

function loadJson()
{
    var key = "0Ags17NNDNMYKdHl1MDJ0WGl6QXBieXZudG4zMDhKTXc";
    var wid = "od6";

    request({uri:'http://spreadsheets.google.com/feeds/cells/' + key + '/' + wid + '/public/basic?alt=json'}, function (error, response, body) {

      var data = JSON.parse(body);

      data.should.be.a('object')

      extractDataSource(data)

      satellites.length.should.equal(140);
      satellites[0].category.should.equal("Brightest");
      satellites[0].name.should.equal("IDEFIX/ARIANE 42P");

      console.log(satellites)
        
    });
}

function extractDataSource(root) {
    var feed = root.feed;
    var entries = feed.entry || [];

    for (var i = 6; i < entries.length; i = i+6) {
      
      var satellite = {};

      satellite.category = entries[i].content.$t;

      try{
        satellite.name= entries[i+1].content.$t;
        satellite.nomradId = entries[i+2].content.$t;
        satellite.intCode= entries[i+3].content.$t;
        satellite.launchDate = entries[i+4].content.$t;
        satellite.period= entries[i+5].content.$t;
        satellites.push(satellite);
      }
      catch(e){
      }
     
    }
}

loadJson();