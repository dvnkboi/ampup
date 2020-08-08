// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';
// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;
// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;
// Chrome 1 - 71
var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

var pnlClicked = 0;
var colorArr = ["rgb(53, 93, 204)", "#8655D6", "#E055CB", "rgb(202, 48, 68)", "rgb(74, 243, 153)", "#96FFF2"];

$("#panelbtn").click(function () { //sidepanel toggle button
  if ($("#panelbtn").hasClass("active")) {
    if ($("#pnlctnt").hasClass("slowAnim")) {
      $("#pnlctnt").removeClass("slowAnim");
    }
    $("#pnlctnt").css('transform', 'translateX(110%) translateZ(0)');
    $("#panelbtn").removeClass("active");
    if ($("#playpauseicon").hasClass("fa fa-play")) {
      $("#socials").css('filter', 'opacity(1)');
    }
    $("#panelbtn").removeClass("open");
    $("#panelico").removeClass("open");
    pnlClicked = 1;
  }
  else {
    if ($("#pnlctnt").hasClass("slowAnim")) {
      $("#pnlctnt").removeClass("slowAnim");
    }
    $("#pnlctnt").css('transform', 'translateX(0%) translateZ(0)');
    $("#panelbtn").addClass("active");
    if ($("#playpauseicon").hasClass("fa fa-play")) {
      $("#socials").css('filter', 'opacity(0.2)');
    }
    $("#panelbtn").addClass("open");
    $("#panelico").addClass("open");
    pnlClicked = 1;
  }
});

/*
$(".body,#player-controls,#background").mouseup(function(e){
    var container = $("#pnlctnt");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        if($("#panelbtn").hasClass("active")){
            $( "#panelbtn" ).trigger( "click" );  
        }

    }
});
*/
$("#connWarn").click(function () {
  $("#connWarn").css({
    "pointer-events": "none",
    "opacity": "0"
  });
  setTimeout(function () {
    $("#connWarnText").html("Some functions might not work properly");
  }, 500);
});

function resetWarm() {
  setTimeout(function () {
    $("#connWarn").css({
      "pointer-events": "none",
      "opacity": "0"
    });
    setTimeout(function () {
      $("#connWarnText").html("Some functions might not work properly");
    }, 500);
    connFail = 0;
    connWarn = 0;
  }, 15000);
}


$("#app").mouseup(function (e) {
  if (($("#switchp").hasClass("switch"))) {
    $("#switchp").trigger("click");
  }
});

/*
$("#sumbitbtn,#sumbitrqstbtn").click(function(){ //submit button functions
    $("#contact-wrapper").css("filter","opacity(0%)").css("pointer-events","none");
    $("#request-wrapper").css("filter","opacity(0%)").css("pointer-events","none");

    $('#popup-wrapper')
    .delay(800)
    .queue(function (next) { 
        $(this).css("filter","opacity(0%)").css("pointer-events","none"); 
        next(); 
    });
    $('#background')
    .delay(0)
    .queue(function (next) { 
        $(this).css("transform","scale(1)"); 
        next(); 
    });
    
    $('#thankyou')
    .delay(200)
    .queue(function (next) { 
        $(this).css("filter","opacity(100%)"); 
        next(); 
    });
    $("#thankyou").delay(600);
    $('#thankyou')
    .delay(200)
    .queue(function (next) { 
        $(this).css("filter","opacity(0%)"); 
        next(); 
    });
    document.addEventListener("keyup", spacepp);
    document.addEventListener("keydown", arrowDefault,false);
    document.addEventListener("keydown", arrowVol);
});


$("#closecontact , #closerequest").click(function(){ //close buttons for the contact and request forms
    $("#contact-wrapper").css("filter","opacity(0%)").css("pointer-events","none");
    $("#request-wrapper").css("filter","opacity(0%)").css("pointer-events","none");
    $("#popup-wrapper").css("filter","opacity(0%)").css("pointer-events","none");
    $('#background').css("transform","scale(1)");
    document.addEventListener("keyup", spacepp);
    document.addEventListener("keydown", arrowDefault,false);
    document.addEventListener("keydown", arrowVol);
});

$("#contact").click(function(){//contact button 
    $("#contact-wrapper").css("filter","opacity(100%)").css("pointer-events","auto");
    $("#popup-wrapper").css("filter","opacity(100%)").css("pointer-events","auto");
    $('#background').css("transform","scale(1.2)");
    document.removeEventListener("keyup", spacepp);
    document.removeEventListener("keydown", arrowDefault,false);
    document.removeEventListener("keydown", arrowVol);
});

$("#request").click(function(){//request button
    $("#request-wrapper").css("filter","opacity(100%)").css("pointer-events","auto");
    $("#popup-wrapper").css("filter","opacity(100%)").css("pointer-events","auto");
    $('#background').css("transform","scale(1.2)");
    document.removeEventListener("keyup", spacepp);
    document.removeEventListener("keydown", arrowDefault,false);
    document.removeEventListener("keydown", arrowVol);
});
*/
document.addEventListener("keyup", function (e) {//escape key to get out of forms and side panel 
  if (e.key === "Escape") {
    document.addEventListener("keyup", spacepp);
    document.addEventListener("keydown", arrowDefault, false);
    document.addEventListener("keydown", arrowVol);
    $('.glide').slick('slickGoTo', 1);
    if (($("#switchp").hasClass("switch"))) {
      $("#switchp").trigger("click");
    }
    if ($("#panelbtn").hasClass("active")) {
      $("#pnlctnt").css('transform', 'translateX(110%) translateZ(0)');
      $("#panelbtn").removeClass("active");
      if ($("#playpauseicon").hasClass("fa fa-play")) {
        $("#socials").css('filter', 'opacity(1)');
      }
      $("#panelbtn").removeClass("open");
      $("#panelico").removeClass("open");
    }
  }
  if (e.key === "i") {
    if ($("#panelbtn").hasClass("active")) {
      $("#pnlctnt").css('transform', 'translateX(110%) translateZ(0)');
      $("#panelbtn").removeClass("active");
      if ($("#playpauseicon").hasClass("fa fa-play")) {
        $("#socials").css('filter', 'opacity(1)');
      }
      $("#panelbtn").removeClass("open");
      $("#panelico").removeClass("open");
    }
    else {
      $("#pnlctnt").css('transform', 'translateX(0%) translateZ(0)');
      $("#panelbtn").addClass("active");
      if ($("#playpauseicon").hasClass("fa fa-play")) {
        $("#socials").css('filter', 'opacity(0.2)');
      }
      $("#panelbtn").addClass("open");
      $("#panelico").addClass("open");
    }
  }
});

$("#switchg").click(function () {//theme switch 
  if ($(this).hasClass("light")) {//dark theme
    darkTheme();
    return;

  }
  if ($(this).hasClass("amoled")) {//light theme
    lightTheme();
    return;
  }
});


function lightTheme(colorArr) {
  try {
    if (colorArr.length > 1) {
      $(":root").css({
        "--bl": colorArr[0] ? colorArr[0] : "blue",
        "--pu": colorArr[1] ? colorArr[1] : "purple",
        "--pi": colorArr[2] ? colorArr[2] : "pink",
        "--re": colorArr[3] ? colorArr[3] : "red",
        "--grn": colorArr[4] ? colorArr[4] : "green",
      });
    }
    else {
      $(":root").css({
        "--bl": "rgb(53, 93, 204)",
        "--pu": "#8655D6",
        "--pi": "#E055CB",
        "--re": "rgb(202, 48, 68)",
        "--grn": "rgb(74, 243, 153)",
        "--cy": "#96FFF2",
        "--yl": "#f2f547"
      });
    }
  }
  catch (e) {
    console.log("null color array");
  }
  $(":root").css({
    "--wh": "#F9FFFD",
    "--gr": "#2A363D",
    "--grd": "#212B30",
    "--bg": "#F9FFFD",
    "--pbg": "#F9FFFD",
    "--pnlbg": "#F9FFFD",
    "--primary": "#1a1a1a",
    "--secondary": "rgba(26,26,26,0.8)",
    "--contrast": "#F9FFFD",
    "--Ds": "0px 4px 3px rgba(0,0,0,0)"
  });
  $(".invert").css("filter", "invert(0)");
  $(".cast").css("filter", "drop-shadow(0px 0px 0rem rgba(255,255,255,0))");
  $("#volumeS").css("filter", "invert(0)!important");
  console.log("poof light");
  $("#switchg").removeClass("amoled");
  $("#switchg").addClass("light");
  $("#switchg").html("Theme: Light");
  $(".light").css("opacity", "1");
  $(".dark").css("opacity", "0");
  window.localStorage.setItem("theme", "light");
}

function darkTheme(colorArr) {
  try {
    if (colorArr.length > 1) {
      $(":root").css({
        "--bl": colorArr[0] ? colorArr[0] : "blue",
        "--pu": colorArr[1] ? colorArr[1] : "purple",
        "--pi": colorArr[2] ? colorArr[2] : "pink",
        "--re": colorArr[3] ? colorArr[3] : "red",
        "--grn": colorArr[4] ? colorArr[4] : "green",
      });
    }
    else {
      $(":root").css({
        "--bl": "rgb(53, 93, 204)",
        "--pu": "#8655D6",
        "--pi": "#E055CB",
        "--re": "rgb(202, 48, 68)",
        "--grn": "rgb(74, 243, 153)",
        "--cy": "#96FFF2",
        "--yl": "#f2f547"
      });
    }
  }
  catch (e) {
    console.log("null color array");
  }

  $(":root").css({
    "--wh": "#F9FFFD",
    "--gr": "#F9FFFD",
    "--grd": "#212B30",
    "--bg": "hsla(241, 25%, 4%, 1)",
    "--pbg": "#0f0f0f",
    "--pnlbg": "#080808",
    "--primary": "#F9FFFD",
    "--secondary": "rgba(249,255,253,0.8)",
    "--contrast": "rgb(10,10,10)",
    "--Ds": "0px 0px 3px rgba(0,0,0,0.3)"
  });
  $(".invert").css("filter", "invert(1)");
  $(".cast").css("filter", "drop-shadow(0px 0px 0.5rem rgba(0,0,0,1))");
  $("#volumeS").css("filter", "invert(1)!important");
  console.log("poof Dark");
  $("#switchg").removeClass("light");
  $("#switchg").addClass("amoled");
  $("#switchg").html("Theme: Dark");
  $(".light").css("opacity", "0");
  $(".dark").css("opacity", "1");
  window.localStorage.setItem("theme", "dark");
}


document.addEventListener("keyup", function (event) { //glide controls
  if (event.code === 'ArrowRight' || event.key === 'd') {
    $('.glide').slick("slickNext");
  }
  //method similar to arrow down doesn't work 
  if (event.code === 'ArrowLeft' || event.key === 'a') {
    $('.glide').slick("slickPrev");
  }
});

$("#rightArrow").click(function () {
  $('.glide').slick("slickNext");
});

$("#leftArrow").click(function () {
  $('.glide').slick("slickPrev");
});

$("#switchp,#switchpside").click(function () { //settings panel
  if ($(this).hasClass("switch")) { //default state
    $(this).removeClass("switch");
    $(this)
      .css("transform", "rotate(0deg)")
      .css("filter", "invert(0)");
    $("#settingsWrapper").css("filter", "opacity(0)");
    $("#settings").css("transform", "translateX(-100%)").css("pointer-events", "none");
    $("#switchpside").css("filter", "invert(0)");

  }
  else { //open settings menu
    $(this).addClass("switch");
    $(this)
      .css("transform", "rotate(45deg)")
      .css("filter", "invert(1)");
    $('#background2 , #background1').css("filter", "opacity(0)");
    $("#settingsWrapper").css("filter", "opacity(1)");
    $("#settings").css("transform", "translateX(0%)").css("pointer-events", "auto");
    $("#switchpside").css("filter", "invert(0)");
  }
});

$("#NS").click(function () {
  $('.glide').slick('slickGoTo', 0);
});

$("#N1").click(function () {
  $('.glide').slick('slickGoTo', 1);
});

$("#N2").click(function () {
  $('.glide').slick('slickGoTo', 2);
});

$("#N3").click(function () {
  $('.glide').slick('slickGoTo', 3);
});

$('.glide').on('afterChange', function (event, slick, currentSlide) {
  var i = currentSlide;
  switch (i) {
    case 0:
      $("#NS").addClass("active");
      $("#N1,#N2,#N3").removeClass("active");
      break;
    case 1:
      $("#N1").addClass("active");
      $("#N2,#N3,#NS").removeClass("active");
      if (!correctMetaOnFocusRunning) {
        correctMetaOnFocus(3);
      }
      break;
    case 2:
      $("#N2").addClass("active");
      $("#N1,#N3,#NS").removeClass("active");
      break;
    case 3:
      $("#N3").addClass("active");
      $("#N1,#N2,#NS").removeClass("active");
      break;
    default:
      $("#NS,#N1,#N2,#N3").removeClass("active");
  }
});


function visHigh() {
  $("#switchq").removeClass("lowq");
  $("#switchq").removeClass("offq");
  $("#switchq").removeClass("autoq");
  $("#switchq").addClass("highq");
  $("#switchq").html("visualizer quality: High");
  quality = 2;
  window.localStorage.setItem('visualizer', "high");

}

function visLow() {
  $("#switchq").removeClass("offq");
  $("#switchq").removeClass("autoq");
  $("#switchq").removeClass("highq");
  $("#switchq").addClass("lowq");
  $("#switchq").html("visualizer quality: Low");
  window.localStorage.setItem('visualizer', "low");
  quality = 1;
}

function visOff() {
  $("#switchq").removeClass("autoq");
  $("#switchq").removeClass("highq");
  $("#switchq").removeClass("lowq");
  $("#switchq").addClass("offq");
  $("#switchq").html("visualizer quality: Off");
  window.localStorage.setItem('visualizer', "off");
  quality = 0;
}

function visAuto() {
  $("#switchq").removeClass("highq");
  $("#switchq").removeClass("lowq");
  $("#switchq").removeClass("offq");
  $("#switchq").addClass("autoq");
  $("#switchq").html("visualizer quality: Auto");
  window.localStorage.setItem('visualizer', "auto");
  quality = 3;
  start();
}

$("#switchq").click(function () {
  if ($("#switchq").hasClass("autoq")) {
    visHigh();
    setVizQ();
    return; 
  }
  if ($("#switchq").hasClass("highq")) {
    visLow();
    setVizQ();
    return; 
  }
  if ($("#switchq").hasClass("lowq")) {
    visOff();
    setVizQ();
    return; 
  }
  if ($("#switchq").hasClass("offq")) {
    visAuto();
    setVizQ();
    return; 
  }
});

$("#playbtn").click(function () {
  if ($("#playbtn").hasClass("playing")) { //not playing
    //console.log("not playing");
    $("#playbtn").removeClass("playing");
    $("#pauseIco").css("transform", "translate(120%) scale(0.5)").css("filter", "opacity(0.4)");
    $("#playIco").css("transform", "translate(0%) scale(1)").css("filter", "opacity(1)");
    pause();
    clearInterval(timerinterval);
  }
  else { //playing
    //console.log("playing");
    $("#playbtn").addClass("playing");
    $("#playIco").css("transform", "translate(-120%) scale(0.5)").css("filter", "opacity(0.4)");
    $("#pauseIco").css("transform", "translate(0%) scale(1)").css("filter", "opacity(1)");
    setupAudio();
    play();
    reset();
    setTimeout(function () {
      if (audioPlayEvt == 0) {
        timerinterval = setInterval(update, 1000);
        console.log("setup interval", audioPlayEvt);
      }
    }, 50);
    setTimeout(function () {
      console.log("reset event");
      audioPlayEvt = 0;
    }, 50);
    audio.play();
  }
});

$("#embedimage").click(function () {
  $("#embedimagebig").css({
    "margin-top": "-130px",
    "pointer-events": "auto",
    "filter": "opacity(1)"
  });
  $("#embedimage").css({
    "margin-left": "-80px",
    "pointer-events": "none",
    "filter": "opacity(0)"
  });

});

$("#embedimagebig").click(function () {
  $("#embedimagebig").css({
    "margin-top": "-60px",
    "pointer-events": "none",
    "filter": "opacity(0)"
  });
  $("#embedimage").css({
    "margin-left": "0px",
    "pointer-events": "auto",
    "filter": "opacity(1)"
  });
});

$("#embedimage").on("load", function () {
  $("#embedimage").css({
    "margin-left": "0px",
    "pointer-events": "auto",
    "filter": "opacity(1)"
  });
});


$('.carousel').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
  //console.log(nextSlide);
});

$(window).on('load', function () {
  setupParticles();
  setTimeout(function () {
    $('.loader').css("transform", "translateY(-100%)");
  }, 1200);
  setMetadata();
});

function loadingSeq() {
  resetLoader();
  setTimeout(showLoader, 350);
  setTimeout(resetLoader, 2450);
}

function resetLoader() {
  $('.loader').css("transition-duration", "0s");
  $('.loader')
    .delay(10)
    .queue(function (next) {
      $(this).css({
        "transform": "translateY(0%)",
        "height": "0%"
      });
      next();
    });
  $('.loader')
    .delay(20)
    .queue(function (next) {
      $(this).css("transition-duration", "600ms");
      next();
    });
}

function showLoader() {
  $('.loader').css("height", "100%");
  setTimeout(function () {
    $('.loader').css("transform", "translateY(-100%)");
  }, 1200);
}

function setupParticles() {
  setCicleRandomness();

  setInterval(function () {
    $('.circles').css("opacity", "0");
    setTimeout(setCicleRandomness, 4000);
    setTimeout(function () {
      $('.circles').css("opacity", "1");
    }, 5000);
  }, 80000);
}


function setCicleRandomness() {
  $('.circle').each(function (i, obj) {
    var color = colorArr[Math.floor(Math.random() * colorArr.length)];
    var square = Math.floor(Math.random() * 300) + "px";
    //console.log(color);
    $(obj).css({
      "background": color,
      "left": Math.floor(Math.random() * 100) + "%",
      "width": square,
      "height": square,
      "animation-delay": Math.floor(Math.random() * 5) + "s",
      "animation-duration": (Math.floor(Math.random() * 32) + 40) + "s",
      "bottom": (Math.floor(Math.random() * (-50)) - 300) + "px"
    });
  });
}

function disableParticles() {
  $(".area").css("filter", "opacity(0)");
  setTimeout(function () {
    $(".circle").css("animation-play-state", "paused");
  }, 400);
  $("#bgParticles").html("Background particles: OFF");
  $("#bgParticles").removeClass("active");
  window.localStorage.setItem('particles', "false");
}

function enableParticles() {
  $(".circle").css("animation-play-state", "running");
  $(".area").css("filter", "opacity(1)");
  $("#bgParticles").html("Background particles: ON");
  window.localStorage.setItem('particles', "true");
  $("#bgParticles").addClass("active");
}

function toggleBg() {
  if ($("#bgParticles").hasClass("active")) {
    disableParticles();
  }
  else {
    enableParticles();
  }
}


$("#bgParticles").click(function () { //sidepanel toggle button
  toggleBg();
});

function findElem(element) {
  return $(document).find(element);
}

var scrollToBottomWithTimeout = function (param_iterations, param_wait_time) {
  setTimeout(function () {
    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);

    if (param_iterations > 0) {
      param_iterations = param_iterations - 1;
      scrollToBottomWithTimeout(param_iterations, param_wait_time);
    }
  }, param_wait_time);
};
var vizColors;

function changeRootColors(newColorObj) {
  colorArr = newColorObj[Math.floor(Math.random() * newColorObj.length)];
  var themeState = window.localStorage.getItem('theme');
  if (themeState == "dark") {
    darkTheme(colorArr);

  }
  else if (themeState == "light") {
    lightTheme(colorArr);
  }
  setCicleRandomness();
  console.log(colorArr);
  c1 = tinycolor(colorArr[0]).toHsl();
  c2 = tinycolor(colorArr[1]).toHsl();
  c3 = tinycolor(colorArr[2]).toHsl();
  c4 = tinycolor(colorArr[3]).toHsl();
  c5 = tinycolor(colorArr[4]).toHsl();
  c1 = [c1.h, c1.s, c1.l];
  c2 = [c2.h, c2.s, c2.l];
  c3 = [c3.h, c3.s, c3.l];
  c4 = [c4.h, c4.s, c4.l];
  c5 = [c5.h, c5.s, c5.l];
  // c1 = hexToHSL(c1) ;
  // c2 = hexToHSL(c2);
  // c3 = hexToHSL(c3);
  // c4 = hexToHSL(c4);
  // c5 = hexToHSL(c5);
  vizColors = [c1, c2, c3, c4, c5];
  var closestPairs = [];
  for (var i = 0; i < vizColors.length; i++) {
    vizColors[i][1] = map(vizColors[i][1], 0, 1, 0, 100);
    vizColors[i][2] = map(vizColors[i][2], 0, 1, 0, 100);
    var minArray = vizColors.slice();
    minArray.splice(i, 1);
    var minDist = 99999;
    var minPair;
    for (var j = 0; j < minArray.length; j++) {
      var currDist = Math.abs(vizColors[i][0] - minDist);
      var checkDist = Math.abs(vizColors[i][0] - minArray[j][0]);
      if ((Math.min(currDist, checkDist) == checkDist)) {
        minPair = minArray[j];
        minDist = minArray[j][0];
      }
    }
    closestPairs.push([vizColors[i], minPair]);
  }

  c1 = closestPairs[0][0];
  c2 = closestPairs[0][1];
  c3 = closestPairs[2][0];
  c4 = closestPairs[2][1];
  var tmp;
  tmp = c1[0];
  c1[0] = Math.max(c1[0], c2[0]);
  c2[0] = Math.min(tmp, c2[0]);
  tmp = c3[0];
  c3[0] = Math.max(c3[0], c4[0]);
  c4[0] = Math.min(tmp, c4[0]);

  console.log(closestPairs, c1, c2, c3, c4);

}

changeRootColors([["#FFBE0B", "#FB5607", "#FF006E", "#8338EC", "#3A86FF"]]);
