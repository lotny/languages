/*
 * This module handles messages and help
 */
var Messages = (function () {


    function error(code) {

        switch (mode) {
            case "LANGUAGE_NOT_SUPPORTED":
                show("this language is not supported", "error");
                break;
            case "CONNECTION_FAILED":
                show("could not connect to the database", "error");
                break;

            default:
                show(code, "error");
                break;

        }
    }

    //refactor - get rid of ids? create messages in a cleaner way
    //refactor - add the ability to use {0} inline, messages should handle arrays nad replace values accordingly
    function show(text, type, number) { //info/error/warning/tip?
        var n = (number == null ? "" : number);
        m += 1;
        type == null ? "info" : type;
        var message = "<p id='" + m + "'style='display:none'>" + text + n + "</p>";
        $('#messages').append(message);
        $('#' + m).attr("class", type);
        $('#' + m).fadeIn(500); //replace with CSS animation, append messages only once!
        setTimeout(kill('#' + m), 10000);
        $('#' + m).on('click', function (e) {
            e.stopPropagation();
            e.target.remove();
        })
    }

    function kill(m) {
        return function () {
            {
                $(m).remove();
            }
        }
    };

    $(document).on('click', '#messages > p', function (e) {
        e.stopPropagation();
        e.target.remove();
    });

    //refactor - find a good way of storing help topics and retrieving them, maybe separate html files and ajax calls?
    //or would ajax calls be an overkill?
    function pickHelp(context) {
        var helpMessage = "";
        helpMessage = "<p>Click on UI elements to find out more about them.<br>Click <b>?</b> to hide this pane.<br>Go <a href='changelog.html' >here</a> to see the list of changes and coming features.</p>";
        return helpMessage;
    }


    function toggleHelp() {
        if (help == false) {
            changeHelp("DEFAULT");
            $help_content.show(300);
            help = true;
        } else {
            $help_content.hide(300);
            help = false;

        }
    }

    function changeHelp(evt) {
        var asd = evt.name;
        console.log(asd);
        var helpContent = pickHelp();
        $help_content.html(helpContent);
    }


    function init() {
        $help_content = $("#help_content");
        $help_content.hide();
        $btn_help = $("#btn_help");
        $btn_help.on("click", toggleHelp);
        help = false;
        m = 0;
    }


    EV.on("languages button clicked", changeHelp);
    EV.on("table clicked", changeHelp);
    EV.on("init", init);
    var $btn_help, $help_content, help, m;

    return {
        help: help,
        show: show
    }


})();