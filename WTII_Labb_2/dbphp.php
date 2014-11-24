<?php

class dbstuff {

	public function __construkt() {

		$mode = $this -> fetch('någonting?');

		switch($mode) {
			case 'get' :
				$this -> getMessage();
				break;
			case 'post' :
				$this -> postMessage();
				break;
			default :
				$this -> output(false, 'Wrong mode.');
				break;
		}
	}

	private function fetch($name) {

		$val = isset($_POST[$name]) ? $_POST[$name] : '';
		return mysql_real_escape_string($val, $this -> connection);
	}

	protected function getMessage() {
		$endtime = time() + 20;
		$lasttime = $this -> fetch('lastTime');
		$curtime = null;

		while (time() <= $endtime) {
			$rs = mysql_query("
                                        SELECT *
                                        FROM cht_chat
                                        ORDER BY insertDate desc
                                        LIMIT 0, 30
                                ");

			if ($rs) {
				$messages = array();

				while ($row = mysql_fetch_array($rs)) {
					$messages[] = array('user' => $row['username'], 'text' => $row['text'], 'time' => $row['insertDate']);
				}

				$curtime = strtotime($messages[0]['time']);
			}

			if (!empty($messages) && $curtime != $lasttime) {
				$this -> output(true, '', array_reverse($messages), $curtime);
				break;
			} else {
				sleep(1);
			}
		}
	}

	protected function postMessage() {
		$user = $this -> fetch('user');
		$text = $this -> fetch('text');

		if (empty($user) || empty($text)) {
			$this -> output(false, 'Username and Chat Text must be inputted.');
		} else {
			$rs = mysql_query("
                                        INSERT INTO cht_chat(
                                                messageId,
                                                username,
                                                text,
                                                insertDate
                                        )
                                        VALUES(
                                                uuid(),
                                                '$user',
                                                '$text',
                                                CURRENT_TIMESTAMP
                                        )
                                ");

			if ($rs) {
				$this -> output(true, '');
			} else {
				$this -> output(false, 'Chat posting failed. Please try again.');
			}
		}
	}
}
?>