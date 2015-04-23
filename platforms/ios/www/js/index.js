/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
	// Application Constructor
	initialize: function() {
		this.bindEvents();
		init();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady: function() {
		app.receivedEvent('deviceready');
	},
	// Update DOM on a Received Event
	receivedEvent: function(id) {
	}
};

app.initialize();

// Inits
function init(){ // Tout ce qui est lancé au chargement de la page
	signin_login();
	vertical_center();
	resize();
	$(window).resize(function(){
		resize();
	});
}

function resize(){ // Tout ce qui est lancé au resize de la page (changement d'orientation)
	vertical_center();
}

// Fonctions
function signin_login(){
	$('.signIn, .logIn, .sign_log_in,.connected,.return,.take_picture').hide();
	var contacts_done = 0;
	var news_done = 0;

	$('.div_main').hide();
	$('.div_home').show();

	var connected = false,
		phone_number = '0633086880',
		url_access = "http://rabillon.fr/";

	$.post(url_access+'functions.php',{phone_number:phone_number, what_function:'authentificate'},function(data) {

		if(data != 'KO') {
			var data = JSON.parse(data);
			$('.carte_name_name').text(data.name);
			$('.carte_pokedex_name').text(data.pokedex);
			$('.carte_right img').attr('src', data.picture);
			$('.connected').show();
		} else {
			$('.sign_log_in').show();
		}
	});

	$('.sign_log_in button').on('click', function() {

		var wut = $(this).attr('class');
		$('.sign_log_in').hide();

		if(wut == 'show_log_in') {
			$('.logIn').show();
		} else if(wut == 'show_sign_in') {
			$('.signIn').show();
		}

		$('.return').show();
	});

	$('.return').on('click', function(e) {
		e.preventDefault();

		$('.signIn, .logIn').hide();
		$('.sign_log_in').show();
		$(this).hide();
	});

	$('.signIn').on('submit', function(e) {

		$('.return').show();
		e.preventDefault();
		var data = {};

		data['sign_name'] = $(this).find('input[name=name]').val();
		data['sign_email'] = $(this).find('input[name=email]').val();
		data['sign_phone_number'] = $(this).find('input[name=phone_number]').val();
		data['sign_password'] = $(this).find('input[name=password]').val();
		data['sign_picture'] = "img/avatar.jpg";

		$.post(url_access+'functions.php',{data:data, what_function:'sign_in'},function(data) {

			if(data != 'KO') {
				var data = JSON.parse(data);
				console.log(data);

				$('.carte_name_name').text(data.name);

				if(data.pokedex != null) {
					$('.carte_pokedex_name').text(data.pokedex);
				} else {
					$('.carte_pokedex_name').text('0');
				}
				console.log('picture', data.picture);
				$('.carte_right img').attr('src', data.picture);

				// L'utilisateur arrive pour la première fois sur l'application, on le propose de se prendre en photo
				$('.take_picture').show();

				$('.signIn').hide();
			} else {
				$('.sign_log_in').show();
			}
		});
	});

	$('.logIn').on('submit', function(e) {
		$('.return').show();
		e.preventDefault();

		var data = {};
		data['log_name'] = $(this).find('input[name=name]').val();
		data['log_password'] = $(this).find('input[name=password]').val();

		$.post(url_access+'functions.php',{data:data, what_function:'log_in'},function(data) {

			if(data != 'KO') {

				$('.logIn').hide();
				var data = JSON.parse(data);
				
				$('.carte_name_name').text(data.name);
				$('.carte_pokedex_name').text(data.pokedex);
				$('.carte_right img').attr('src', data.picture);
				$('.connected').show();
			} else {
				$('.sign_log_in').show();
			}
		});
	});

	$('.pass_step').on('click', function() {
		$('.take_picture').hide();
		$('.connected').show();
	});


	$('.menu li').on('click', function() {

		$(this).parent().hide();
	});

	$('.link_news').on('click', function() {

		$('.div_main').hide();
		$('.div_news').show();

		if(news_done === 0) {

			$('.div_news').append('<div class="loading">Waiting...</div>');

			setTimeout(function() {

				$.post(url_access+'functions.php',{what_function:'news'},function(data) {

					if(data != 'KO') {

						$('.loading').remove();

						var data = JSON.parse(data);
						for (the_data in data) {
							$('.div_news').append('<p>'+data[the_data]+'</p>');
						}

						news_done = 1;

					} else {
						$('.sign_log_in').show();
					}
				});

			}, 2000);
		}
		
	});

	$('.link_contact').on('click', function() {

		$('.div_main').hide();
		$('.div_contact').show();

		if(contacts_done === 0) {

			$('.div_contact').append('<div class="loading">Waiting...</div>');

			setTimeout(function() {

				var data;

				data = contacts();

				$.post(url_access+'functions.php',{data: data, what_function:'getContacts'},function(data) {

					if(data != 'KO') {

						$('.loading').remove();

						var data = JSON.parse(data);
						console.log(data);

						if(data.length != 0) {
							for (var i = 0; i < data.length; i++) {
								$('.div_contact').append('<p>Name : '+data[i].name+' <br/>Phone number : '+data[i].phone_number+'</p>');
							}
						} else {
							$('.div_contact').append('<p>Aucun contact trouvé</p>');
						}						

						contacts_done = 1;

					} else {
						$('.sign_log_in').show();
					}
				});

			}, 2000);
		}
	});

	$('.link_geoloc').on('click', function() {

		var onSuccess = function(position) {
			var coords = "Latitude:" + position.coords.latitude;
			$('.div_geoloc').append(coords);
		    // alert('Latitude: '          + position.coords.latitude          + '\n' +
		    //       'Longitude: '         + position.coords.longitude         + '\n' +
		    //       'Altitude: '          + position.coords.altitude          + '\n' +
		    //       'Accuracy: '          + position.coords.accuracy          + '\n' +
		    //       'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
		    //       'Heading: '           + position.coords.heading           + '\n' +
		    //       'Speed: '             + position.coords.speed             + '\n' +
		    //       'Timestamp: '         + position.timestamp                + '\n');
		};

		// onError Callback receives a PositionError object
		//
		function onError(error) {
		    alert('code: '    + error.code    + '\n' +
		          'message: ' + error.message + '\n');
		}

		$('.div_main').hide();
		$('.div_geoloc').show();
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	});

}

function vertical_center(){
	$('.vertical-center').each(function(){
		var elH 	= $(this).height(),
			parentH	= $(this).parent().height(),
			calc	= (parentH / 2) - (elH / 2);
		$(this).css('margin-top',calc);
	});
}








/* Camera
-------------------- */
var pictureSource; // picture source
var destinationType; // sets the format of returned value
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
}
function onPhotoDataSuccess(imageURI) {
	//console.log(imageURI);
	var cameraImage = document.getElementById('image_taken');
	cameraImage.style.display = 'block';
	cameraImage.src = imageURI;
	var buttonSubmit = document.getElementById('image-submit');
	buttonSubmit.style.display = 'block';
	alert(imageURI);
}
function onPhotoURISuccess(imageURI) {
	//console.log(imageURI);
	var galleryImage = document.getElementById('image_taken');
	galleryImage.style.display = 'block';
	galleryImage.src = imageURI;
	var buttonSubmit = document.getElementById('image-submit');
	buttonSubmit.style.display = 'block';
	alert(imageURI);
}
function capturePhoto() {
	navigator.camera.getPicture(onPhotoDataSuccess, onFailPhoto, { quality : 100,
		destinationType : Camera.DestinationType.FILE_URI,
		sourceType : Camera.PictureSourceType.CAMERA,
		encodingType: Camera.EncodingType.JPEG,
		targetWidth: 100,
		targetHeight: 100
	});
}
function getPhoto(source) {
	navigator.camera.getPicture(onPhotoURISuccess, onFailPhoto, {
		quality: 100,
		targetWidth: 600,
		targetHeight: 600,
		destinationType: destinationType.FILE_URI,
		sourceType: source
	});
}
function onFailPhoto(message) {
	alert('Failed because: ' + message);
}


function contacts(){
	function onSuccess(contacts) {

		alert('Found ' + contacts.length + ' contacts.');

		var all_contacts = {};

	 	//for(j = 0;j < contacts.length; j++){
		// 	for(i = 0;i < contacts[j].phoneNumbers.length; i++){
		// 		all_contacts[i] = contacts[j].phoneNumbers[i].value;
		// 		all_contacts[i] = '0633086883';
		// 		return all_contacts;
		// 	}
		// }

		all_contacts[0] = "0633086883";
		return all_contacts;
	};
	function onError(contactError) {
	    alert('onError!');
	};
	$('.menu').hide();

	var options      = new ContactFindOptions();
	options.filter   = "";
	options.multiple = true;
	options.desiredFields = [navigator.contacts.fieldType.id];
	var filter = ["displayName", "name"];
	//var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name, navigator.contacts.phoneNumbers];



	navigator.contacts.find(filter, onSuccess, onError, options);
}