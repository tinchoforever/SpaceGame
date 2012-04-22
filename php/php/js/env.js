var env = function(fbApiKey){
	var self = this;
	self.fbConnected = false;
	self.fbcaption = "Testing App";
	self.fbprompt = "Share these tags with your friends on Facebook:";
	self.uid = null;
	self.accessToken = null;
	self.loadFacebook = function(){
		FB.getLoginStatus(function (response) {
			if (response.status === 'connected') {
			    // the user is logged in and connected to your
			    // app, and response.authResponse supplies
			    // the user's ID, a valid access token, a signed
			    // request, and the time the access token 
			    // and signed request each expire
			    self.uid = response.authResponse.userID;
			    self.accessToken = response.authResponse.accessToken;
				self.fbConnected = true;
			  } else if (response.status === 'not_authorized') {
			    // the user is logged in to Facebook, 
			    //but not connected to the app
			  } else {
			    // the user isn't even logged in to Facebook.
			  }
	    });
	};
	self.facebookLogin = function(permissions,callback) {
	    FB.login(callback, {
	        scope: permissions
	    });
	}
	self.facebookLogout = function(){
		FB.logout(function () {
	        window.location.reload();
	    });
	}
	self.Publish = function(){
		var attachment = {
			'caption': self.fbcaption,
			'properties': {'GuionMedio Tagger': {'text': 'guionmedio.com', 'href': window.location.href}},
			'media': [{
				'type':'image',
				'src': $("#example").attr('src'),
				'href': window.location.href
			}]
		};
		FB.ui({
		     method: 'stream.publish',
		     message: '',
		     attachment: attachment,
		     user_message_prompt: self.fbprompt
		});
	}
};