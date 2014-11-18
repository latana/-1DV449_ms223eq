<?php
require_once("get.php");
require_once("post.php");
require_once("sec.php");
sec_session_start();

/*
* It's here all the ajax calls goes
*/
if(isset($_GET['function'])) {

	if($_GET['function'] == 'logout') {
		logout();
    } 
    elseif($_GET['function'] == 'add') {
	    $name = $_GET["name"];
		$message = $_GET["message"];
		addToDB($message, $name);
		header("Location: test/debug.php");
    }
    elseif($_GET['function'] == 'getMessages') {
  	   	echo(json_encode(getMessages()));
    }
}