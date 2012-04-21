var request = require('request'),
    should = require('should');

function loadJson(cb)
{
    var key = "0Ags17NNDNMYKdHl1MDJ0WGl6QXBieXZudG4zMDhKTXc";
    var wid = "od6";

    request({uri:'http://spreadsheets.google.com/feeds/cells/' + key + '/' + wid + '/public/basic?alt=json'}, function (error, response, body) {

      var data = JSON.parse(body);
      data.should.be.a('object')

      var satellites = extractDataSource(data, satellites);
      //satellites.length.should.equal(19);
      //satellites[0].category.should.equal("Brightest");
      //satellites[0].name.should.equal("IDEFIX/ARIANE 42P");

      cb(satellites)

    });
}

function extractDataSource(root) {
    var feed = root.feed,
        entries = feed.entry || [],
        satArray = [];


    for (var i = 6; i < entries.length; i = i+6) {
      
      var satellite = {};

      satellite.category = entries[i].content.$t;
      satellite.name= entries[i+1].content.$t;
      satellite.id = entries[i+2].content.$t;
      satellite.intCode= entries[i+3].content.$t;
      satellite.launchDate = entries[i+4].content.$t;
      satellite.period= entries[i+5].content.$t;
      satArray.push(satellite);

    }

    return satArray

}

module.exports = loadJson
