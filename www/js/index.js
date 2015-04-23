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
	contacts();
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

	$('.signIn, .logIn, .sign_log_in').hide();
	$('.connected').hide();
	$('.return').hide();
	$('.take_picture').hide();

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

	$('.button_picture').on('click', function() {
		launchPicture();
	});

	$('.pass_step').on('click', function() {
		$('.take_picture').hide();
		$('.connected').show();
	});

	var launchPicture = function() {
		alert('ok');
	};

	$('.menu .link_json').on('click', function() {

		$('.news').show();

		$.post(url_access+'functions.php',{what_function:'news'},function(data) {

			if(data != 'KO') {
				var data = JSON.parse(data);
				$('.news').append(data);
			} else {
				$('.sign_log_in').show();
			}
		});
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

function contacts(){
	if(page == "contact"){
		function onSuccess(contacts) {
		    alert('Found ' + contacts.length + ' contacts.');
		};
		function onError(contactError) {
		    alert('onError!');
		};
		var options      = new ContactFindOptions();
		options.filter   = "Takushi";
		options.multiple = true;
		options.desiredFields = [navigator.contacts.fieldType.id];
		var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
		navigator.contacts.find(fields, onSuccess, onError, options);
	}
}