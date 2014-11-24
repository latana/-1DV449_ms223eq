<?php
require_once("sec.php");
ini_set('max_execution_time', 300);



// check tha POST parameters
$u = trim(strip_tags($_POST['username']));
$p = trim(strip_tags($_POST['password']));

// Check if user is OK
if(isset($u) && isset($p) && isUser($u, $p)) {
	// set the session
	sec_session_start();
	$_SESSION['username'] = $u;
	$_SESSION['login_string'] = hash('sha512', "123456" +$u);
	
	header("Location: mess.php");
}
else {
	// To bad
	header('HTTP/1.1 401 Unauthorized');
	die("could not call");
}