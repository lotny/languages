//maybe change this to "content"?
var Table = (function () {

    function compareInit() {
        userQuery.mode = "compare";
        userQuery.languages = UI.Languages();
        sendQuery();
    }

    function searchInit(search) {
        userQuery.mode = "search";
        userQuery.search = search;
        userQuery.languages = UI.Languages();
        sendQuery();
    }

    function editInit() {
        //logic goes here
    }

    function filterInit() {
        console.log("filterInit");
        var filter = $("#input_filter").val();
if (filter){

        filterAll(filter);
}else
{
    $("#table tbody tr").show();
}
adjustColumns();
}
    function filterAll(filter) {

            var table = document.getElementById('table');
            var rowLength = table.rows.length;
            for (var i = 0; i < rowLength; i += 1) {
                var matches = 0;
                var row = table.rows[i];
                var cellLength = row.cells.length;
                for (var y = 0; y < cellLength; y += 1) {
                    var cell = row.cells[y];
                    if (cell.innerHTML != "") {
                        if (cell.innerHTML.toLowerCase().indexOf(filter) >= 0) { //contains phrase
                            matches += 1;
                        }
                    }
                }
                if (matches == 0) {
                    row.style.display = "none";
                }
            }
            adjustColumns();
        }


    function updateContext(columns) {
        console.log("ASD");
        Context.mode = userQuery.mode;
        Context.columns = columns;
        //var idColumn = new Column();
        var idColumn = new Object();
        idColumn.columnHeader = "ID";
        idColumn.columnId = "id";
        idColumn.tableId = "word";
        Context.columns.unshift(idColumn);
    }

    function sendQuery() {
        var response;
        console.log(userQuery);
        Messages.show("Fetching data ", "info");
        $.getJSON('load.php', { 'userquery': userQuery }, function () {
            console.info("Fetching data");
        }

        )
            .done(function (response) {
                if (response != null) {
                    console.log(response);
                    build(response.table);
                    updateContext(response.context);
                } else {
                    Messages.show("There was an error", "error");

                }
            })
            .fail(function () {
                Messages.show("Connection failure. <br> Try again later", "error");
            });
    };

    //refactor: minimize the number of DOM changes!
    function build(table) {
        //$("#content > p").remove();
        $content.html("<table id='table'><thead></thead><tbody></tbody></table>");//create table, hide header
        $("#tableheader").html("<table id='copy'><thead></thead><tbody></tbody></table>"); //create visible duplicate
        for (h = 0; h < Object.keys(table[0]).length; h++) //gets length
        {
            var columnHeader = "<th>" + Object.keys(table[0])[h] + "</th>";
            $("#table thead").append(columnHeader);//create headers
            $("#tableheader thead").append(columnHeader);//create headers
        }
        var tableRows = "";
        for (x = 0; x < table.length; x++) //for each row
        {
            var tableRow = "<tr>";
            for (var y in table[x]) { //y is the name not the index I think
                if (table[x][y] && table[x][y].trim() != "n/a") {
                    var tableRow = tableRow + "<td>" + table[x][y] + "</td>";
                } else {
                    var tableRow = tableRow + "<td class='missing'></td>";
                }
            }
            //closing the row:
            tableRow = tableRow + "</tr>";
            tableRows += tableRow;
        }
        $('#table tbody').append(tableRows);
        adjustColumns();
        Messages.show("Records found: ", "info", table.length);

        EV.emit("table-built", userQuery.mode);
    }

    function showControls() {

        return;
    }

    //refactor - does not work correctly in every case
    function adjustColumns() {

        var column_width = 0;
        $('#table thead').show(); //has to be shown to get proper size does not work though
        $('#table th').each(function (e) {
            column_width = Math.round($(this).width());
            $('#copy > thead > th')[e].width = column_width; //add a way of defining COL?
            //$('#table > col')[e].width = column_width;
        })
        $('#copy').width = Math.round($('#table').width());
        $('#table > thead').height("0px");
        $('#table > thead').hide();
    }

    $(window).bind('resize', function (e) {
        window.resizeEvt;
        $(window).resize(function () {
            clearTimeout(window.resizeEvt);
            window.resizeEvt = setTimeout(function () { adjustColumns() }, 300);
        });
    });

    //refactor - where should the event handler be?
    function cellClicked(e) {

        var clickedCell = $(e.target);
        if (clickedCell.attr("class") == 'selected') return;
        $("td.selected").removeAttr('class');

        clickedCell.toggleClass('selected');
        //$("#details").removeAttr('class');
        var word = clickedCell.html();
        var rowId = clickedCell.parent("tr").index();
        //var languageId = clickedCell.index();
        var ID = document.getElementById("table").rows[rowId].cells[0].innerHTML;
        var Col = clickedCell.index();
        var Header = Context.columns[Col].languageId;

        var userQuery = { wordText: word, ID: ID, languageId: Header };
        //getDetails(cellId, word, languageId);
        //send context of columns, or keep it
        console.log(ID + " | " + Header);
        EV.emit("cell-clicked", userQuery);

    }

    function tableClicked() {
        EV.emit("table clicked");
    }

    function init() {
        $table = $("#table");
        $content = $("#content");
        $table.on("click", tableClicked);
        $("#content").on("click", "#table > tbody > tr > td", cellClicked);

    }

    var userQuery = {
        mode: "",
        languages: [],
        search: ""
    }

    var Context = {
        columns: [],
        query: "",
        mode: ""
    }

    var Column = {
        tableId: "",
        columnId: "",
        columnHeader: "",
        languageId: ""
    }

    var $table, $content;



    EV.on("init", init);
    EV.on("compare-clicked", compareInit);
    EV.on("search-clicked", searchInit);
    EV.on("edit-clicked", editInit);
    EV.on("filter-clicked", filterInit);

    return {
        Context: Context,
        compareInit: compareInit
    }
})();