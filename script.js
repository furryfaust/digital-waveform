var sequences = {};
var inputs = 1;
var binaryReg = new RegExp("^[0-1]+$");
var nameReg = new RegExp("^[a-zA-Z]$");

$(document).ready(function() {
    var canvas = document.getElementById("canvas");
    var draw = canvas.getContext("2d");
    canvas.width = 1000;
    canvas.height = 500;

    var answercanvas = document.getElementById("answerchart");
    var answerdraw = answercanvas.getContext("2d"); 
    answercanvas.width = 1000;
    answercanvas.height = 500;

    var low = new Image();
    low.src = "res/low.png";
    var high = new Image();
    high.src = "res/high.png";
    var highleft = new Image();
    highleft.src = "res/highleft.png";
    var highright = new Image();
    highright.src = "res/highright.png";
    var highsingle = new Image();
    highsingle.src = "res/highsingle.png";

    high.addEventListener("load", function(event) {
        setInterval(function() {
            draw.clearRect(0, 0, canvas.width, canvas.height);
            answerdraw.clearRect(0, 0, answercanvas.width, answercanvas.height);
            var expression = $("#answer").text();
            if(expression != "" && binaryReg.test(expression) == true) {
                generateAnswerChart(expression);
            }
            for(var i = 0; i != inputs; i++) {
                if(sequences[String(Object.keys(sequences)[i])] != null) {
                    generateChart(i);
                }
            }
            
        }, 1);
    });

    $("#generate").click(function(event) {
        sequences = {};
        for(var i = 0; i != inputs; i ++) {
            var name = $("#name" + i).val();
            var sequence = $("#input" + i).val();
            if(name != null && sequence != null 
                && name != "" && sequence != ""
                && nameReg.test(name) == true
                && binaryReg.test(sequence) == true) {
                sequences[name] = sequence;
                $("#generate").val("Update");
            }
        }
        event.preventDefault();
    });

    $("#help").click(function(event) {
        window.open("https://github.com/FurryFaust/Digital-Flowchart");
        event.preventDefault();
    });

    $("#add").click(function(event) {
        if(inputs + 1 < 5) {
            $(".containera").append("<input id='name" + inputs + "' type='text' maxlength='1' size='1'/>");
            $(".containera").append("   ");
            $(".containera").append("<input id='input" + inputs + "' type='text' maxlength ='16' size='16'/>");
            $(".containera").append("<br>");
            inputs++;
        }
        event.preventDefault();
    });

    $("#perform").click(function(event) {
        const expression = $("#expression").val();
        if(expression != "") {
            var proccessing = "";
            var x = Object.keys(sequences);
            var length = getSmallestLength();
            var answer = "";
            for(var i = 0; i != length; i++) {
                proccessing = expression;
                for(var index in sequences) {
                    var sequence = sequences[index];
                    while(proccessing.indexOf(index) != -1) {
                        proccessing = proccessing.replace(index, sequence.charAt(i));
                    }
                }
                while(proccessing.indexOf(" ") != -1) {
                    proccessing = proccessing.replace(" ", "");
                }
                while(proccessing.indexOf("1+1") != -1 || proccessing.indexOf("1+0") != -1
                    || proccessing.indexOf("0+0") != -1 || proccessing.indexOf("11") != -1
                    || proccessing.indexOf("00") != -1 || proccessing.indexOf("10") != -1
                    || proccessing.indexOf("01") != -1 || proccessing.indexOf("(0)") != -1
                    || proccessing.indexOf("(1)") != -1 || proccessing.indexOf("0'") != -1
                    || proccessing.indexOf("1'") != -1 || proccessing.indexOf("0+1") != -1) {
                    if(proccessing.indexOf("1'") != -1) {
                        proccessing = proccessing.replace("1'", "0");
                    } else if(proccessing.indexOf("0'") != -1) {
                        proccessing = proccessing.replace("0'", "1");
                    }
                    else if(proccessing.indexOf("11") != -1) {
                        proccessing = proccessing.replace("11", "1");
                    }
                    else if(proccessing.indexOf("00") != -1) {
                        proccessing = proccessing.replace("00", "0");
                    }
                    else if (proccessing.indexOf("(0)") != -1) {
                        proccessing = proccessing.replace("(0)", "0");
                    }
                    else if (proccessing.indexOf("(1)") != -1) {
                        proccessing = proccessing.replace("(1)", "1");
                    }
                    else if(proccessing.indexOf("10") != -1) {
                        proccessing = proccessing.replace("10", "0");
                    }
                    else if(proccessing.indexOf("01") != -1) {
                        proccessing = proccessing.replace("01", "0");
                    }
                    else if(proccessing.indexOf("1+1") != -1) {
                        proccessing = proccessing.replace("1+1", "1");
                    }
                    else if(proccessing.indexOf("1+0") != -1) {
                        proccessing = proccessing.replace("1+0", "1");
                    }
                    else if(proccessing.indexOf("0+0") != -1) {
                        proccessing = proccessing.replace("0+0", "0");
                    }
                    else if(proccessing.indexOf("0+1") != -1) {
                        proccessing = proccessing.replace("0+1", "1");
                    }
                }
                answer += proccessing;
            }
            if(binaryReg.test(answer) == true) {
                $("#answer").text(answer);
            } else {
                $("#answer").text("Error producing. You have syntax error in your expression.");
            }
        }
        event.preventDefault();
    });

    function getSmallestLength() {
        var small = String(sequences[Object.keys(sequences)[0]]).length;
        for(var index in sequences) {
            if(sequences[index].length < small) {
                small = sequences[index].length;
            }
        }
        return small;
    }

    function generateChart(j) {
        var sequence = String(sequences[Object.keys(sequences)[j]]);
        for(var i = 0; i != sequence.length; i ++) {
            draw.drawImage(getTexture(sequence, i), 1 + (i * 32), j * 48);
        }       
    }

    function generateAnswerChart(expression) {
        for(var i = 0; i != expression.length; i ++) {
            answerdraw.drawImage(getTexture(expression, i), 1 + (i * 32), 0);
        }
    }

    function getTexture(sequence, index) {
        var current = sequence.charAt(index);
        if(current == '1') {
            if(index == 0) {
                if(sequence.length > index + 1) {
                    var after = sequence.charAt(index + 1);
                    if(after == '1') {
                        return highleft;
                    } else {
                        return high;
                    }
                } else {
                    return high;
                }
            } else {
                if(sequence.length > index + 1) {
                    var before = sequence.charAt(index - 1);
                    var after = sequence.charAt(index + 1);
                    if(before == '1' && after == '1') {
                        return highsingle;
                    }
                    if(before == '1' && after == '0') {
                        return highright;
                    }
                    if(before == '0' && after == '1') {
                        return highleft;
                    }
                    if(before == '0' && after == '0') {
                        return high;
                    }
                } else {
                    var before = sequence.charAt(index - 1);
                    if(before == '0') {
                        return high;
                    }
                    if(before == '1') {
                        return highright;
                    }
                }
            }
        }           
        return low;
    }
});