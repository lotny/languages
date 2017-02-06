




//SET @p0 =  '1';

//SET @p1 =  '1248';

//CALL `UpdateType` (
//@p0 , @p1
//);



var successRate = [0,0]

function addRow(){
	var updatequery = "INSERT INTO word (COMMENT,TypeID) VALUES ('',0);SELECT LAST (ID) FROM word;"
	var updatequery = "";
	$.getJSON('addrow.php', {'updatequery': updatequery}, function JSONCall(e) {
	console.log(e.result[0]);
	if (e.result[0] != "ERROR")//check if there was an error
	{
	for(var y in e.result[0]){
	var newRow = "<tr class='added'><td>" + e.result[0][y] + "</td>";
	}
	for (i=1;i<context.length;i++)
	{newRow += "<td></td>"}
	newRow += "</tr>";
	
	$('#table tbody').append(newRow);
	messageShow("Row added","info");
	$("html, body, #content").animate({ scrollTop: $("#table").height() }, "slow");

	}
	else{ //handle errors
	messageCreate(e.result[1]);
	}
	})
}

function executeUpdate(){

if ($(".changed").length == 0){messageShow("no changes found","error"); return};
var updateQuery = "";
//reset the counters
successRate[0] = 0;
successRate[1] = 0;
$(".changed").each(function(e){ //I could use the E index to create multiple objects//
		var changedCell = $(this);
		var x = changedCell.index();
		var y = changedCell.parent("tr").index();
		var changedValue = changedCell.text();
		var changedTable = context[x][0];
		var changedColumn = context[x][1];
		//replace with stored procedure:
		var changedId = document.getElementById("table").rows[y].cells[0].innerHTML;
		updateQuery += "INSERT INTO " + changedTable + " (Id,"+ changedColumn + ") VALUES ("+ changedId +",'" + changedValue + "') ON DUPLICATE KEY UPDATE " + changedColumn + "='" + changedValue + "';";
		console.log(e);
})
console.log(updateQuery);
messageShow('saving...', 'info');
$.getJSON('scripts/update.php', {'updatequery': updateQuery}, function(e) { 
	if (e.result[0] != "ERROR")//check if there was an error
	{ //in case of success, we expect array with success/failure statements
	$(".changed").each(function(i){//iterate through each cell
		changedCell = $(this);
		if(e.result[i] == "success"){
			successRate[0] += 1; //increase success counter
		changedCell.attr("class","saved");
	}else{
			successRate[1] += 1; //increase failure counter
		}
	})
	var total = successRate[0] + successRate[1];
	messageShow("changes saved: " + successRate[0] + "/" + total,"info");
	}
	else{ //handle errors based on ERROR code
	messageCreate(e.result[1]);
	}
	})
}