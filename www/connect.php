<?php
//phpinfo();

$host = 'localhost';
$user = "root";
$pass = "";
$dbname = "catch_em_all";

try {
	$connect = new PDO('mysql:host='.$host.';dbname='.$dbname, $user, $pass); 
}
catch(Exception $e) {
	die('Impossible de se connecter à la BDD'.$e->getMessage());
}

?>