//this will handle displaying additional info



function getDetails(Id, word, languageId){
	console.log(Id);
	var db = window.indexedDB.db;
	   
	console.log(db);
	//var request = objectStore("word").get(Id).onsuccess = function(event) {
  //alert("name " + event.target.result.Polish);
//};
var detail = "no data found :(";
var q = context[languageId][0] + ";" + Id;
console.log(q);
$.getJSON('details.php', {'userquery': q}, function(e) { 
	if (e.result[0] != "ERROR"){
	detail = e.result[0]['Details'];
	console.log(e.result[0]);
	$("#details").append(" - <span class='detType'>" + e.result[0]['Type'] + "</span>");
	if (detail != ""){
	$("#details").append("<br><br>Detailed information: <br>" + detail)
	}
	}
	else
	{
	messageCreate(e.result[1]);
	console.log("there was an error");
	}
	

})

var details =  word+ " (" + context[languageId][2] + ")" + " [" + Id + "]";
$("#details").html(details);


}