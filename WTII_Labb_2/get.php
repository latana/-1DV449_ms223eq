<?php

// get the specific messages
function getMessages($arrayLength) {
	$endtime = time() + 20;
	$db = null;

	while (time() <= $endtime) {

		try {
			$db = new PDO("sqlite:db.db");
			$db -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		} catch(PDOEception $e) {
			die("Del -> " . $e -> getMessage());
		}

		$q = "SELECT * FROM messages ORDER BY timestamp DESC";
		$stm = $db -> prepare($q);
		$stm -> execute();
		$result = $stm -> fetchAll();

		if ($arrayLength < count($result)) {

			$length = count($result) - $arrayLength;
			$mess = array_splice($result, 0, $length, $preserve_keys = false);
				
			return $mess;
		}
	}
}

function getAllMessages() {

	$db = null;

	try {
		$db = new PDO("sqlite:db.db");
		$db -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	} catch(PDOEception $e) {
		die("Del -> " . $e -> getMessage());
	}

	$q = "SELECT * FROM messages";

	try {
		$stm = $db -> prepare($q);
		$stm -> execute();
		$result = $stm -> fetchAll();
	} catch(PDOException $e) {
		echo("Error creating query: " . $e -> getMessage());
		return false;
	}

	if ($result) {
		return $result;
	} else {
		return false;
	}
}
