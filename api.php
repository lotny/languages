<?php header('Content-Type: text/html; charset=utf-8');
//this script will handle mysql or mysqli depending on whether the server supports it
//error_reporting(E_ERROR); //stops displaying warnings/errors, I can create my own errors and pass them with json
$userquery = $_GET['userquery'];
include_once('../config.inc.php');


//instead of an array we should have a json with properties!



$languageId = "en";
$wordId = $userquery;
$url = $odUrl . "entries/" . $languageId . "/" . $wordId;

$curl = curl_init($url);


curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

curl_setopt($curl, CURLOPT_HTTPHEADER, array(
  'app_id: ' .$appId,
  'app_key: ' .$appKey
));

// Get response

$apiresponse = curl_exec($curl);

$httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);



if ($httpcode == 404){
$error = new stdClass();
$error -> ERROR = "NOT_FOUND";
echo json_encode($error);
}else {
// Decode
$apiresult = json_decode($apiresponse);

$etymology = $apiresult->results[0]->lexicalEntries[0]->entries[0]->etymologies[0]; //we send this back!
$audio = $apiresult->results[0]->lexicalEntries[0]->pronunciations[0]->audioFile; //we send this back!


$response = new stdClass();
$response -> etymology = $etymology;
$response -> audio = $audio;

echo json_encode($response);
}
?>