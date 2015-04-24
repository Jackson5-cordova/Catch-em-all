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

var url_access = "http://rabillon.fr/";

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
		StatusBar.hide();
		check_con();
	},
	// Update DOM on a Received Event
	receivedEvent: function(id) {
	}
};

app.initialize();

// Inits
function init(){ // Tout ce qui est lancé au chargement de la page
	vertical_center();
	resize();
	menu();
	$(window).resize(function(){
		resize();
	});
}

function resize(){ // Tout ce qui est lancé au resize de la page (changement d'orientation)
	vertical_center();
}

var connected = false;

// Fonctions
function menu(){
	$('.menu-toggle').click(function(){
		$('.menu').slideToggle();
	});
}
var numeros;
function contact(){
	$('.div_contact').html('<h2>Contacts</h2>').append('<div class="loading">Chargement...</div>');

	setTimeout(function() {
		contacts(function() {
			$.post(url_access+'functions.php',{data: numeros, what_function:'getContacts'},function(data) {
				console.log(data);

				if(data != 'KO') {
					$('.loading').remove();
					var data = JSON.parse(data);

					if(data.length != 0) {
						$('.div_contact').append('<h3>Des contacts ont été trouvés !</h3>');
						$('.div_contact').append('Voici vos amis qui jouent à l\'application !<br /><br /><br />');
						for (var i = 0; i < data.length; i++) {
							$('.div_contact').append('<p>Name : '+data[i].name+' <br/>Phone number : '+data[i].phone_number+'</p>');
							// $('.div_contact').append('<p><button>Ajouter en ami</button></p>');
						}
					} else {
						$('.div_contact').append('<p>Aucun contact trouvé</p>');
					}

				} else {
					alert('erreur');
				}
			});
		});

		
	}, 2000);
}

function contacts(callback){
	function onSuccess(contacts) {
		console.log(contacts.length + ' contacts trouvés.');

		var all_contacts = {};

	 	for(i = 0;i < contacts.length; i++){
			for(j = 0;j < contacts[i].phoneNumbers.length; j++){
				all_contacts[j] = contacts[i].phoneNumbers[j].value;
				console.log(all_contacts);
			}
		}
		numeros = all_contacts;
		callback();
	};
	function onError(contactError) {
	    alert('onError!');
	};
	var options      = new ContactFindOptions();
	options.filter   = "";
	options.multiple = true;
	options.desiredFields = [navigator.contacts.fieldType.phoneNumbers];
	var filter = ["displayName", "name"];
	//var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name, navigator.contacts.phoneNumbers];

	navigator.contacts.find(filter, onSuccess, onError, options);
}

function news(){
	var news_done = 0;

	if(news_done === 0) {
		$('.div_news').html('<h2>News</h2>').append('<div class="loading">Chargement...</div>');
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
}

function geolocalisation(){
	var onSuccess = function(position) {
		$('.div_geoloc').append('<h3>Votre localisation a été trouvée !</h3>');
		$('.div_geoloc').append('<p>Latitude : '+position.coords.latitude+'</p>');
		$('.div_geoloc').append('<p>Longitude : '+position.coords.longitude+'</p><br /><br /><br />');
		$('.div_geoloc').append('<p>Il n\'y a pas de Pokémons autour de vous en ce moment mais restez aux aguets !</p>');
		$('.div_geoloc').append('<a href="geoloc.html" class="button">Me géolocaliser une nouvelle fois</a>');
	    // alert('Latitude: '          + position.coords.latitude          + '\n' +
	    //       'Longitude: '         + position.coords.longitude         + '\n' +
	    //       'Altitude: '          + position.coords.altitude          + '\n' +
	    //       'Accuracy: '          + position.coords.accuracy          + '\n' +
	    //       'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
	    //       'Heading: '           + position.coords.heading           + '\n' +
	    //       'Speed: '             + position.coords.speed             + '\n' +
	    //       'Timestamp: '         + position.timestamp                + '\n');
	};
	function onError(error) {
	    alert('code: '    + error.code    + '\n' +
	          'message: ' + error.message + '\n');
	}
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function check_con(){
	var check_connection = checkConnection();

	if(check_connection) {
		$('.div_home').append('Vous avez une connexion internet !');
	} else {
		$('.div_home').append('Vous n\'avez pas de connexion internet !');
	}
}


function home(){
	$('.connected, .take_picture, .sign_log_in').hide();
	var contacts_done = 0;
	var news_done = 0;

	/*
	*	LES VARIABLES connected et PHONE_NUMBER SONT A RECUPERER DEPUIS LE LOCALSTORAGE DE L UTILISATEUR
	*/

	var connected = true,
		phone_number = '0633086883';

	if(connected == true) {

		$.post(url_access+'functions.php',{phone_number:phone_number, what_function:'authentificate'},function(data) {

		if(data != 'KO') {
			var data = JSON.parse(data);
				$('.carte_name_name').text(data.name);
				$('.carte_pokedex_name').text(data.pokedex);
				$('.carte_right img').attr('src', data.picture);
				$('.connected').show();
			} else {
				alert('error');
			}

		});

	} else {
		$('.sign_log_in').show();
	}

	$('.signIn').on('submit', function(e) {

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

	$('.pass_step').on('click', function() {
		$('.take_picture').hide();
		$('.connected').show();
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



function checkConnection() {
    var networkState = navigator.connection.type;
    return true;
    if(networkState == "Connection.NONE") {
    	return false;
    } else {
    	return true;
    }
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
	//alert(imageURI);
}
function onPhotoURISuccess(imageURI) {
	//console.log(imageURI);
	var galleryImage = document.getElementById('image_taken');
	galleryImage.style.display = 'block';
	galleryImage.src = imageURI;
	var buttonSubmit = document.getElementById('image-submit');
	buttonSubmit.style.display = 'block';
	//alert(imageURI);
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

function storage(){
	var db = openDatabase('local_database', '1.0', 'database', 2 * 1024 * 1024);
	db.transaction(function(tx){

		tx.executeSql('CREATE TABLE IF NOT EXISTS USERS(id INTEGER PRIMARY KEY, texte)');
		tx.executeSql
		("SELECT * FROM USERS", [], 
		    function(tx, results) {
		        if(results.rows) {
		            for (var i = 0; i < results.rows.length; i++) {
		            	if(i > 0){
		                	$('.div_storage').append("<br/>User numéro:" + results.rows.item(i).id + " - Nom: "+ results.rows.item(i).texte);
		            	}else{
		                	$('.div_storage').append("User numéro:" + results.rows.item(i).id + " - Nom: "+ results.rows.item(i).texte);
		                }
		            }
		        }
		    }
		);
	});

	$('.formulaire').submit(function(){
		input = $( "input:first" ).val();
		//alert(input);
		db.transaction(function(tx){
			tx.executeSql('INSERT INTO USERS (texte) VALUES (?)',[input]);
		});
	});
}