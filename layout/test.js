
function getDayNightOverlay(satmap){var cnt=0;var dayNightArray=new Array();var lngStart=satmap.getBounds().getSouthWest().lng();var latStart=satmap.getBounds().getSouthWest().lat();var latEnd=latStart;var lngEnd=satmap.getBounds().getNorthEast().lng();var j=jd();for(var i=lngStart;i<=lngEnd;i++){var dt=new Date();var LT=dt.getUTCHours()+dt.getUTCMinutes()/60;var tau=15*(LT-12);var dec=sunDecRA(1,j);var K=Math.PI/180.0;var longitude=i+tau;var tanLat=-Math.cos(longitude*K)/Math.tan(dec*K);var arctanLat=Math.atan(tanLat)/K;dayNightArray[cnt]=new GLatLng(arctanLat,i);cnt++;}dayNightArray[0]=new GLatLng(latStart,lngStart);dayNightArray[dayNightArray.length-1]=new GLatLng(latEnd,lngEnd);var polylineEncoder=new PolylineEncoder();var dumbArray=new Array();dumbArray[0]=dayNightArray;var dayNightOverlay=polylineEncoder.dpEncodeToGPolygon(dumbArray,"#7171FF",1,0.5,"#7171FF",0.5);return dayNightOverlay;}function getSunOverlay(){var j=jd();var dec=sunDecRA(1,j);var dt=new Date();var LT=dt.getUTCHours()+dt.getUTCMinutes()/60;var tau=15*(LT-12);var icon=new GIcon();icon.image="http://www.n2yo.com/img/sun.gif";icon.shadow="http://www.n2yo.com/img/shadow-sun.png";icon.iconSize=new GSize(16.0,16.0);icon.shadowSize=new GSize(25.0,16.0);icon.iconAnchor=new GPoint(8.0,8.0);icon.infoWindowAnchor=new GPoint(8.0,8.0);var sunMarker=new GMarker(new GLatLng(dec,-tau),icon);return sunMarker;}function jd(){var dt=new Date();MM=dt.getMonth()+1;DD=dt.getDate();YY=dt.getFullYear();HR=dt.getUTCHours();MN=dt.getUTCMinutes();SC=0;with(Math){HR=HR+(MN/60)+(SC/3600);GGG=1;if(YY<=1585)GGG=0;JD=-1*floor(7*(floor((MM+9)/12)+YY)/4);S=1;if((MM-9)<0)S=-1;A=abs(MM-9);J1=floor(YY+S*floor(A/7));J1=-1*floor((floor(J1/100)+1)*3/4);JD=JD+floor(275*MM/9)+DD+(GGG*J1);JD=JD+1721027+2*GGG+367*YY-0.5;JD=JD+(HR/24);}return JD;}function sunDecRA(what,jd){var PI2=2.0*Math.PI;var cos_eps=0.917482;var sin_eps=0.397778;var M,DL,L,SL,X,Y,Z,R;var T,dec,ra;T=(jd-2451545.0)/36525.0;M=PI2*frac(0.993133+99.997361*T);DL=6893.0*Math.sin(M)+72.0*Math.sin(2.0*M);L=PI2*frac(0.7859453+M/PI2+(6191.2*T+DL)/1296000);SL=Math.sin(L);X=Math.cos(L);Y=cos_eps*SL;Z=sin_eps*SL;R=Math.sqrt(1.0-Z*Z);dec=(360.0/PI2)*Math.atan(Z/R);ra=(48.0/PI2)*Math.atan(Y/(X+R));if(ra<0)ra=ra+24.0;if(what==1)return dec;else return ra;}function frac(X){X=X-Math.floor(X);if(X<0)X=X+1.0;return X;}

PolylineEncoder=function(numLevels,zoomFactor,verySmall,forceEndpoints){var i;if(!numLevels){numLevels=18;}if(!zoomFactor){zoomFactor=2;}if(!verySmall){verySmall=0.00001;}if(!forceEndpoints){forceEndpoints=true;}this.numLevels=numLevels;this.zoomFactor=zoomFactor;this.verySmall=verySmall;this.forceEndpoints=forceEndpoints;this.zoomLevelBreaks=new Array(numLevels);for(i=0;i<numLevels;i++){this.zoomLevelBreaks[i]=verySmall*Math.pow(zoomFactor,numLevels-i-1);}};PolylineEncoder.prototype.dpEncode=function(points){var absMaxDist=0;var stack=[];var dists=new Array(points.length);var maxDist,maxLoc,temp,first,last,current;var i,encodedPoints,encodedLevels;var segmentLength;if(points.length>2){stack.push([0,points.length-1]);while(stack.length>0){current=stack.pop();maxDist=0;segmentLength=Math.pow(points[current[1]].lat()-points[current[0]].lat(),2)+Math.pow(points[current[1]].lng()-points[current[0]].lng(),2);for(i=current[0]+1;i<current[1];i++){temp=this.distance(points[i],points[current[0]],points[current[1]],segmentLength);if(temp>maxDist){maxDist=temp;maxLoc=i;if(maxDist>absMaxDist){absMaxDist=maxDist;}}}if(maxDist>this.verySmall){dists[maxLoc]=maxDist;stack.push([current[0],maxLoc]);stack.push([maxLoc,current[1]]);}}}encodedPoints=this.createEncodings(points,dists);encodedLevels=this.encodeLevels(points,dists,absMaxDist);return{encodedPoints:encodedPoints,encodedLevels:encodedLevels,encodedPointsLiteral:encodedPoints.replace(/\\/g,"\\\\")}};PolylineEncoder.prototype.dpEncodeToJSON=function(points,color,weight,opacity){var result;if(!opacity){opacity=0.9;}if(!weight){weight=3;}if(!color){color="#0000ff";}result=this.dpEncode(points);return{color:color,weight:weight,opacity:opacity,points:result.encodedPoints,levels:result.encodedLevels,numLevels:this.numLevels,zoomFactor:this.zoomFactor}};PolylineEncoder.prototype.dpEncodeToGPolyline=function(points,color,weight,opacity){if(!opacity){opacity=0.9;}if(!weight){weight=3;}if(!color){color="#0000ff";}return new GPolyline.fromEncoded(this.dpEncodeToJSON(points,color,weight,opacity));};PolylineEncoder.prototype.dpEncodeToGPolygon=function(pointsArray,boundaryColor,boundaryWeight,boundaryOpacity,fillColor,fillOpacity,fill,outline){var i,boundaries;if(!boundaryColor){boundaryColor="#0000ff";}if(!boundaryWeight){boundaryWeight=3;}if(!boundaryOpacity){boundaryOpacity=0.9;}if(!fillColor){fillColor=boundaryColor;}if(!fillOpacity){fillOpacity=boundaryOpacity/3;}if(fill==undefined){fill=true;}if(outline==undefined){outline=true;}boundaries=new Array(0);for(i=0;i<pointsArray.length;i++){boundaries.push(this.dpEncodeToJSON(pointsArray[i],boundaryColor,boundaryWeight,boundaryOpacity));}return new GPolygon.fromEncoded({polylines:boundaries,color:fillColor,opacity:fillOpacity,fill:fill,outline:outline});};PolylineEncoder.prototype.distance=function(p0,p1,p2,segLength){var u,out;if(p1.lat()===p2.lat()&&p1.lng()===p2.lng()){out=Math.sqrt(Math.pow(p2.lat()-p0.lat(),2)+Math.pow(p2.lng()-p0.lng(),2));}else{u=((p0.lat()-p1.lat())*(p2.lat()-p1.lat())+(p0.lng()-p1.lng())*(p2.lng()-p1.lng()))/segLength;if(u<=0){out=Math.sqrt(Math.pow(p0.lat()-p1.lat(),2)+Math.pow(p0.lng()-p1.lng(),2));}if(u>=1){out=Math.sqrt(Math.pow(p0.lat()-p2.lat(),2)+Math.pow(p0.lng()-p2.lng(),2));}if(0<u&&u<1){out=Math.sqrt(Math.pow(p0.lat()-p1.lat()-u*(p2.lat()-p1.lat()),2)+Math.pow(p0.lng()-p1.lng()-u*(p2.lng()-p1.lng()),2));}}return out;};PolylineEncoder.prototype.createEncodings=function(points,dists){var i,dlat,dlng;var plat=0;var plng=0;var encoded_points="";for(i=0;i<points.length;i++){if(dists[i]!=undefined||i==0||i==points.length-1){var point=points[i];var lat=point.lat();var lng=point.lng();var late5=Math.floor(lat*1e5);var lnge5=Math.floor(lng*1e5);dlat=late5-plat;dlng=lnge5-plng;plat=late5;plng=lnge5;encoded_points+=this.encodeSignedNumber(dlat)+this.encodeSignedNumber(dlng);}}return encoded_points;};PolylineEncoder.prototype.computeLevel=function(dd){var lev;if(dd>this.verySmall){lev=0;while(dd<this.zoomLevelBreaks[lev]){lev++;}return lev;}};PolylineEncoder.prototype.encodeLevels=function(points,dists,absMaxDist){var i;var encoded_levels="";if(this.forceEndpoints){encoded_levels+=this.encodeNumber(this.numLevels-1)}else{encoded_levels+=this.encodeNumber(this.numLevels-this.computeLevel(absMaxDist)-1)}for(i=1;i<points.length-1;i++){if(dists[i]!=undefined){encoded_levels+=this.encodeNumber(this.numLevels-this.computeLevel(dists[i])-1);}}if(this.forceEndpoints){encoded_levels+=this.encodeNumber(this.numLevels-1)}else{encoded_levels+=this.encodeNumber(this.numLevels-this.computeLevel(absMaxDist)-1)}return encoded_levels;};PolylineEncoder.prototype.encodeNumber=function(num){var encodeString="";var nextValue,finalValue;while(num>=0x20){nextValue=(0x20|(num&0x1f))+63;encodeString+=(String.fromCharCode(nextValue));num>>=5;}finalValue=num+63;encodeString+=(String.fromCharCode(finalValue));return encodeString;};PolylineEncoder.prototype.encodeSignedNumber=function(num){var sgn_num=num<<1;if(num<0){sgn_num=~(sgn_num);}return(this.encodeNumber(sgn_num));};PolylineEncoder.latLng=function(y,x){this.y=y;this.x=x;};PolylineEncoder.latLng.prototype.lat=function(){return this.y;};PolylineEncoder.latLng.prototype.lng=function(){return this.x;};PolylineEncoder.pointsToLatLngs=function(points){var i,latLngs;latLngs=new Array(0);for(i=0;i<points.length;i++){latLngs.push(new PolylineEncoder.latLng(points[i][0],points[i][1]));}return latLngs;};PolylineEncoder.pointsToGLatLngs=function(points){var i,gLatLngs;gLatLngs=new Array(0);for(i=0;i<points.length;i++){gLatLngs.push(new GLatLng(points[i][0],points[i][1]));}return gLatLngs;};function jd(){var dt=new Date();MM=dt.getMonth()+1;DD=dt.getDate();YY=dt.getFullYear();HR=dt.getUTCHours();MN=dt.getUTCMinutes();SC=0;with(Math){HR=HR+(MN/60)+(SC/3600);GGG=1;if(YY<=1585)GGG=0;JD=-1*floor(7*(floor((MM+9)/12)+YY)/4);S=1;if((MM-9)<0)S=-1;A=abs(MM-9);J1=floor(YY+S*floor(A/7));J1=-1*floor((floor(J1/100)+1)*3/4);JD=JD+floor(275*MM/9)+DD+(GGG*J1);JD=JD+1721027+2*GGG+367*YY-0.5;JD=JD+(HR/24);}return JD;}

var dayNightOverlay = null;
var sunOverlay = null;
var drawingOverlay = null;
var footPrint;
var DURATION = 300; //seconds 
var REFRESH_DRAW = 20 //seconds
var REFRESH_DAYNIGHTSUN = 10 //seconds
var map;
var geocoder;
var firstElemIdx = 0;

var durID; var secID; var drawID; var sunID;
var TOP;
var LEFT;
var selectedSatellite = 0;
var selectedSatelliteMarker;
var keepSelectedSatCentered = false;
var drawFootPrint = true;
var cty = [];
var intTimezone_now_tzstring;
setCty();
var homeLat = '-34.608418';
var homeLng = '-58.373161';
var satlist = "25544";
var iconType = 1; // (0=small, 1=large)
var colors = new Array('#FFFF00', '#FF9900', '#FF3366', '#CC00FF', '#990000', '#669900', '#3366FF', '#000066');
$(document).ready(function()
{
	var objDate_now = new Date();
	intTimezone_now_tzstring = GetTimezoneString(objDate_now, false);
	map = new google.maps.Map($("#satmap").get(0));
	geocoder = new GClientGeocoder();
	var centerWorld = new GLatLng(0,0);
	map.addControl(new GSmallMapControl());
	map.addControl(new GMapTypeControl());
	var home = new GLatLng(homeLat,homeLng);
	map.setCenter(home, 2);
    var icon = new GIcon();
    icon.image = "http://www.n2yo.com/img/dot.gif";
    icon.iconSize = new GSize(7.0, 7.0);
    icon.iconAnchor = new GPoint(3.0, 3.0);
    icon.infoWindowAnchor = new GPoint(3.0, 3.0);
	var hMarker = new GMarker(home,icon);
	GEvent.addListener(hMarker, "mouseover", function()
	{
		var hLabel = 'Your location:\n '+homeName;
		setLabel("#home",hLabel, home);
	});
	GEvent.addListener(hMarker, "mouseout", function()
	{
		removeLabel("#home");

	});
	map.addOverlay(hMarker);
	TOP = $("#satmap").get(0).offsetTop;
	LEFT = $("#satmap").get(0).offsetLeft;
	var p = map.fromLatLngToDivPixel(centerWorld);
	//dayNightSun();
	sunID = setInterval ("dayNightSun()", REFRESH_DAYNIGHTSUN*1000);	
	//clearInterval (sunID);
	drawOrbits();
	clearInterval (drawID);
	drawID = setInterval ("drawOrbits()", REFRESH_DRAW*1000);	
	populateInstantTrk();
	clearInterval (durID); 
	durID = setInterval ("populateInstantTrk()", DURATION*1000);
	// how many satellites in satlist? if only one, initially center it
	satlist = jQuery.trim(satlist);
	setConfiguration();
	tar = satlist.split("|");
	{
		if (tar.length==1)
		{
			keepSelectedSatelliteCentered(true);
			$("#fit").attr('disabled', true);
		}
	}
});

function dayNightSun()
{
	if (dayNightOverlay != null)
	{
		map.removeOverlay(dayNightOverlay);
	}
	dayNightOverlay = getDayNightTerminator(map);
	if (dayNightOverlay)
	{
		map.addOverlay(dayNightOverlay);
	}

	
	if (sunOverlay != null)
	{
		map.removeOverlay(sunOverlay);
	}
	sunOverlay = getSunOverlay();
	map.addOverlay(sunOverlay);

}

function animateSat()
{
	var dt = new Date();
	firstElemIdx++;
	var currTime = firstElemIdx;
	
	for (i=0;i<sArray.length;i++)
	{
		if (sArray[i].ipos[currTime] != null)
		{
			var info = sArray[i].ipos[currTime];
			var coord = info.split("|");
			var mrk = sArray[i].mrk;
			mrk.show();
			var vx = round(coord[0],2);
			var vy = round(coord[1],2);
			var vz = round(coord[6],2);
			
	
			var pos = new GLatLng(coord[0],coord[1]);
			mrk.setLatLng(pos);
			sArray[i].mrk = mrk;

			if (sArray[i].id==selectedSatellite)
			{
	
				if(keepSelectedSatCentered)
				{
					map.panTo(mrk.getLatLng());

				}
				selectedSatelliteMarker.show();
				//geocoder.getLocations(pos, showAddress);
				//showLocation("city", "st", "cty");
				selectedSatelliteMarker.setLatLng(pos);
				
				updatePanel(sArray[i].name, sArray[i].id, sArray[i].int_designator, sArray[i].prn, sArray[i].period, info, currTime);
				if(drawFootPrint)
				{
					if (footPrint != null)
						map.removeOverlay(footPrint);
					footPrint = new GPolygon(footPrintArray(vz, vx, vy, 20),"#CC0000", 2, 1, "#FFA8A8", 0.2);
					var polylineEncoder = new PolylineEncoder();
					// was #00EA00
					//footPrint = polylineEncoder.dpEncodeToGPolyline(footPrintArray(vz, vx, vy, 20),"#CC0000", 1, 1); 
					map.addOverlay(footPrint);
					$("#footprint").attr('checked', true);

				}
				else
				{
					if (footPrint != null)
						map.removeOverlay(footPrint);
					$("#footprint").attr('checked', false);
				} 
			}

		}
		else
		{
			sArray[i].mrk.hide();
		}

		//GLog.write(currTime + ' ' + info);
		if (mrk != undefined)
		{
			mrk.show();
		}

	}

}
function updatePanel(name, id, int_designator, prn, period, info, currTime)
{
	var d = new Date();
	d.setTime(currTime*1000);
	var coord = info.split("|");
	var city = coord[13]; var country = coord[12]; var region = coord[14];
showLocation(city, region, country);
	var vx = round(coord[0],2);
	var vy = round(coord[1],2);
	var vz = round(coord[6],2);
	var sp = round(coord[7],2);
	var ra = coord[4];
	var dec = coord[5];
	var az = round(coord[2],1);
	var el = round(coord[3],1);
	var ut = addZero(d.getUTCHours()) + ':' + addZero(d.getUTCMinutes()) + ':' + addZero(d.getUTCSeconds());
	//var ut = d.getUTCHours() + ':' + d.getUTCMinutes() + ':' + d.getUTCSeconds();
	//var lt = d.toTimeString();;
	var lt = addZero(d.getHours())+':'+addZero(d.getMinutes())+':'+addZero(d.getSeconds());
	$("#localtime").html(lt);
	$("#utctime").html(ut);
	$("#satname").html('<a href="/satellite/?s='+id+'">'+name+'</a>');
	$("#satlat").html(vx);
	$("#satlng").html(vy);
	$("#sataltkm").html(vz);
	$("#sataltmi").html(round(0.6213712*vz,2));
	$("#satspdkm").html(sp);
	$("#satspdmi").html(round(0.6213712*sp,2));
	$("#satra").html(getFormatedRA(ra));
	$("#satdec").html(getFormatedDec(dec));
	$("#sataz").html(az);
	$("#period").html(round(period/60,3)+'m');
	if (period<4*3600)
	{
		$("#prediction").html('<a href=http://www.n2yo.com/passes/?s='+id+'><b>5 DAY PREDICTIONS &#187;</b></a>');
	}
	else
	{
		$("#prediction").html('&nbsp;');
	}

	if (el>0)
		$("#satel").html('+'+el);
	else
		$("#satel").html(el);
	$("#satazcmp").html(getAzCompass(az));
	if (el>0)
	{
		$("#satel").css({"font-weight" : "normal", "color" : "#000000", "background" : "#FFFF00", "border" : "1px solid #000000"});		
		$("#sataz").css({"font-weight" : "normal", "color" : "#000000", "background" : "#FFFF00", "border" : "1px solid #000000"});		
		$("#satazcmp").css({"font-weight" : "normal", "color" : "#000000", "background" : "#FFFF00", "border" : "1px solid #000000"});
	}
	else
	{
		$("#satel").css({"font-weight" : "normal", "color" : "#000000", "background" : "#FFFFFF", "border" : "0px"});		
		$("#sataz").css({"font-weight" : "normal", "color" : "#000000", "background" : "#FFFFFF", "border" : "0px"});	
		$("#satazcmp").css({"font-weight" : "normal", "color" : "#000000", "background" : "#FFFFFF", "border" : "0px"});	
	}

	if(coord[10] == 1)
	{
		$("#satshadow").html("The satellite is in Earth's shadow");
		$("#satshadow").css({"font-weight" : "bold", "color" : "#FFFFFF", "background" : "#7E7E7E"});
	}
	else
	{
		$("#satshadow").html("The satellite is in day light");
		$("#satshadow").css({"font-weight" : "normal", "color" : "#000000", "background" : "#FFFF00", "border" : "1px solid #000000"});
	}

	//GLog.write(int_designator + ' ' + info);
}
function addZero(x)
{
	if (x<10)
		return '0'+x;
	else
		return x;
}

function round(number,X) { 
	//
X = (!X? 2 : X); 
return Math.round(number*Math.pow(10,X))/Math.pow(10,X); 
}
function getAzCompass(deg)
{
	var a=0;
	if((deg>a)&&(deg<a+15))
		return 'N';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'NNE';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'NE';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'NE';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'ENE';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'E';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'E';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'ESE';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'SE';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'SE';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'SSE';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'S';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'S';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'SSW';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'SW';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'SW';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'WSW';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'W';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'W';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'WNW';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'NW';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'NW';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'NNW';
	a=a+15;
	if((deg>a)&&(deg<a+15))
		return 'N';
	a=a+15;
}
function setLabel(element, text, coord)
{
	var yoffset = -20;
	var xoffset = 0;
	var pnt = map.fromLatLngToContainerPixel(coord);
	$(element).css('visibility', 'visible'); 
	$(element).css('position', 'absolute'); 
	$(element).css('top', TOP+pnt.y+yoffset); 
	$(element).css('left', LEFT+pnt.x+xoffset); 
	$(element).html(text); 
}
function removeLabel(element)
{
	$(element).css('visibility', 'hidden');
}
function populateInstantTrk()
{
	var r = Math.random() * Date.parse(new Date());
	var url = "test.php?s="+satlist+"&hlat="+homeLat+"&hlng="+homeLng+"&d="+DURATION+"&r="+r+"&tz=" + intTimezone_now_tzstring;
	$.ajax({
		url:url,
		type: "get",
		error: function(data){
			console.log(data);
		},
		success: function(data){
			console.log(data);
			//GLog.write("Instant data retrieved!");
			for (i=0;i<sArray.length;i++)
			{
				for (j=0;j<data[i].pos.length;j++)
				{
					var valArray =  data[i].pos[j].d.split('|');
					var tm = valArray[9];
					sArray[i].ipos[tm] = data[i].pos[j].d;
				}
				// Now add the GMarker to the sArray object
				var mrk = createSatelliteMarker(sArray[i].id);

				if (sArray[i].mrk != null)
				{
					// remove the old marker
					map.removeOverlay(sArray[i].mrk);
					if (selectedSatelliteMarker != null)
						map.removeOverlay(selectedSatelliteMarker);
				}
				sArray[i].mrk = mrk;
				map.addOverlay(mrk);
				sMarker.hide();
				if (selectedSatellite == 0)
				{
					selectedSatellite = sArray[0].id 
				}

				if(sArray.id == selectedSatellite)
					sArray.sel = 1;
				else 
					sArray.sel = 0;

			}

			selectedSatelliteMarker = createSelectedMarker();
			map.addOverlay(selectedSatelliteMarker);
			selectedSatelliteMarker.hide();
			//sArray must be filled by now. Start animation!
			clearInterval (secID);
			firstElemIdx = sArray[0].ipos.length - DURATION;
			secID = setInterval ("animateSat()", 1000);
		}
	});

}

function showAddress(response)
{
	var statusCode = response.Status.code;
	if (statusCode == 200)
	{
		var place = response.Placemark[0];
		var country = '';
		var state = '';
		var city = '';
		var address = response.address;
		if (place.AddressDetails.Country != null)
		{
			country = place.AddressDetails.Country.CountryNameCode;
			if (place.AddressDetails.Country.AdministrativeArea != null)
			{
				state = place.AddressDetails.Country.AdministrativeArea.AdministrativeAreaName;
				if (place.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea != null)
				{
					city = place.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.SubAdministrativeAreaName;
				}
			}
		}

		//GLog.write(address);
		var text = 'Currently over ' + city + ' ' + state + ', ' + cty[country];
		$("#satover").html(text);

	}
	else
	{
		$("#satover").html('Retrieving data...');
		//GLog.write(statusCode);
	}
}


function showLocation(city, state, country)
{
	if (city != "")
	{
		//GLog.write(address);
		var text = "";
		if (country=="USA") text = 'Currently over ' + city + ' ' + state + ', ' + country;
		else text = 'Currently over ' + city + ', ' + country;
		$("#satover").html(text);

	}
	else
	{
		$("#satover").html('Retrieving data...');
		//GLog.write(statusCode);
	}
}

function drawOrbits()
{
	
	for (i=0;i<sArray.length;i++)
	{
		var oldDrawingOverlay = sArray[i].orb;
		if (oldDrawingOverlay != null)
		{
			map.removeOverlay(oldDrawingOverlay);

			var orb = [];
			for (j=0;j<sArray[i].pos.length;j++)
			{
				var dt = sArray[i].pos[j].d;
				var coord = dt.split("|");
				orb.push(new GLatLng(coord[0],coord[1]));
			}
			var polylineEncoder = new PolylineEncoder();
			var c = i%8;
			var drawingOverlay = polylineEncoder.dpEncodeToGPolyline(orb, colors[c], 1, 1); 
			map.addOverlay(drawingOverlay);
			sArray[i].orb = drawingOverlay;
		}

	}
	
	if ($('#orbit:checked').val() == 'on')
	{
		showHideOrbits(true);
	}
	else 
	{
		showHideOrbits(false);
	}
}

function showHideOrbits(flag)
{

	if (!flag)
	{
		for (i=0;i<sArray.length;i++)
		{
			var drawingOverlay = sArray[i].orb;
				
			if (drawingOverlay != null)
			{
				drawingOverlay.hide();
			}

		}
	}
	if (flag)
	{
		for (i=0;i<sArray.length;i++)
		{
			var drawingOverlay = sArray[i].orb;
			if (drawingOverlay != null)
			{
				drawingOverlay.show();
			}
		}
	}
	$("#orbit").attr('checked', flag);
}

function fitMap(){
	var pts = [];
	for (i=0;i<sArray.length;i++)
	{
		sArray[i].mrk;
		pts.push(sArray[i].mrk.getLatLng());
	}
	var bounds = new GLatLngBounds();
	for (var i=0; i<pts.length; i++) 
	{
		bounds.extend(pts[i]);
	}
	map.setZoom(map.getBoundsZoomLevel(bounds));
	map.setCenter(bounds.getCenter());
}

function keepSelectedSatelliteCentered(flag)
{
	if (flag)
	{
		map.setZoom(4);
		keepSelectedSatCentered = true;
	}
	else
	{
		keepSelectedSatCentered = false;
	}
	$("#keepcenter").attr('checked', flag);
}

function getDayNightTerminator(satmap)
{

	var cnt = 0;
	var dayNightArray = new Array();

	var lngStart = satmap.getBounds().getSouthWest().lng();
	var latStart = satmap.getBounds().getSouthWest().lat();
	var latEnd = latStart;
	var lngEnd = satmap.getBounds().getNorthEast().lng();
	var j = jd();
	lngStart = -180;
	lngEnd = 180;
	for (var i=lngStart; i<=lngEnd; i++) 
	{
		var dt = new Date();
		var LT = dt.getUTCHours() + dt.getUTCMinutes()/60;
		var tau = 15*(LT-12);
		var dec = sunDecRA(1,j);
		var K = Math.PI/180.0;
		var longitude=i+tau;
		var tanLat = - Math.cos(longitude*K)/Math.tan(dec*K);						
		var arctanLat = Math.atan(tanLat)/K;
		dayNightArray[cnt]=new GLatLng(arctanLat,i);
		cnt++;
	}


	var polylineEncoder = new PolylineEncoder();
	var dumbArray = new Array();

	dayNightOverlay = polylineEncoder.dpEncodeToGPolyline(dayNightArray, "#7171FF", 10, 0.3); 
			//GLog.write(dayNightOverlay);
	return dayNightOverlay;
}



function createSelectedMarker()
{

	var centerWorld = new GLatLng(0,0);
	var icCircle = new GIcon();
	icCircle.image = "http://www.n2yo.com/img/selection.gif";
	icCircle.iconSize = new GSize(40, 40);
	icCircle.iconAnchor = new GPoint(20, 20);
	icCircle.infoWindowAnchor = new GPoint(0, 15);
	var selMarker = new GMarker(centerWorld, icCircle);
	return selMarker;
}

function createSatelliteMarker(id)
{
	var centerWorld = new GLatLng(0,0);
    var icon = new GIcon();
//    icon.image = "http://www.n2yo.com/img/icons/"+id+".gif";
	icon.image = "http://www.n2yo.com/inc/saticon.php?t=0&s="+id;
    icon.shadow = "http://www.n2yo.com/inc/saticon.php?t=1&s="+id;
	if (iconType==0)
	{
		icon.iconSize = new GSize(16.0, 16.0);
		icon.shadowSize = new GSize(25.0, 16.0);
		icon.iconAnchor = new GPoint(8.0, 8.0);
		icon.infoWindowAnchor = new GPoint(8.0, 8.0);
	}
	if (iconType==1)
	{
		icon.iconSize = new GSize(30.0, 30.0);
		icon.shadowSize = new GSize(50.0, 32.0);
		icon.iconAnchor = new GPoint(15.0, 15.0);
		icon.infoWindowAnchor = new GPoint(15.0, 15.0);
	}
	sMarker = new GMarker(centerWorld, icon);

	GEvent.addListener(sMarker, "mouseover", function()
	{
		for (i=0;i<sArray.length;i++)
		{
			var st = sArray[i];
			if (st.id==id)
			{
				var pos = st.mrk.getLatLng();
				var mapBounds = map.getBounds();
				if(mapBounds.containsLatLng(pos))
				{
					setLabel("#selection",st.name, pos);
					break;
				}
			}
		}
	});
	GEvent.addListener(sMarker, "mouseout", function()
	{
		for (i=0;i<sArray.length;i++)
		{
			var st = sArray[i];
			if (st.id==id)
			{
				removeLabel("#selection");
				break;
			}
		}
	});
	GEvent.addListener(sMarker, "click", function()
	{
		for (i=0;i<sArray.length;i++)
		{
			var st = sArray[i];
			if (st.id==id)
			{	sArray[i].sel=1;
				selectedSatellite=id;
			}
			else
			{
				sArray[i].sel=0;
			}
		}
	});
	return sMarker;

}


function InstantPosition(a,b,c,d,e)
{
	this.latLng = a;
	this.az = b;
	this.el = c;
	this.sp = d;
	this.alt = e;
}

function footPrintArray(salt, lat1, lon1, points)
{
	var parr = new Array();
	re=6375;
	k = re/(re+salt);

	max=Math.acos(k) - (0.1 * 3.141)/180;	// protection 0.01 degrees to avoid an exception
	var dg = max/points;
	//K I
	for (i=0; i<points; i++)
	{
		lat2 = (lat1 * 3.141)/180 - max + i*dg;
		gamma = (lon1 * 3.141)/180;
		var alfa = Math.sin((lat1 * 3.141)/180);
		var beta = Math.cos((lat1 * 3.141)/180);
		lon2 = gamma - Math.acos((k-alfa*Math.sin (lat2))/(beta*Math.cos(lat2)));
		//alert((lon2*180)/3.14);
		parr[i] = new GLatLng((lat2*180)/3.14, (lon2*180)/3.14);
	}
	//K II
	for (i=0; i<points; i++)
	{
		lat2 = (lat1 * 3.141)/180 + i*dg;
		gamma = (lon1 * 3.141)/180;
		var alfa = Math.sin((lat1 * 3.141)/180);
		var beta = Math.cos((lat1 * 3.141)/180);
		lon2 = gamma - Math.acos((k-alfa*Math.sin (lat2))/(beta*Math.cos(lat2)));
		//alert((lon2*180)/3.14);
		parr[points+i] = new GLatLng((lat2*180)/3.14, (lon2*180)/3.14);
	}
	//K III
	for (i=0; i<points; i++)
	{
		lat2 = (lat1 * 3.141)/180 + max-i*dg;
		gamma = (lon1 * 3.141)/180;
		var alfa = Math.sin((lat1 * 3.141)/180);
		var beta = Math.cos((lat1 * 3.141)/180);
		lon2 = gamma + Math.acos((k-alfa*Math.sin (lat2))/(beta*Math.cos(lat2)));
		//alert((lon2*180)/3.14);
		parr[2*points+i] = new GLatLng((lat2*180)/3.14, (lon2*180)/3.14);
	}
	//K IV
	for (i=0; i<points; i++)
	{
		lat2 = (lat1 * 3.141)/180 -i*dg;
		gamma = (lon1 * 3.141)/180;
		var alfa = Math.sin((lat1 * 3.141)/180);
		var beta = Math.cos((lat1 * 3.141)/180);
		lon2 = gamma + Math.acos((k-alfa*Math.sin (lat2))/(beta*Math.cos(lat2)));
		//alert((lon2*180)/3.14);
		parr[3*points+i] = new GLatLng((lat2*180)/3.14, (lon2*180)/3.14);
	}
parr[4*points] = parr[0];
return parr;
}
function getFormatedRA(ra)
{
	ra1 = (ra*24)/360;
	rah=Math.floor(ra1);
	ra2=ra1%1;
	ram=Math.floor(ra2*60);
	ra3=(ra2*60)%1;
	ras=Math.floor(ra3*60);
	var rastr = rah + 'h ' + ram + 'm ' + ras + 's ';
	return rastr;
}

function getFormatedDec(dec)
{
	dech=Math.floor(dec);
	dec2=dec%1;
	dec2=Math.abs(dec2);
	decm=Math.floor(dec2*60);
	dec3=(dec2*60)%1;
	decs=Math.floor(dec3*60);
	var decstr = dech + "&deg; " + decm + "' " + decs + "'' ";
	return decstr;
}
/*
function fillInterpolatedData()
{
	for (i=0;i<sArray.length;i++)
	{
		var xxx = new Array();
		for (j=0;j<sArray[i].pos.length-1;j++)
		{
			var valArray0 =  sArray[i].pos[0].d.split('|');
			var valArray1 =  sArray[i].pos[1].d.split('|');
			var dt = valArray1[3] - valArray0[3];

			var valArray =  sArray[i].pos[j].d.split('|');
			var valArrayNext =  sArray[i].pos[j+1].d.split('|');
			var dLat = (valArrayNext[0] - valArray[0])/dt;
			var dLng = (valArrayNext[1] - valArray[1])/dt;
			
			//to do - azimuth and elevation
			
			var dSp = (valArrayNext[4] - valArray[4])/dt;
			var dAlt = (valArrayNext[2] - valArray[2])/dt;

			var idx = valArray[3];

			for (k=0;k<dt;k++)
			{
				xxx[idx+k] = new InstantPosition(new GLatLng(valArray[0]+dLat,valArray[1]+dLng),0,0,valArray[4]+dSp,valArray[2]+dAlt);
			}

		}
		sArray[i].ipos = xxx;
	}
}
*/

function setConfiguration()
{
	showHideOrbits(true); // true = show by default
	keepSelectedSatelliteCentered(false); // true = keep it centered by default
	drawFootPrint = false; // true = draw footprint by default
}

function GetTimezoneString(objInputDate, blnJsDateCompat) {
	var objDate = new Date(objInputDate);

	var intDateTZ				= objDate.getTimezoneOffset();
	var strDateTZ_sign			= (intDateTZ > 0 ? "-" : "+")
	var intDateTZ_hours			= Math.floor(Math.abs(intDateTZ) / 60);
	var intDateTZ_minutes		= Math.abs(intDateTZ_hours - (Math.abs(intDateTZ) / 60)) * 60;
	var strDateTZ_normalised	= (blnJsDateCompat ? "UTC" : "GMT") + strDateTZ_sign + PrefixChar(intDateTZ_hours, "0", 2) + (blnJsDateCompat ? "" : ":") + PrefixChar(intDateTZ_minutes, "0", 2);

	return strDateTZ_normalised;
}

function PrefixChar(strValue, strCharPrefix, intLength) {
	var intStrValue_length = String(strValue).length;
	if (intStrValue_length < intLength) {
		for (var intI=0; intI<(intLength-intStrValue_length); ++intI) {
			strValue = strCharPrefix + strValue;
		}
	}
	return strValue;
}

function setCty()
{
	cty["AF"]="Afghanistan [Islamic St.]";
	cty["AL"]="Albania";
	cty["DZ"]="Algeria";
	cty["AS"]="American Samoa";
	cty["AD"]="Andorra";
	cty["AO"]="Angola";
	cty["AI"]="Anguilla";
	cty["AQ"]="Antarctica";
	cty["AG"]="Antigua and Barbuda";
	cty["AR"]="Argentina";
	cty["AM"]="Armenia";
	cty["AW"]="Aruba";
	cty["AC"]="Ascension Island";
	cty["AU"]="Australia";
	cty["AT"]="Austria";
	cty["AZ"]="Azerbaidjan";
	cty["BS"]="Bahamas";
	cty["BH"]="Bahrain";
	cty["BD"]="Bangladesh";
	cty["BB"]="Barbados";
	cty["BY"]="Belarus";
	cty["BE"]="Belgium";
	cty["BZ"]="Belize";
	cty["BJ"]="Benin";
	cty["BM"]="Bermuda";
	cty["BT"]="Bhutan";
	cty["BO"]="Bolivia";
	cty["BA"]="Bosnia-Herzegovina";
	cty["BW"]="Botswana";
	cty["BV"]="Bouvet Island";
	cty["BR"]="Brazil";
	cty["IO"]="British Indian O. Ter.";
	cty["BN"]="Brunei Darussalam";
	cty["BG"]="Bulgaria";
	cty["BF"]="Burkina Faso";
	cty["BI"]="Burundi";
	cty["KH"]="Cambodia";
	cty["CM"]="Cameroon";
	cty["CA"]="Canada";
	cty["CV"]="Cape Verde";
	cty["KY"]="Cayman Islands";
	cty["CF"]="Central African Rep.";
	cty["TD"]="Chad";
	cty["CL"]="Chile";
	cty["CN"]="China";
	cty["CX"]="Christmas Island";
	cty["CC"]="Cocos [Keeling] Isl.";
	cty["CO"]="Colombia";
	cty["KM"]="Comoros";
	cty["CG"]="Congo";
	cty["CK"]="Cook Islands";
	cty["CR"]="Costa Rica";
	cty["HR"]="Croatia";
	cty["CU"]="Cuba";
	cty["CY"]="Cyprus";
	cty["CZ"]="Czech Republic";
	cty["ZR"]="Dem. Rep. of Congo";
	cty["DK"]="Denmark";
	cty["DJ"]="Djibouti";
	cty["DM"]="Dominica";
	cty["DO"]="Dominican Republic";
	cty["TP"]="East Timor";
	cty["EC"]="Ecuador";
	cty["EG"]="Egypt";
	cty["SV"]="El Salvador";
	cty["GQ"]="Equatorial Guinea";
	cty["ER"]="Eritrea";
	cty["EE"]="Estonia";
	cty["ET"]="Ethiopia";
	cty["FK"]="Falkland Isl . [Malvinas]";
	cty["FO"]="Faroe Islands";
	cty["FJ"]="Fiji";
	cty["FI"]="Finland";
	cty["FR"]="France";
	cty["FX"]="France [European Ter.]";
	cty["TF"]="French Southern Terr.";
	cty["GA"]="Gabon";
	cty["GM"]="Gambia";
	cty["GE"]="Georgia";
	cty["DE"]="Germany";
	cty["GH"]="Ghana";
	cty["GI"]="Gibraltar";
	cty["GB"]="Great Britain [UK]";
	cty["GR"]="Greece";
	cty["GL"]="Greenland";
	cty["GD"]="Grenada";
	cty["GP"]="Guadeloupe [Fr.]";
	cty["GU"]="Guam [US]";
	cty["GT"]="Guatemala";
	cty["GG"]="Guernsey [Ch. Isl.]";
	cty["GF"]="Guiana [Fr.]";
	cty["GN"]="Guinea";
	cty["GW"]="Guinea Bissau";
	cty["GY"]="Guyana";
	cty["HT"]="Haiti";
	cty["HM"]="Heard & McDonald Isl.";
	cty["HN"]="Honduras";
	cty["HK"]="Hong Kong";
	cty["HU"]="Hungary";
	cty["IS"]="Iceland";
	cty["IN"]="India";
	cty["ID"]="Indonesia";
	cty["IR"]="Iran";
	cty["IQ"]="Iraq";
	cty["IE"]="Ireland";
	cty["IM"]="Isle of Man";
	cty["IL"]="Israel";
	cty["IT"]="Italy";
	cty["CI"]="Ivory Coast";
	cty["JM"]="Jamaica";
	cty["JP"]="Japan";
	cty["JE"]="Jersey [Ch. Isl.]";
	cty["JO"]="Jordan";
	cty["KZ"]="Kazakstan";
	cty["KE"]="Kenya";
	cty["KI"]="Kiribati";
	cty["KP"]="Korea [north]";
	cty["KR"]="Korea [South]";
	cty["KW"]="Kuwait";
	cty["KG"]="Kyrgyz Republic";
	cty["LA"]="Laos";
	cty["LV"]="Latvia";
	cty["LB"]="Lebanon";
	cty["LS"]="Lesotho";
	cty["LR"]="Liberia";
	cty["LY"]="Libya";
	cty["LI"]="Liechtenstein";
	cty["LT"]="Lithuania";
	cty["LU"]="Luxembourg";
	cty["MO"]="Macau";
	cty["MK"]="Macedonia [former Yug.]";
	cty["MG"]="Madagascar";
	cty["MW"]="Malawi";
	cty["MY"]="Malaysia";
	cty["MV"]="Maldives";
	cty["ML"]="Mali";
	cty["MT"]="Malta";
	cty["MH"]="Marshall Islands";
	cty["MQ"]="Martinique [Fr.]";
	cty["MR"]="Mauritania";
	cty["MU"]="Mauritius";
	cty["YT"]="Mayotte";
	cty["MX"]="Mexico";
	cty["FM"]="Micronesia";
	cty["MD"]="Moldova";
	cty["MC"]="Monaco";
	cty["MN"]="Mongolia";
	cty["MS"]="Montserrat";
	cty["MA"]="Morocco";
	cty["MZ"]="Mozambique";
	cty["MM"]="Myanmar";
	cty["NA"]="Namibia";
	cty["NR"]="Nauru";
	cty["NP"]="Nepal";
	cty["AN"]="Netherland Antilles";
	cty["NL"]="Netherlands";
	cty["NC"]="New Caledonia [Fr.]";
	cty["NZ"]="New Zealand";
	cty["NI"]="Nicaragua";
	cty["NE"]="Niger";
	cty["NG"]="Nigeria";
	cty["NU"]="Niue";
	cty["NF"]="Norfolk Island";
	cty["MP"]="Northern Mariana Isl.";
	cty["NO"]="Norway";
	cty["OM"]="Oman";
	cty["PK"]="Pakistan";
	cty["PW"]="Palau";
	cty["PA"]="Panama";
	cty["PG"]="Papua New Guinea";
	cty["PY"]="Paraguay";
	cty["PE"]="Peru";
	cty["PH"]="Philippines";
	cty["PN"]="Pitcairn";
	cty["PL"]="Poland";
	cty["PF"]="Polynesia [Fr.]";
	cty["PT"]="Portugal";
	cty["PR"]="Puerto Rico";
	cty["QA"]="Qatar";
	cty["CD"]="Rep. Dem. Congo";
	cty["RE"]="Reunion [Fr.]";
	cty["RO"]="Romania";
	cty["RU"]="Russian Federation";
	cty["RW"]="Rwanda";
	cty["LC"]="Saint Lucia";
	cty["SM"]="San Marino";
	cty["SA"]="Saudi Arabia";
	cty["SN"]="Senegal";
	cty["SC"]="Seychelles";
	cty["SL"]="Sierra Leone";
	cty["SG"]="Singapore";
	cty["SK"]="Slovakia [Slovak Rep]";
	cty["SI"]="Slovenia";
	cty["SB"]="Solomon Islands";
	cty["SO"]="Somalia";
	cty["ZA"]="South Africa";
	cty["GS"]="South Georgia and South Sandwich Islands";
	cty["SU"]="Soviet Union";
	cty["ES"]="Spain";
	cty["LK"]="Sri Lanka";
	cty["SH"]="St. Helena";
	cty["KN"]="St. Kitts Nevis Anguilla";
	cty["PM"]="St. Pierre & Miquelon";
	cty["ST"]="St. Tome and Principe";
	cty["VC"]="St. Vincent & Grenadines";
	cty["SD"]="Sudan";
	cty["SR"]="Suriname";
	cty["SJ"]="Svalbard & Jan Mayen Isl.";
	cty["SZ"]="Swaziland";
	cty["SE"]="Sweden";
	cty["CH"]="Switzerland";
	cty["SY"]="Syria";
	cty["TJ"]="Tadjikistan";
	cty["TW"]="Taiwan";
	cty["TZ"]="Tanzania";
	cty["TH"]="Thailand";
	cty["TG"]="Togo";
	cty["TK"]="Tokelau";
	cty["TO"]="Tonga";
	cty["TT"]="Trinidad & Tobago";
	cty["TN"]="Tunisia";
	cty["TR"]="Turkey";
	cty["TM"]="Turkmenistan";
	cty["TC"]="Turks & Caicos Islands";
	cty["TV"]="Tuvalu";
	cty["UG"]="Uganda";
	cty["UA"]="Ukraine";
	cty["AE"]="United Arab Emirates";
	cty["UY"]="Uruguay";
	cty["UM"]="US Minor Outlying Isl.";
	cty["US"]="USA";
	cty["UZ"]="Uzbekistan";
	cty["VU"]="Vanuatu";
	cty["VA"]="Vatican City State";
	cty["VE"]="Venezuela";
	cty["VN"]="Vietnam";
	cty["VG"]="Virgin Islands [Brit]";
	cty["VI"]="Virgin Islands [US]";
	cty["WF"]="Wallis&Futuna Islands";
	cty["EH"]="Western Sahara";
	cty["WS"]="Western Samoa";
	cty["YE"]="Yemen";
	cty["YU"]="Yugoslavia";
	cty["ZM"]="Zambia";
	cty["ZW"]="Zimbabwe";
}