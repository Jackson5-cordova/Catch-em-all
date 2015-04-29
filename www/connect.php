<?php
//phpinfo();

$host = 'localhost';
$user = "root";
$dbname = "catch_em_all";

function simple_decrypt($text) {
    return trim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, '', base64_decode($text), MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND)));
}

$pass = '';

try {
	$connect = new PDO('mysql:host='.$host.';dbname='.$dbname, $user, $pass); 
}
catch(Exception $e) {
	die('Impossible de se connecter à la BDD'.$e->getMessage());
}

?>