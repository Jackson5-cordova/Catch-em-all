<?php
//phpinfo();

$host = 'localhost';
$user = "root";
$pass = "";
$db_name = "catch_em_all";

try {
	$connect = new PDO('mysql:host='.$host.';dbname='.$dbname, $user, $pass); 
}
catch(Exception $e) {
	die('Impossible de se connecter à la BDD'.$e->getMessage());
}

?>