//this will handle displaying additional info



function getDetails(Id, word, languageId){
	console.log(Id);
	   var db = window.indexedDB.db;
	   
	console.log(db);
	//var request = objectStore("word").get(Id).onsuccess = function(event) {
  //alert("name " + event.target.result.Polish);
//};

	
var details =  word+ " (" + context[languageId][2] + ")" + " [" + Id + "]<br><br>More details will be displayed here...<br><br>"  ;
$("#details").html(details);
}