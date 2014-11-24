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
		//logout();
    } 
    else if($_GET['function'] == 'add') {
	    $name = trim(strip_tags($_GET["name"]));
		$message = trim(strip_tags($_GET["message"]));
		
		addToDB($message, $name);
    }
	
    elseif($_GET['function'] == 'getMessages') {
    	 $arrayLength = $_GET['arrayLength'];
  	   	echo(json_encode(getMessages($arrayLength)));	
    }
	
	elseif($_GET['function'] == 'getFirstMessages'){
		echo(json_encode(getFirstMessages()));	
	}
}