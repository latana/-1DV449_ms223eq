<?php

// get the specific message
function getMessages($arrayLength) {
	$endtime = time() + 5;
	$db = null;

	while (time() <= $endtime) {

		try {
			$db = new PDO("sqlite:db.db");
			$db -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		} catch(PDOEception $e) {
			die("Del -> " . $e -> getMessage());
		}

		$q = "SELECT * FROM messages";
		$stm = $db -> prepare($q);
		$stm -> execute();
		$result = $stm -> fetchAll();

		if ($arrayLength < count($result)) {

			$q = "SELECT * FROM messages ORDER BY timestamp DESC LIMIT 1";

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
			}
		}
	}
}

function getFirstMessages() {

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
