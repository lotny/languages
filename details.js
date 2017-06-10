//this will handle displaying additional info
var detailsWindow = new Object();


detailsWindow.clear = function(){
	$("#details").empty();
}

detailsWindow.close = function(){
	$("#details").addClass("hidden");
	$("td.selected").removeAttr('class');
}
detailsWindow.create = function(){

var div = document.createElement("div");
div.id = "detailsHeader";
$("#details").append(div);

var div = document.createElement("div");
div.id = "detailsType";
$("#details").append(div);

var div = document.createElement("div");
div.id = "detailsAdditional";
$("#details").append(div);

var div = document.createElement("div");
div.id = "detailsClose";
div.align = "right";
div.innerHTML = "<button onClick='detailsWindow.close()' class='btn_mode_controls'>close</button>";
$("#details").append(div);

}

//move to a better place
detailsWindow.create();


detailsWindow.reportIssue = function(){

}

detailsWindow.changeHeader = function(){
}


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

//detailsWindow.clear();

$("#detailsType").html("<span class='detType'>--</span>");
$("#detailsAdditional").empty();
$.getJSON('details.php', {'userquery': q}, function(e) { 
	if (e.result[0] != "ERROR"){
	detail = e.result[0]['Details'];
	console.log("result: " + e.result[0]);
	$("#detailsType").html("<span class='detType'>" + e.result[0]['Type'] + "</span>");
	if (detail != ""){
		$("#detailsAdditional").html("<br><br>Detailed information: <br>" + detail);
		} else {
		$("#detailsAdditional").empty();
		}
	}
	else
	{
	messageCreate(e.result[1]);
	}
clicked = false;
})


$("#detailsHeader").html(word+ " (" + context[languageId][2] + ")" + " [" + Id + "]");
}