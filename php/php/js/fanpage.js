/**
 * @fileOverview Document ready initialization renaming jQuery -> $
 * @author Tomas Roggero, Ezequiel Lauria, Martin Rabaglia
 */

var DT = function($){
	
	var self = this;
	self.placeholder = function($dom){
		$dom.each(function(){
			var input = $(this),
				value = input.attr("title");
			input.val(value);
			input.blur(function(){
				if((input.val().length === 0)){
					input.val(value);
				}
			});
			input.focus(function(){
				if(input.val()===value){
					input.val("");
				}
			});
		});
	};
	
	self.sendRequestViaMultiFriendSelector = function() {
		/*FB.ui({
			method: 'apprequests',
			message: 'My Great Request'
		}, function(response) {
			console.log('self.sendRequestViaMultiFriendSelector', arguments);
		});*/
		return $("#jfmfs-container").jfmfs({
			max_selected: 10,
			labels: {
				selected: "Seleccionado(s)",
				filter_default: "Buscar por nombre...",
				filter_title: "",
				all: "Todos",
				max_selected_message: "{0} seleccionados"
			}
		});
	};
	
	var init = function(){
		var addFriend = $("#add-unfriend"),
			postal = $("#postal"),
			homeApp = $("#home-app"),
			invitedFlow = $("#invitation-received"),
			requestReceived = $("#request_received");
		if(addFriend.length){
			self.placeholder( addFriend.find(".placeholder") );
	  		var friendsSelector = $("#select-friends");
			friendsSelector = self.sendRequestViaMultiFriendSelector();

			$('#jfmfs-friend-filter-text')
                .focus( function() {
                    if($.trim($(this).val()) == 'Buscar por nombre...') {
                        $(this).val('');
                    }
                    })
                .blur(function() {
                    if($.trim($(this).val()) == '') {
                        $(this).val('Buscar por nombre...');
                    }                        
                    });

			// Buscar por nombre...

	  		$("#submit-form").click(function(){
				//TODO change when selector is working.
	  			var ids = friendsSelector.data('jfmfs').getSelectedIds();
				
				//test users: EZE, Pistero y anny
				//var ids = ['100000170575156','1414737909','1245760933' ];
	  			
				if( ids.length > 0 ){
	  				
	  				var data = addFriend.find("form").serialize();
	  				data += "&invited_ids=" + ids.join(",");
	  				//friendsContainer.removeClass("active");
					
	  				$.post('index.php', data, function(r){
	  					if( r == 'ok' ){
	  						window.location.href = 'index.php?page=postal';
	  					}else{
	  						// ocurrio un error!
	  						//friendsContainer.addClass("active");
	  						console.log(r);
	  					}
	  				});
	  				
	  			}else{
	  				alert('Debes al menos un amigo.');
	  			}
	  			return false;
	  		});
		}
		if(postal.length){
			var postal;
			$(".postcard-overlay").bind("click",function(e){
				var url = $(this).attr("href");
				var text = $(this).attr("data-text");
				text = text.replace(/\n/g, "<br />");
				var postclass = $(this).attr("post-class");
				$(".postcardText .text").html(text);
				$(".postcardText").removeClass("post1").removeClass("post2").addClass(postclass);
				$(".postcard").attr("src",url);
				$("#mask").fadeIn(function(){
					$("#postcardOverlay").fadeIn();
				});
				e.preventDefault();
				return false;
			});
			$("#postcardOverlay > .close").bind("click",function(e){
				$("#postcardOverlay").fadeOut(function(){
					$("#mask").fadeOut();
				});
				e.preventDefault();
				return false;
			});
			$(".postal-item").click(function(){
				var postalNumber = $(this).attr("postal");
				var to = $("input[name='to_id']").val();
	  			var data = postal.find("form").serialize();
	  			data += "&selected_postal=" + postalNumber;
	  			//friendsContainer.removeClass("active");
				FB.ui({
		            method: 'apprequests',
		            message: 'Check out this application!',
		            title: 'Send your friends an application request',
					to: to
		        },
		        function (response) {
					$("#loadingmask").fadeIn();
		            if (response.request && response.to) {
		                var request_ids = [];
		                for(i=0; i<response.to.length; i++) {
		                    var temp = response.request + '_' + response.to[i];
		                    request_ids.push(temp);
		                }
		                var requests = request_ids.join(',');
						data += "&request_ids="+requests;
		                $.post('index.php', data, function(r){
			  				if( r == 'ok' ){
			  					window.location.href = 'index.php?page=thanks';
			  				}else{
								$("#loadingmask").fadeOut();
			  					// ocurrio un error!
			  					console.log(r);
			  				}
			  			});
		            }
		        });	  			
	  			return false;
	  		});
		
		
		}
		if(homeApp.length){
			$(".send-unfriend").bind("click",function(e){
				thenv.facebookLogin("publish_stream,offline_access,email,publish_actions",function(response){
					if (response.authResponse) {
							window.location.href = "index.php?page=send-unfriend";
					}
				});
				e.preventDefault();
				return false;
			});
		}
		if(requestReceived.length){
			requestReceived.find("form > a").bind("click",function(e){
				var addstr;
				var href = $(this).attr("href");
				var datatype = {};
				if($(this).hasClass("accept")){
                    addstr = "&accept=1&reject=0";
					datatype.type ="accept";
                }
				else{
                    addstr = "&accept=0&reject=1";
					datatype.type ="cancel";
                }
				thenv.facebookLogin("publish_stream,offline_access,email,publish_actions",function(response){
					if (response.authResponse) {
						var data = $("form").serialize();
			  			data += "&access_token=" + response.authResponse.accessToken+addstr;
			  			FB.ui({
				            method: 'apprequests',
				            message: 'Check out this application!',
				            title: 'Send your friends an application request',
							to: $("#inviter_id").val(),
							data:datatype
				        },
				        function (response) {
				            if (response.request && response.to) {
				                var request_ids = [];
				                for(i=0; i<response.to.length; i++) {
				                    var temp = response.request + '_' + response.to[i];
				                    request_ids.push(temp);
				                }
				                var requests = request_ids.join(',');
								data += "&type_id="+requests;
				                $.post('index.php', data, function(r){
					  				if( r == 'ok' ){
					  					window.location.href = href;
					  				}else{
					  					// ocurrio un error!
					  					console.log(r);
					  				}
					  			});
				            }
				        });
					}
					else{
						alert("Debe aceptar los permisos de la aplicacion para continuar");
					}
				});
				e.preventDefault();
				return false;
			});
		}
	};
	
	init();
};