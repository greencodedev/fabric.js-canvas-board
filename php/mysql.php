<?php
header( 'Content-Type: text/html; charset=utf-8' );
$host = "s100.linuxpl.com:3306"; 
$user = "najwww_app2";
$database = "najwww_app2";
$pass = "0%2hgfgUik";

//$linkID = mysql_connect($host, $user,$pass) or die("Could not connect to host."); 
//mysql_select_db($database, $linkID) or die("Could not find database."); 

$linkID = mysqli_connect($host, $user, $pass, $database) or die("Could not connect to host."); 
mysqli_set_charset($linkID, 'utf8' );

function mysqli_result($res, $row, $field=0) {
    $res->data_seek($row);
    $datarow = $res->fetch_array();
    return $datarow[$field];
}

?>
