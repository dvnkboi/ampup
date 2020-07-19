/*

function setRndMsg(){
    var rndNames = ["Maxx","MACCA","Bob","Gertrude","Steve","Sophia","Bruhhh"];
    var rndTimes = ["a literal microsecond ago",
                    "13 billion years ago",
                    "before existance itself",
                    Math.floor(Math.random()*30)  + " minutes ago",
                    Math.floor(Math.random()*30)  + " seconds ago"];
    var rndActions = ["smashed the like button on our facebook page",
                      "demolished bookmark button on our website",
                      "grew a huge brain by reading all the descriptions of all the artists",
                      "made a potato smile by drawing a smiley face on it",
                      "layed an egg",
                      "tought horse radish was radish from a horse",
                      "requested rickroll on the player but we denied it"];

    var rndSentence = rndNames[Math.floor(Math.random() * rndNames.length)] + 
        " just " + rndActions[Math.floor(Math.random() * rndActions.length)] + 
        " " + rndTimes[Math.floor(Math.random() * rndTimes.length)];

    var rndButton = ["wow, thanks","nice","very cool","epic","impossible!"];
    var btnText = rndButton[Math.floor(Math.random() * rndButton.length)];
    
    $("#rndButton").html(btnText);
    $("#rndText").html(rndSentence);
    $("#rndMsglol").css({
        "pointer-events":"auto",
        "transform":"translateY(0%)",
        "opacity":"1"
    });
}

$("#rndButton").click(function(){
    $("#rndMsglol").css({
        "pointer-events":"none",
        "transform":"translateY(150%)",
        "opacity":"0"
    });
});


(function loop() {
    var rand = Math.round(Math.random() * (30000 - 15000)) + 15000;
    setTimeout(function() {
            setRndMsg();
            loop();  
    }, rand);
}());

*/