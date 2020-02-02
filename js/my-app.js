// Initialize your app
var myApp = new Framework7({
	swipePanel: 'left',
    material: true,
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

var base_url='http://93.188.167.43/~api/';

//biar langsung load index
mainView.router.refreshPage();

//jika menu login di klik
$$('#auth-login').on('click', function(){
	//ambil token
	$$.getJSON(base_url+'request_token.php', function(result){
		// console.log(result[0]['oauth_token']);
		//memasukan data ke localStorage
		localStorage.login="true";
		localStorage.oauth_token=result[0]['oauth_token'];	
		localStorage.oauth_secret=result[0]['oauth_token_secret'];	
		window.open = cordova.InAppBrowser.open; 
		//buka browser untuk authorize user
		var ref = window.open('https://api.twitter.com/oauth/authorize?oauth_token='+localStorage.oauth_token, '_self', 'location=no');
	});
});

// fungsi untuk memanggil page
myApp.onPageInit('index', function (page) {
	myApp.showPreloader();
	 setTimeout(function () {	     			    
	  myApp.hidePreloader(); 		
	 },1000);
	$$('#trending').html('');
	var arr= new Array(); //buat array
	$$.getJSON(base_url+'trend.php', function(result){
		// console.log(result);
	  $$.each(result[0], function(i, field) {	  		  		
	  		arr.push(field);	  	
	  });
	  	console.log(arr[0]); //ambil array index awal
	 		$$.each(arr[0], function(k, isi){
	  			$$('#trending').
	  			append($$('<div class="chip">').
	  					append($$('<div class="item-inner">').
	  						append('<a href="search_trend.html?id='+encodeURIComponent(isi.name)+'" class="link">'+isi.name+'</a>')
	  				)
	  			);
	  		});      
	});
	//tombol koneksi twitter
	
});

// fungsi untuk memanggil page
myApp.onPageInit('cari', function (page) {
	myApp.showPreloader();
	 setTimeout(function () {	     			    
	  myApp.hidePreloader(); 		
	 },1000);
	$$('#cari').on('click', function(){
		//kosongkan data
		$$('#data_hasil').html('');
		var keyword=$$('#keyword').val();
		//buat loading
	    myApp.showPreloader();
	     setTimeout(function () {	     			    
	      myApp.hidePreloader(); 		
		 },1500);
		//menggunakan getJSON
		    $$.getJSON(base_url+'get_tweet.php', {keyword : keyword}, function(result){
		    	// console.log(result);
		      var arr= new Array(); //buat array
		      $$.each(result.statuses, function(i, field) { //ambil object status saja
		      		arr.push(field); //masukan object dalam array
		      });
		      	console.log(arr);
		     		$$.each(arr, function(k, isi){
			  			$$('#data_hasil').
			  			append($$('<div class="card">').
			  				append($$('<div class="card-content">').
			  					append($$('<div class="card-content-inner">').
			  						append('<a href="usertimeline.html?id='+isi.user['screen_name']+'" class="link">@'+isi.user['screen_name']+'</a> ~ '+isi.text+' <a href="reply.html?id='+encodeURIComponent(isi.user['screen_name'])+'" class="link"><i class="fa fa-reply"></i> Balas</a> <a href="#" class="link" onclick="panggil_retweet('+isi.id_str+')"><i class="fa fa-retweet"></i> Retweet</a>')
			  					)
			  				)
			  			);
			  		});      
		    });
		});	
});

// fungsi untuk memanggil page
myApp.onPageInit('post', function (page) {
	myApp.showPreloader();
	 setTimeout(function () {	     			    
	  myApp.hidePreloader(); 		
	 },1000);
	$$('#posting').on('click', function(){
		var status=$$('#status').val();
		// myApp.alert(status);
		$$.post(base_url+'tweet.php', {status : status}, function(result){
			myApp.showPreloader();
		     setTimeout(function () {	     			    
		      myApp.hidePreloader(); 		
			 },1000);
			 //kosongkan textarea
			 $$('#status').val('');
			myApp.alert('Tweet '+result,'Sukses !');
		});
	});
});

// fungsi untuk memanggil page
myApp.onPageInit('mytimeline', function (page) {//buat loading
	myApp.showPreloader();
	 setTimeout(function () {	     			    
	  myApp.hidePreloader(); 		
	 },1000);
	$$.getJSON(base_url+'home_timeline.php', function(result){
		console.log(result);
      $$.each(result, function(i, field) {
      		$$('#timelineku').
	  			append($$('<div class="card">').
	  				append($$('<div class="card-content">').
	  					append($$('<div class="card-content-inner">').
	  						append('<a href="usertimeline.html?id='+field.user['screen_name']+'" class="link">@'+field.user['screen_name']+'</a> ~ '+field.text+' <a href="reply.html?id='+encodeURIComponent(field.user['screen_name'])+'" class="link"><i class="fa fa-reply"></i> Balas</a> <a href="#" class="link" onclick="panggil_retweet('+field.id_str+')"><i class="fa fa-retweet"></i> Retweet</a>')
	  					)
	  				)
	  			);
      });     
    });
});

// fungsi untuk memanggil page
myApp.onPageInit('access', function (page) {
	$$('#confirm_pin').on('click', function(){
		var pin = $$('#pin').val();
		// console.log(pin);
		$$.getJSON(base_url+'access_token.php', {pin : pin, oauth_token : localStorage.oauth_token, oauth_secret : localStorage.oauth_secret}, function(result){
			console.log(result);
		});
	});
});

//panggil halaman user timeline
$$(document).on('page:init','.page[data-page="usertimeline"]',function(e) {
	var page=e.detail.page;
	var screen_name=page.query.id; //ambil data parameter ID

	$$('#judul_timeline').append(screen_name);

	myApp.showPreloader();
	 setTimeout(function () {	     			    
	  myApp.hidePreloader(); 		
	 },1000);

	$$.getJSON(base_url+'user_timeline.php', {screen_name : screen_name}, function(result){
		console.log(result);
		$$.each(result, function(i, field) {
      		$$('#muncul_timeline').
	  			append($$('<div class="card">').
	  				append($$('<div class="card-content">').
	  					append($$('<div class="card-content-inner">').
	  						append('<a href="usertimeline.html?id='+field.user['screen_name']+'" class="link">@'+field.user['screen_name']+'</a> ~ '+field.text+' <a href="reply.html?id='+encodeURIComponent(field.user['screen_name'])+'" class="link"><i class="fa fa-reply"></i> Balas</a> <a href="#" class="link" onclick="panggil_retweet('+field.id_str+')"><i class="fa fa-retweet"></i> Retweet</a>')
	  					)
	  				)
	  			);
      	});
	});
});

//panggil halaman user timeline
$$(document).on('page:init','.page[data-page="search_trend"]',function(e) {
	var page=e.detail.page;
	var trend=decodeURI(page.query.id); //ambil data parameter ID

	// myApp.alert(trend);

	$$('#judul_trend').append(trend);

	myApp.showPreloader();
	 setTimeout(function () {	     			    
	  myApp.hidePreloader(); 		
	 },1000);

	$$.getJSON(base_url+'get_tweet.php', {keyword : trend}, function(result){
		    	// console.log(result);
		      var arr= new Array(); //buat array
		      $$.each(result.statuses, function(i, field) { //ambil object status saja
		      		arr.push(field); //masukan object dalam array
		      });
		      	console.log(arr);
		     		$$.each(arr, function(k, isi){
			  			$$('#muncul_trend').
			  			append($$('<div class="card">').
			  				append($$('<div class="card-content">').
			  					append($$('<div class="card-content-inner">').
			  						append('<a href="usertimeline.html?id='+isi.user['screen_name']+'" class="link">@'+isi.user['screen_name']+'</a> ~ '+isi.text+' <a href="reply.html?id='+encodeURIComponent(isi.user['screen_name'])+'" class="link"><i class="fa fa-reply"></i> Balas</a> <a href="#" class="link" onclick="panggil_retweet('+isi.id_str+')"><i class="fa fa-retweet"></i> Retweet</a>')
			  					)
			  				)
			  			);
			  		});      
		    });
});

//panggil halaman reply tweet
$$(document).on('page:init','.page[data-page="reply"]',function(e) {
	var page=e.detail.page;
	var username=decodeURI(page.query.id); //ambil data parameter

	$$('#reply_area').val('@'+username+' ');

	$$('#replying').on('click', function(){
		var status=$$('#reply_area').val();
		// myApp.alert(status);
		$$.post(base_url+'tweet.php', {status : status}, function(result){
			myApp.showPreloader();
		     setTimeout(function () {	     			    
		      myApp.hidePreloader(); 		
			 },1000);
			 //kosongkan textarea
			 $$('#reply_area').val('');
			myApp.alert('Reply '+result,'Sukses !');
		});
	});
});

//untuk retweet
function panggil_retweet(id_status) {
	myApp.alert(id_status,'Sukses !');
	// $$.post('http://localhost/twitter/retweet.php', {id_status : id_status}, function(result){
	// 		myApp.showPreloader();
	// 	     setTimeout(function () {	     			    
	// 	      myApp.hidePreloader(); 		
	// 		 },1000);
	// 		myApp.alert('Retweet '+result,'Info !');
	// 	});

}