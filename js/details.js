    var Details = function () {


        function display() {
            $details.show();
        }

        function clear() {
            $details.empty();
        }

        function close() {
            $("td.selected").removeAttr('class');
            $details.hide();
        }

        function build() {

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
            div.id = "detailsEtymology";
            $("#details").append(div);

            var div = document.createElement("div");
            div.id = "detailsClose";
            div.align = "right";
            div.innerHTML = "<button onClick='Details.close()' class='btn_mode_controls'>close</button>";
            $("#details").append(div);

        }

        function detailsInit(data) {
            Content = data;
            getDetails();
            callAPI();
            display();
        }

        function getDetails() {
            $("#detailsHeader").html(Content.wordText + " (" + Content.languageId + ")" + " [" + Content.ID + "]");


            var userquery = {
                mode : "details",
                search : Content.ID,
                languages : []
            }
            userquery.languages.push(Content.languageId);

            $.getJSON('load.php', { 'userquery': userquery }, function (e) {

                if (e) {
                    details = e.table[0]['Details'];

                    $("#detailsType").html("<span class='detType'>" + e.table[0]['Type'] + "</span>");
                    if (details != "") {
                        $("#detailsAdditional").html("<br><br>Detailed information: <br>" + details);
                    } else {
                        $("#detailsAdditional").empty();
                    }
                }
                else {
                    console.log("error");
                }


            })


        }

        function callAPI() {

            var word = Content.wordText;
            var languageId = Content.languageId;
            var userquery = {
                wordId: word,
                languageId: languageId
            }
            console.log(userquery);

            //refactor - handle rejecting data that came after the details window was changed/closed
            $.getJSON('api.php', { 'userquery': userquery }, function (e) {

                if (e.etymology != "" & e.word == word) {
                    $("#detailsEtymology").html("<br>Etymology: <br>" + e.etymology);
                    
                } else {
                    console.log("word mismatch " + e.word + "|" + word);
                    $("#detailsEtymology").empty();
                }

                if (e.audio) {
                    //$("#detailsEtymology").append("<audio controls><source src='" + e.audio+ "' type='audio/mpeg'></audio>");

                }
            }
            );
        }


        function init() {
            $details = $("#details");
            $details.hide(); //refactor - gets fired too late
            build();
        }

        var $details, Content;


        EV.on("cell-clicked", detailsInit);
        EV.on("init", init);

        return {
            close: close

        }
    }()