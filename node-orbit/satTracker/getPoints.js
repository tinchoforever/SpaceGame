var request = require('request'),
    utils = require('util');

var getOrbitPoints = function (sat, cb){

    var orbitArray = [],
        maxRetry = 10;

    request({uri:'http://www.n2yo.com/sat/jtest.php?s=' + sat}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            data.should.be.a('object')

            if(data[0].pos.length !== 0){
                data[0].id.should.equal(sat);

                for(i=0, l=data[0].pos.length;i<l;i++){
                    var temp = data[0].pos[i].d.split('|'),
                        orbitMark = [temp[0], temp[1]]
                    orbitArray.push(orbitMark)
                }

                cb(orbitArray)
                console.term('green','Request finished')

            }

        }
    });
};

var getSatPoints = function (sat, lat, lng, dur, tz, cb){
    var maxRetry = 10,
        satArray = [];

    request({uri:'http://www.n2yo.com/sat/instant-tracking.php?s='+sat+'&hlat='+lat+'&hlng='+lng+'&d='+dur+'&tz='+tz}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            data.should.be.a('object')

            if(data[0].pos.length > 2){
                data[0].id.should.equal(sat);
                for(i=0, l=data[0].pos.length;i<l;i++){
                    var temp = data[0].pos[i].d.split('|'),
                        satMark = [temp[0], temp[1], temp[9]];

                    satArray.push(satMark)
                }

                cb(satArray, data[0].id)
                console.term('green','Request finished')

            }
        }
    });
};

module.exports.getOrbitPoints = getOrbitPoints
module.exports.getSatPoints = getSatPoints
