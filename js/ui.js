var UI = (function () {

    function Languages() {
        var lngs = [];
        $btn_lngs.each(function () {
            if ($(this).hasClass("selected")) {
                var ID = $(this).attr("ID");
                ID = ID.replace(/btn_/, "");
                lngs.push(ID);
            }

        });

        return lngs;
    }


    function modeButtonClicked(e) {
        var btn = e.target.id;
        var mode = btn.replace(/btn_m_/, "");
        toggleModes(mode);
    }

    //refactor - use CSS for animations!
    function toggleModes(mode) {
        switch (mode) {
            case "compare":
                $btn_m_compare.hide(300);
                $btn_m_search.show(300);
                $btn_m_edit.show(300);
                $btn_compare.show(300);
                $btn_search.hide(300);
                $input_search.hide(300);
                $btn_edit.hide(300);
                break;
            case "search":
                $btn_m_compare.show(300);
                $btn_m_search.hide(300);
                $btn_m_edit.show(300);
                $btn_compare.hide(300);
                $btn_search.show(300);
                $input_search.show(300);
                $btn_edit.hide(300);
                break;
            case "edit":
                $btn_m_compare.show(300);
                $btn_m_search.show(300);
                $btn_m_edit.hide(300);
                $btn_compare.hide(300);
                $btn_search.hide(300);
                $input_search.hide(300);
                $btn_edit.show(300);
                break;
            default:
        }
    }

    function toggleControls(mode) {
        console.log("mode: " + mode);
        if (mode == "compare") {
            $("#controls").show();
            $("#btn_change, #btn_update, #btn_add").hide();

        }
    }



    function toggleLanguage(evt) {
        var $btn = $(evt.target);
        var ID = $btn.attr("ID");
        EV.emit("language-button-clicked", ID);
        $btn.toggleClass("selected");
        /*if ($btn.hasClass("selected")) {
            $btn.removeClass("selected")
        } else {
            $btn.addClass("selected")
        };*/
    }

    function tableBuilt(e) {
        toggleControls(e);
        hideTopPane();

    }

    function hideTopPane() {
        $btn_lngs.hide(300);
        $("#btn_mode_controls_pane").hide(300);

    }

    function showTopPane() {
        $btn_lngs.show(300);
        $("#btn_mode_controls_pane").show(300);
    }

    function editClicked(evt) {
        //evt.preventDefault();
        //evt.stopPropagation();
        //evt.stopImmediatePropagation();

        EV.emit("edit-clicked");
        Messages.show("Editing is not available now", "error");
    }


    function compareClicked() {
        EV.emit("compare-clicked");

        //Table.CompareInit();

        //console.log("compare-clicked");
        //$(document).trigger("compare clicked");
    }
    function searchClicked() {
        var searchString = $input_search.val();
        if (searchString) {

            EV.emit("search-clicked", searchString);


        } else {
            Messages.show("Type in your search term", "tip");
        }
        //Table.CompareInit();

        //console.log("compare-clicked");
        //$(document).trigger("compare clicked");
    }

    function filterClicked() {
        EV.emit("filter-clicked");
    }

    //refactor - use regular objects and not jQuery objects where possible
    function init() {

        $content = $("#content");
        $btn_lngs = $(".btn_language");
        $modes = $("#modes");
        $controls = $("#controls");

        $btn_mode_controls = $(".btn_mode_controls");
        $btn_m_compare = $("#btn_m_compare");
        $btn_m_search = $("#btn_m_search");
        $btn_m_edit = $("#btn_m_edit");

        $input_search = $("#input_search");
        $btn_search = $("#btn_search");
        $btn_compare = $("#btn_compare");
        $btn_edit = $("#btn_edit");

        $btn_filter = $("#btn_filter");
        $input_filter = $("#input_filter");

        $btn_lngs.on("click", toggleLanguage);
        $modes.on("click", showTopPane);
        $content.on("click", hideTopPane);

        $btn_m_compare.on("click", modeButtonClicked);//could be dynamic
        $btn_m_edit.on("click", modeButtonClicked);//could be dynamic
        $btn_m_search.on("click", modeButtonClicked);//could be dynamic


        $btn_compare.on("click", compareClicked);
        $btn_edit.on("click", editClicked);
        $btn_search.on("click", searchClicked);

        $btn_filter.on("click", filterClicked);

        $input_filter.bind('keypress', function(e) { 
        if(e.keyCode==13){ //enter
        filterClicked();
	}
});


        //user should be able to configure which languages they want displayed
        $("#btn_nl, #btn_se, #btn_it, #btn_la, #btn_cz, #btn_es").remove();
        toggleModes("compare");
        $controls.hide();

    }

    var $content, $input_filter, $btn_filter, $btn_lng, $modes, $btn_mode_controls, $input_search, $btn_search, $btn_compare, $btn_edit, $btn_m_compare, $btn_m_edit, $btn_m_search;


    EV.on("init", init);
    EV.on("table-built", tableBuilt);

    //EV.on("table clicked", hideTopPane);
    //EV.on("table loaded", hideTopPane);


    return {
        Languages: Languages

    }
})();