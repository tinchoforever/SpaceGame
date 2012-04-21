(function($){
	
	$('.satellite-checkin-list').on('click', 'tr', function(){
		window.location.href = $(this).data('href');
	});
	
}(jQuery));