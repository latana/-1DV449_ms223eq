<?php
    // This is just a stupid place where we imagine of debuging stuff is going on...
    // This should only be called in development enviroment
    $nanos = rand(100000000, 999999999);
    time_nanosleep(1, $nanos);
    header("Location: ../mess.php");
?>