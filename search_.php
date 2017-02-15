<?php header('Content-Type: text/html; charset=utf-8');
//this is the mysql version, it works but it is pretty basic
error_reporting(E_ERROR); //stops displaying warnings/errors, I can create my own errors and pass them with json
$userquery = $_GET['userquery'];
$servername = "localhost";
$username = "languag5_reader"; //root
$password = "reader32167"; //password
$database = "languag5_languages";
$userquery = strtolower($userquery);

//$search = "SELECT en.text where english.text like ".$userquery.";
//if match
//right join german on id=id
//right join french on id=id
//right join
//union ....


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
    $rows[] = $row;
}
	echo json_encode(array("result" => $rows));
	mysql_free_result($result);
}else{
	$error = ["ERROR",mysql_errno($conn)];
	echo json_encode(array("result" => $error));}
mysql_close($conn);
?>