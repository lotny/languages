<?php header('Content-Type: text/html; charset=utf-8');
//this script will handle mysql or mysqli depending on whether the server supports it
error_reporting(E_ERROR); //stops displaying warnings/errors, I can create my own errors and pass them with json
$userquery = $_GET['userquery'];
$servername = "localhost";


$details = explode(";",$userquery);
//$userquery = "SELECT Details from " . $details[0] . " where id = " . $details[1];



$userquery = "SELECT type.name as 'Type', " . $details[0] . ".details as 'Details', " . $details[0] . ".alt FROM word LEFT JOIN " . $details[0] . " ON " . $details[0] . ".id = word.id INNER JOIN type ON word.typeid = type.id WHERE word.id = " . $details[1];


if(function_exists('mysql_connect'))
		{
		$username = "languag5_reader";
		$password = "reader32167"; 
		$database = "languag5_languages";
		
		$conn = mysql_connect($servername,$username,$password) ;
		mysql_select_db($database);
		mysql_query("SET CHARSET UTF8");
		$result = mysql_query($userquery);
		if(!$result){
		$error = ["ERROR",mysql_errno($conn)];
		echo json_encode(array("result" => $error));
		mysql_close($conn);
		return;
	}
	if(mysql_num_rows($result) > 0){
		while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
		$rows[] = $row;}
		echo json_encode(array("result" => $rows));
		mysql_free_result($result);
	}else{
		$error = ["ERROR",mysql_errno($conn)];
		echo json_encode(array("result" => $error));}
		mysql_close($conn);
}