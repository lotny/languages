<?php header('Content-Type: text/html; charset=utf-8');
//error_reporting(E_ERROR); //stops displaying warnings/errors
$userquery = $_GET['userquery'];
include_once('../config.inc.php');

$languageId = $userquery['languageId'];
$wordId = $userquery['wordId'];

$response = new stdClass();
$response -> etymology = "";
$response -> audio = "";
$response -> word = $wordId;
$response -> error = "";

if ($languageId != "en")
{
    $response -> error = "LANGUAGE_NOT_SUPPORTED";
    echo json_encode($response);
return;
}

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

$etymology = $apiresult->results[0]->lexicalEntries[0]->entries[0]->etymologies[0];
$audio = $apiresult->results[0]->lexicalEntries[0]->pronunciations[0]->audioFile;

$response -> etymology = $etymology;
$response -> audio = $audio;


echo json_encode($response);
}
?>