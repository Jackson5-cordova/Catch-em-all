<?php

	require_once("connect.php");

	// var_dump($_POST);
	// die;

	$what_function = $_POST['what_function'];

	switch ($what_function) {

		case 'authentificate':

			$phone_number = $_POST['phone_number'];

			$query = $connect->query('
				SELECT *
				FROM users
				WHERE users.phone_number = '.$phone_number.'
			');

			$users = array();

			while($rows = $query->fetch()) {
				$users[] = $rows;
			}

			if(isset($users[0])){
				echo json_encode($users[0], true);
			} else {
				echo 'KO';
			}

		break;

		case 'sign_in':

			$data = $_POST['data'];

			$query = $connect->query("
				INSERT INTO users (name, email,phone_number,password, picture) VALUES
				(
					'{$data['sign_name']}',
					'{$data['sign_email']}',
					'{$data['sign_phone_number']}',
					'{$data['sign_password']}',
					'{$data['sign_picture']}'
				)
				");

			if(!$query) {
				echo 'KO';
			} else {

				$query = $connect->query("
					SELECT *
					FROM users
					WHERE users.name = '{$data['sign_name']}'
					AND users.password = '{$data['sign_password']}'
				");

				$users = array();

				while($rows = $query->fetch()) {
					$users[] = $rows;
				}

				if(isset($users[0])){
					echo json_encode($users[0], true);
				} else {
					echo 'KO';
				}
			}

		break;

		case 'log_in':

			$data = $_POST['data'];

			$query = $connect->query("
				SELECT *
				FROM users
				WHERE users.name = '{$data['log_name']}'
				AND users.password = '{$data['log_password']}'
			");

			$users = array();

			while($rows = $query->fetch()) {
				$users[] = $rows;
			}

			if(isset($users[0])){
				echo json_encode($users[0], true);
			} else {
				echo 'KO';
			}

		break;

		case 'save_picture':

			$_POST['picture'];
			$_POST['name'];

		break;

		case 'news':

		$news = array();

		$news[0] = 'Sortie de l\'application aujourd\'hui ! <div><img src="img/logo.png" /></div>';
		$news[1] = 'Installation des plugins pour votre confort !';
		$news[2] = 'Sortie dans quelques jours, vous pourrez bientôt attraper vos pokémons préférez où que vous soyez ! <div><img width="400" src="img/pokemon-logo.jpg" />';

		echo json_encode($news, true);

		break;

		case 'getContacts':

		$data = $_POST['data'];

		$query = $connect->query("
			SELECT *
			FROM users
		");

		$users = array();

		while($rows = $query->fetch()) {
			$users[] = $rows;
		}

		$response = array();

		$k = 0;

		foreach ($users as $key => $user) {
			if(in_array($user['phone_number'], $data)) {
				$response[$k]['name'] = $user['name']; 
				$response[$k]['phone_number'] = $user['phone_number']; 
				$k++;
			}
		}

		echo json_encode($response, true);

		break;

	}

?>