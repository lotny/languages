<?php header('Content-Type: text/html; charset=utf-8');
//this script updates relevant tables and columns in database
include_once('../../config.inc.php');
$userquery = $_GET['updatequery'];

//echo exec('whoami');



//change string to an array and execute each query one by one:
if ($userquery == ""){
	$error = ["ERROR","UPDATES TOO LONG"];
echo json_encode(array("result" => $error)); 
die;
}
	//$date = new DateTime('NOW');
	//$txt = $date->format('Y-m-d H:i:s') . " - " . $usequery . " (try)";
	//$myfile = file_put_contents('log_updates.txt', $txt.PHP_EOL , FILE_APPEND);

$userqueries = explode(";",$userquery);

//connect to the server:
$conn = mysql_connect($servername,$writername,$writerpass);
mysql_select_db($database);



if ($conn->connect_error) {
  	$error = ["ERROR",mysql_errno($conn)];
	echo json_encode(array("result" => $error));
	die;
	}
mysql_query("SET CHARSET UTF8"); //ensure that we are not losing special characters
foreach ($userqueries as &$update){
	if ($update != ""){
$result = mysql_query($update);
if(!$result){ //log query with failure
	$date = new DateTime('NOW');
	$txt = $date->format('Y-m-d H:i:s') . " - " . $update . " (failure)";
	$myfile = file_put_contents('log_updates.txt', $txt.PHP_EOL , FILE_APPEND);
	$update = "failure";
} else { //log query with success
	$date = new DateTime('NOW');
	$txt = $date->format('Y-m-d H:i:s') . " - " . $update . " (success)";
	$myfile = file_put_contents('log_updates.txt', $txt.PHP_EOL , FILE_APPEND);
	$update = "success";
}
}
}
echo json_encode(array("result" => $userqueries));
unset($update);//clear memory?
mysql_close($conn);//close the connection
?>