<?php
require_once("get.php");
require_once("post.php");
require_once("sec.php");
/*
* It's here all the ajax calls goes
*/
if(isset($_GET['function'])) {

	if($_GET['function'] == 'logout') {
		//logout();
    } 
	elseif($_GET['function'] == 'add') {
	    $name = trim(strip_tags($_GET["name"]));
		$message = trim(strip_tags($_GET["message"]));

		sec_session_start();

		$token = $_GET['token'];

			if($_SESSION['token'] == $token){
				addToDB($message, $name);
			}
			else{
				//header("Location: mess.php");
			}
		session_write_close();
    }
	
	elseif($_GET['function'] == 'getMessages') {
    	 $arrayLength = $_GET['arrayLength'];
  	   	echo(json_encode(getMessages($arrayLength)));	
    }
	
	elseif($_GET['function'] == 'getAllMessages'){
		echo(json_encode(getAllMessages()));	
	}
}