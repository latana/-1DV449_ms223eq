<?php
	require_once("get.php");
	require_once 'sec.php';
	sec_session_start();
	
	if(!isset($_SESSION['login_string'])){
		header("Location: index.php"); 
	}
	$_SESSION['token'] = uniqid();
?>

<!DOCTYPE html>
<html lang="sv">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="apple-touch-icon" href="touch-icon-iphone.png">
    <link rel="apple-touch-icon" sizes="76x76" href="touch-icon-ipad.png">
    <link rel="apple-touch-icon" sizes="120x120" href="touch-icon-iphone-retina.png">
    <link rel="apple-touch-icon" sizes="152x152" href="touch-icon-ipad-retina.png">
    <link rel="shortcut icon" href="pic/favicon.png">
    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" />
    <link rel='stylesheet' type='text/css' href='css/style.css' />
	
	
	
	<title>Messy Labbage</title>
  </head>        

        <div id="container">
            
            <div id="messageboard">
                <input class="btn btn-danger" type="button" id="buttonLogout" value="Logout" style="margin-bottom: 20px;" />
                
                <div id="messagearea"></div>
                
                <p id="numberOfMess">Antal meddelanden: <span id="nrOfMessages">0</span></p>
                Name:<br /> <input id="inputName" type="text" name="name" /><br />
                Message: <br />
                <textarea name="mess" id="inputText" cols="55" rows="6"></textarea>
                <input class="btn btn-primary" type="button" id="buttonSend" value="Write your message" />
                <input name "token" type="hidden" id='token' value="<?php echo $_SESSION['token'] ?>" />
                <span class="clear">&nbsp;</span>

            </div>

        </div>
        
	<script type="text/javascript" src="js/jquery-1.10.2.min.js"></script>		
	<script src="MessageBoard.js"></script>
	<script src="Message.js"></script>
    
	</body>
	</html>