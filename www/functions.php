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
				INSERT INTO users (name, email,phone_number,password) VALUES
				(
					'{$data['sign_name']}',
					'{$data['sign_email']}',
					'{$data['sign_phone_number']}',
					'{$data['sign_password']}'
				)
				");

			if(!$query) {
				// print_r($connect->errorInfo());
				// die;
				echo 'KO';
			} else {
				echo 'OK';
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
				echo $users[0]['name'];
			} else {
				echo 'KO';
			}

		break;

	}

?>