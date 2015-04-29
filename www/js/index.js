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
		// window.analytics.startTrackerWithId('UA-62250325-1');
		// window.analytics.trackView("Page d'accueil");
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

	$('.search_contacts').on('click', function() {

		var thaat = $(this);

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
							thaat.remove();
						} else {
							$('.div_contact').append('<p>Aucun contact trouvé</p>');
						}

					} else {
						alert('erreur');
					}
				});
			});

			
		}, 2000);
	});

	
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
	
	if($(window).width() < 1200) {
		var options = new ContactFindOptions();
		options.filter   = "";
		options.multiple = true;
		options.desiredFields = [navigator.contacts.fieldType.phoneNumbers];
		var filter = ["displayName", "name"];
		//var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name, navigator.contacts.phoneNumbers];

		navigator.contacts.find(filter, onSuccess, onError, options);
	} else {
		var all_contacts = {};
		all_contacts[0] = 'ooo';
		numeros =  all_contacts;
		callback();
	}
	
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

var pokemon_name = '';

function geolocalisation(){
	$('.div_battle').hide();
	$('.div_geoloc').html('<h2>Geolocalisation</h2>').append('<div class="loading">Chargement...</div>');

	var successPosition = function(position) {
		$('.loading').remove();
		console.log(position.coords.latitude + position.timestamp);
		$('.div_geoloc').append('<h3>Votre localisation a été trouvée !</h3>');
		$('.div_geoloc').append('<p>Latitude : '+position.coords.latitude+'</p>');
		$('.div_geoloc').append('<p>Longitude : '+position.coords.longitude+'</p><br /><br /><br />');
		$('.div_geoloc').append('<a href="geoloc.html" class="button">Me géolocaliser une nouvelle fois</a>');

		if(position.coords.latitude > 48.85) {

			pokemon_name = 'pikachu';

		} else if(position.coords.latitude < 48.85) {

			pokemon_name = "carapuce";

		} else {
			$('.div_geoloc').append('<p>Il n\'y a pas de Pokémons autour de vous en ce moment mais restez aux aguets !</p>');
		}

		if(pokemon_name != '') {
			$('.div_geoloc').append('<p>Il y a un Pokémon dans votre zone !</p>');
			$('.div_geoloc').append('<p><img class="repered" src="img/pokemons/'+pokemon_name+'.png" width="300" /></p>');
			$('.div_geoloc').append('<p><button class="show_battle">Affronter le Pokémon</button></p>');
		}
		
	};

	var erreurPosition = function(error) {

	    var info = "Erreur lors de la géolocalisation : ";
	    switch(error.code) {
	    case error.TIMEOUT:
	    	info += "Timeout !";
	    break;
	    case error.PERMISSION_DENIED:
	    info += "Vous n’avez pas donné la permission";
	    break;
	    case error.POSITION_UNAVAILABLE:
	    	info += "La position n’a pu être déterminée";
	    break;
	    case error.UNKNOWN_ERROR:
	    	info += "Erreur inconnue";
	    break;
	    }

	    alert(info);
	}

	navigator.geolocation.getCurrentPosition(successPosition, erreurPosition, {maximumAge:0,enableHighAccuracy:true});



	$(document).on('click', '.show_battle', function() {
		$('.div_geoloc').hide();
		$('.div_battle .pokemon').append('<img src="'+$('.repered').attr('src')+'" width="300"/>');
		$('.div_battle').append('<p style="margin-top: 300px;"><button class="catch">Attraper le Pokémon</button></p>');
		$('.div_battle .pokemon').append('<p>Chances d\'attraper le Pokémon : <span class="luck">20</span>/100</p>');
		$('.div_battle').show();
		
		setTimeout(function() {
			battle();
		}, 1000);
		
	});
}

function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

$(document).on('click', '.catch', function() {

	if(battle_running === 0) {

		$('.ball').addClass('animate_ball');

		setTimeout(function() {
			$('.ball').removeClass('animate_ball');
			$('.pokemon').remove();
			$('.catch').remove();
			$('.div_battle').append('<p>Vous avez attrapé le pokémon !!!</p>');
			$('.div_battle').append('<p><a href="geoloc.html" class="button">Essayer encore une fois</a></p>');
		}, 2000);
	}
});

var battle_running = 0;

function battle() {

	battle_running = 1;

	var random = rand(1,3);
	var luck = $('.luck');

	if(random === 1) {
		$('.div_battle .pokemon').append('<p>Pikachu vous attaque ! Vous perdez 10 points de chance !</p>');
		luck.text(parseInt(luck.text()) - 10);
	} else if(random === 2) {
		$('.div_battle .pokemon').append('<p>Le pokémon se calme ! Vous gagnez 10 points de chance ! </p>');
		luck.text(parseInt(luck.text()) + 10);
	} else if(random === 3) {
		$('.div_battle .pokemon').append('<p>Le Pokémon vous adore !! Vous gagnez 20 points de chance !!</p>');
		luck.text(parseInt(luck.text()) + 20);
	}

	battle_running = 0;

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
	// Ouverture de la BDD
	var db = openDatabase('local_database', '1.0', 'database', 2 * 1024 * 1024);
	db.transaction(function(tx){

		// Création de la TABLE
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

	$('.formulaire > button').click(function(){
		input = $( "input:first" ).val();
		//alert(input);
		db.transaction(function(tx){
			tx.executeSql('INSERT INTO USERS (texte) VALUES (?)',[input], function(t, data){document.location.reload(true);	});
		});
		
	});
}