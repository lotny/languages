<?php
$userquery = $_GET['userquery'];
if ($userquery == ""){
	$error = ["ERROR","QUERY TOO LONG"];
echo json_encode(array("result" => $error)); 
die;
}
$date = new DateTime('NOW');
$txt = $date->format('Y-m-d H:i:s') . " - " . $userquery . "\n" . "\n"  ;
$myfile = file_put_contents('query.txt', $txt.PHP_EOL , FILE_APPEND);
echo json_encode(array("result" => $userquery)); 
?>