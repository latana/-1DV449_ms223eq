<?php

require_once 'sec.php';

if(!session_id()) {
		sec_session_start();
	}
	unset($_SESSION['username']);
	unset($_SESSION['login_string']);
	header('Location: index.php');