//globals 
var drawLoop;
var timerinterval;
var hasstarted = 0;
var context;
var src;
var analyser;
var canvas;
var ctx;
var ctxLength;
var dataArray;
var WIDTH;
var HEIGHT;
var hrs = 0;
var mins = 0;
var secs = 0;
var playing = false;
var particle1;
var particle2;
var winH;
var winW;
var view = 1;
var quality = 3;
var today = new Date();
var time = today.getHours();
var c;
var logindex;
var low;
var high;
var lv;
var hv;
var b;
var v;
var globalVol = 0;
var Tplay;
var fadeTimer;
var artistImg;
var playingflag = 0;
var fillerAudio = document.getElementById("audioFiller") || {};
fillerAudio.volume = 0;
var playLimit = 0;
var audioPlayEvt = 0;
var timer = 0;
var syncTimer;
var metadataOffset = 0;
var metadataTimer;
var metadataTrigger = 0;
var connWarn = 0;
var connFail = 0;
var reloadingAudio = 0;
var timerTimeout = 0;
var playPauseInterval;
var audio = {};
audio.volume = null;
var syncCounter = 0;
var resizeTimer;
var c1 = [309, 70, 60], c2 = [225, 100, 80], c3 = [263, 50, 50], c4 = [148, 100, 80];
const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;
var toLog = (value, min, max) => min * Math.pow(max/min, (value-min) / (max-min));

var nmbrAvg,fps, VOL,origgain,lowpass,barWidth,barHeight,x,drawLim; 


//const StrmURL = 'http://streaming401.radionomy.com:80/calm-piano';
//const StrmURL = 'http://streaming401.radionomy.com:80/OLDIESRADIOONLINE';
//const StrmURL = 'https://www.googleapis.com/drive/v3/files/1Yzspg8oK78oELMWXlFyoMcmUY7JEitDN?alt=media&key=AIzaSyCJdwRI4wj8pw1Ov3nJpHUQwT8MZNqDvQc';
//const StrmURL = 'https://ia802705.us.archive.org/23/items/chillmusic/Madeon%20-%20Nonsense%20%28Audio%29%20ft.%20Mark%20Foster.mp3';
const StrmURL = 'https://ampupradio.com:8000/stream.mp3';
//var gi1;
//var gi2;
//var gi3;
//var gi4;

// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';
// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
// Internet Explorer 6-11
var isIE = false || !!document.documentMode;
// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;
// Chrome 1 - 71
var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

//audio setup function(only runs on first play) used to create all contexts(requires user permissions)
function setupAudio() {
  if (hasstarted == 0) {
    console.log("lets a go");
    fillerAudio.play();
    addAudio();
    setupAudioEvents();
    context = new AudioContext();
    src = context.createMediaElementSource(audio);
    analyser = context.createAnalyser();
    canvas = document.getElementById("vizcanvas");
    canvas.width = 1450;
    canvas.height = 70;
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = ctx.webkitImageSmoothingEnabled = ctx.mozImageSmoothingEnabled = ctx.msImageSmoothingEnabled = ctx.oImageSmoothingEnabled = false;
    src.connect(analyser);
    analyser.connect(context.destination);
    //fft size higher = higher precision 
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.65;
    ctxLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(ctxLength);
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    audio.play();
    if (isOpera || isIE || isChrome || isEdge || isBlink || isSafari) {
      console.log("normie browser");
      start();
    } else if (isFirefox) {
      start();
      console.log("firefox dum");
      $("#likeCont").css("transition", "none");
      $(':root').css("--quick", "none").css("--med", "none").css("--slow", "none");
      $("#firefoxwarn").css("max-height", "28px");
    }
    else {
      console.log("u using chrome huh ? good boi");
      start();
    }
    hasstarted = 1;
  }
}

//adds all the key event listeners 
document.addEventListener("keyup", spacepp);
document.addEventListener("keydown", arrowDefault, false);
document.addEventListener("keydown", arrowVol);


$("panelcontainer").disableSelection;

$(document).ready(function () {

  $('.loader').css("height", "100%");
  $('.glide').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true,
    initialSlide: 1,
    accessibility: false,
    swipe: true,
    touchMove: true,
    arrows: false,
    infinite: false,
    swipeToSlide: true,
    speed: 250,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  });
  reset();
  try {
    document.getElementById("volumeS").value = 0;
  }
  catch (e) {
    console.log("audio oofed");
  }
  if (!isFirefox) {
    $('body')
      .delay(200)
      .queue(function (next) {
        $(this).css('filter', 'opacity(1)');
        next();
      });

    $('#bgop')
      .delay(2000)
      .queue(function (next) {
        $(this).css('filter', 'opacity(1)');
        next();
      });
    console.log("we went through this , u using normie browser");
  }
  else if (isFirefox) {
    console.log("browser Firefox begin");
    $("#likeCont").css("transition", "none");
    $(':root').css("--quick", "none").css("--med", "none").css("--slow", "none");
  }

  $('.infotxt')
    .delay(5000)
    .queue(function (next) {
      $(this).css('filter', 'opacity(0)').css('pointer-events', 'none').css('-webkit-filter', 'opacity(0)');
      next();
    });
  scrapenews('dance');

  setTimeout(function () {
    $('a').click(function () {
      $(this).prop('target', '_blank').prop('rel', 'noopener');
    });
  }, 4000);

});



function play() {
  playing = true;
  Tplay = true;
}

function pause() {
  playing = false;
}


//frame drawing polyfill
window.requestAnimationFrame = window.requestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame
  || function (f) { return setTimeout(f, 1000 / 60) } // simulate calling code 60 

window.cancelAnimationFrame = window.cancelAnimationFrame
  || window.mozCancelAnimationFrame
  || function (requestID) { clearTimeout(requestID) } //fall back

function start() { //main audio viz logic function
  //clipping reduction factor
  nmbrAvg = 3;
  fps = 60;
  //get volume from slider
  //viz reaction to volume control
  VOL;
  try {
    VOL = 0.5 * audio.volume + 0.5;
  }
  catch (e) {
    console.log("audio ded lol");
  }
  //viz gain control
  origgain = 0.00100;
  //viz highshelf control 
  lowpass = -200;

  barWidth = (WIDTH / ctxLength) * 2.5;
  barHeight;
  x = 3;
  drawLim = 3;
  setVizQ();
  playPauseInterval = window.setInterval(playPause, 50);
  //initVolSlider();
  //render loop
  drawLoop = new FpsCtrl(fps, renderFrame);
  drawLoop.start();
  function renderFrame() {
    try {
      if (quality != 0) { //viz is on
        //audio linear interpolation  

        x = 0; //init pos for drawing the viz
        var multipl = 1; //multiplier for lowpass
        analyser.getByteFrequencyData(dataArray);

        //ctxbg.clearRect(0, 0, WIDTH, HEIGHT);

        ctx.clearRect(0, 0, WIDTH, HEIGHT); //clear previous frame

        if (view == 1) {
          //reduce visualizer clipping set by nmbrAvg(adds randomness to viz)
          for (var i = 0; i < nmbrAvg; i++) {
            for (var j = 0; j < Math.floor(ctxLength / 8); j++) {
              dataArray[j] = dataArray[j] - dataArray[j] * Math.random() * 0.03;
            }
          }
        }

        //lower the rate at which the bar height drops for the viz when lowering volume
        VOL = 0.1 * audio.volume + 0.9;
        if (audio.volume == 0.0) {
          VOL = 1;
        }
        else {
          gain = origgain * VOL;
        }
        var gain = origgain * (1 / VOL);
        var h;
        var s;
        var l;
        for (var i = 1; i < Math.floor(ctxLength / drawLim); i++) { //drawing each bar at a time from the dataarray 
          barHeight = dataArray[i];
          // c            = Math.floor(ctxLength/drawLim)/2;
          // logindex     = toLog(i,1,80);
          // low          = Math.floor(logindex);
          // high         = Math.ceil(logindex);
          // lv           = dataArray[low];
          // hv           = dataArray[high];
          // b            = (logindex-low)/(high-low);
          // v            = lv + (hv-lv)*b || 0;
          
          // barHeight    = v*2700/Math.sqrt(10000000  +Math.pow(i,4.5));
          // barHeight += dataArray[i]*Math.exp(-1500/Math.pow(i+0.5, 2));
          //barHeight *= 1.13;

          
          if ($("#switchg").hasClass("light")) {
            h = Math.floor(map(i, 0, (ctxLength / drawLim), c1[0], c2[0]));
            s = Math.floor(map(i, 0, (ctxLength / drawLim), c1[1], c2[1]));
            l = Math.floor(map(barHeight ** 2, 0, 255 ** 2, Math.min(c3[2], c4[2]), Math.min(Math.max(c3[2], c4[2]) + 10, 70)));
          }
          else {
            h = Math.floor(map(i, 0, (ctxLength / drawLim), c3[0], c4[0]));
            s = Math.floor(map(i, 0, (ctxLength / drawLim), c3[1], c4[1]));
            l = Math.floor(map(barHeight ** 2, 0, 255 ** 2, Math.max(Math.min(c3[2], c4[2]) - 20,30), Math.min(Math.max(c3[2], c4[2]) + 20, 65)));
          }
          ctx.fillStyle = "	hsl(" + h + ", " + s + "%, " + l + "%)";
          ctx.fillRect(x - barWidth - 1, HEIGHT - barHeight * barHeight * gain * multipl, barWidth / 1.2, barHeight * barHeight * gain * multipl);
          multipl -= multipl * (lowpass / 100000);
          x += barWidth + 1;
        }
      }
      else {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        return;
      }
    }
    catch (e) {
    }
  }
};




function arrowDefault(e) { //clearing default functions of arrow keys 
  // space and arrow keys
  if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}

//control playback with spacebar 
function spacepp(event) {
  if (event.code === 'Space') {
    event.preventDefault();
    $("#playbtn").trigger("click");
  }
}

function arrowVol(event) { //volume control with arrow keys 
  if (event.code === 'ArrowDown' || event.key === 's') {
    document.getElementById("volumeS").value -= 20;
  }
  //method similar to arrow down doesn't work 
  if (event.code === 'ArrowUp' || event.key === 'z' || event.key === 'w') {
    var volup = document.getElementById("volumeS").value;
    if (volup >= 0) {
      if (volup >= 20) {
        if (volup >= 40) {
          if (volup >= 60) {
            if (volup >= 80) {
              document.getElementById("volumeS").value = 100;
              return;
            }
            document.getElementById("volumeS").value = 80;
            return;
          }
          document.getElementById("volumeS").value = 60;
          return;
        }
        document.getElementById("volumeS").value = 40;
        return;
      }
      document.getElementById("volumeS").value = 20;
      return;
    }
  }
}

//change volume of audio content
/*
function initVolSlider(){
    window.setInterval(function(){
    
    },80);
}
*/


function resyncAudio() {
  try {
    if (playing) {
      syncCounter = 0;
    }
    if (timer - Math.floor(audio.currentTime) > 2
      && timer - Math.floor(audio.currentTime) <= 100
      && !playing && timerTimeout == 0 && syncCounter <= 100) {
      audio.currentTime = timer;
      console.log("yo whatchu doin pausin like that , imma fix that for ya");
      timerTimeout = 1;
      syncCounter++;
      setTimeout(function () {
        timerTimeout = 0;
      }, 3000);
    }
    else if ((timer - Math.floor(audio.currentTime) > 100 && timerTimeout == 0 || syncCounter == 101) && !playing) {
      songChanged = 5;
      metaNoChange = 5;
      syncCounter++;
      clearInterval(syncTimer);
      audio.src = "";
      audio.src = StrmURL;
      timer = 0;
      console.log("oof u killed billy the stream");
      timerTimeout = 1;
      setTimeout(function () {
        timerTimeout = 0;
      }, 3000);
    }
  }
  catch (e) {
    console.log("audio ded lol");
  }

}


function update() { //update function for the timer 
  var hrstxt;
  var minstxt;
  var secstxt;
  if (secs >= 59) { secs = 0; mins++; }
  if (mins >= 59) { mins = 0; hrs++; }
  if (hrs == 24) { reset(); }
  if (hrs < 10) { hrstxt = '0' + hrs; } else { hrstxt = hrs; }
  if (mins < 10) { minstxt = '0' + mins; } else { minstxt = mins; }
  if (secs < 10) { secstxt = '0' + secs; } else { secstxt = secs; }
  $("#timer").html(hrstxt + ':' + minstxt + ':' + secstxt);
  secs++;
}

function reset() { //resetting the timer and it's display 
  clearInterval(update());
  hrs = 0;
  mins = 0;
  secs = 0;
  //document.getElementById('timer').innerHTML = "00" + ':' + "00" + ':' + "00" ;
  $("#timer").html("00" + ':' + "00" + ':' + "00");
  playLimit = 0;
}

//extra util functions
function p5Lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t
}

function playPause() {
  var vol = document.getElementById('volumeS');
  //console.log(playing + " " + Tplay);
  if (playingflag == 1) {
    if (playing && Tplay) { //mute the audio when pausing to keep client and server in sync
      var y = vol.value / 100;
      //audio.volume = y;
      audio.volume = p5Lerp(audio.volume, y, 0.06);
      fadeTimer = setTimeout(function () {
        Tplay = false;
      }, 1000);
    }
    else if (playing && Tplay == false) {
      var y = vol.value / 100;
      //audio.volume = y;
      audio.volume = p5Lerp(audio.volume, y, 0.8);
    }
    else {
      //audio.volume = 0;
      //globalVol = 0;
      audio.volume = p5Lerp(audio.volume, 0, 0.9);
      clearTimeout(fadeTimer);
      Tplay = true;
    }
  }
}

function WriteCookie(name, value) {
  document.cookie = name + value;
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function setupAudioEvents() {
  var audioFillerInt;

  audio.onpause = function (e) {
    e.preventDefault();
    console.log("uhhhh , why u got a radio app if u aint gon ple");
    $("#playbtn").removeClass("playing");
    $("#pauseIco").css("transform", "translate(120%) scale(0.5)").css("filter", "opacity(0.4)");
    $("#playIco").css("transform", "translate(0%) scale(1)").css("filter", "opacity(1)");
    pause();
    clearInterval(timerinterval);
    audioPlayEvt = 0;
  };

  audio.onplay = function () {
    if (!$("#playbtn").hasClass(playing)) {
      $("#playbtn").addClass("playing");
      $("#playIco").css("transform", "translate(-120%) scale(0.5)").css("filter", "opacity(0.4)");
      $("#pauseIco").css("transform", "translate(0%) scale(1)").css("filter", "opacity(1)");
      setupAudio();
      play();
      reset();
      if (audioPlayEvt == 0) {
        timerinterval = window.setInterval(update, 1000);
      }
      audioPlayEvt = 1;
    }

  };

  audio.onwaiting = function () {

    console.log("we be loadin for ya");
    if (playing == true) {
      $('#playBtnIcons').css("opacity", "0");
      $('#playLoading').css("opacity", "1");
      audioFiller.play();
      audioFillerInt = window.setInterval(function () {
        audioFiller.volume = p5Lerp(audioFiller.volume, 0.018, 0.02);
      }, 20);
      setTimeout(function () {
        clearInterval(audioFillerInt);
        audioFiller.volume = 0.018;
      }, 1000);
    }
    if (metadataTrigger == 0) {
      metadataTimer = window.setInterval(function () {
        metadataOffset++;
        console.log("countin' sheep", metadataOffset);
        if (metadataOffset > 10 && connWarn == 0) {
          $("#connWarn").css({
            "pointer-events": "auto",
            "opacity": "1"
          });
          connWarn++;
        }


        if (metadataOffset > 15 & connFail == 0) {
          $("#connWarn").css({
            "pointer-events": "auto",
            "opacity": "1"
          });
          $("#connWarnText").html("Make sure you're connected");
          connFail++;
          resetWarm();
        }
      }, 1000);
    }
    metadataTrigger = 1;
  };

  audio.oncanplay = function () {
    if (timer == 0) {
      timer = Math.floor(audio.currentTime);
      syncTimer = window.setInterval(function () {
        timer++;
        //console.log(timer,audio.currentTime,Math.abs(timer - Math.floor(audio.currentTime)) > 2);
      }, 1000);
    }
    clearInterval(metadataTimer);
    connFail = 0;
    connWarn = 0;
  };

  audio.onplaying = function () {
    $('#playBtnIcons').css("opacity", "1");
    $('#playLoading').css("opacity", "0");
    audioFillerInt = window.setInterval(function () {
      audioFiller.volume = p5Lerp(audioFiller.volume, 0, 0.5);
    }, 20);
    setTimeout(function () {
      clearInterval(audioFillerInt);
      audioFiller.volume = 0;
      audioFiller.pause();
    }, 1000);
    var audioInt;
    if (playingflag == 0) {
      audio.volume = 0;
      document.getElementById("volumeS").value = 100;
      audioInt = window.setInterval(function () {
        if (playing) {
          audio.volume = p5Lerp(audio.volume, 1, 0.06);
        }
        else {
          audio.volume = p5Lerp(audio.volume, 0, 0.6);
        }
      }, 20);
      fadeTimer = setTimeout(function () {
        clearInterval(audioInt);
        Tplay = false;
        if (playing) {
          audio.volume = 1;
        }
        else {
          audio.volume = 0;
        }
        playingflag = 1;
      }, 2000);
    }
  };
}

function setVizQ(){
  var bigScreen = window.innerWidth >520;
  var highQ = () => {
    barWidth = (WIDTH / ctxLength) * 1.6;
    drawLim = 1;
    try {
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.77;
      lowpass = -200;
    }
    catch (e) {
    }
    fps = 60;
  }
  var lowQ =() => {
    barWidth = (WIDTH / ctxLength) * 3.3;
    drawLim = 3.5;
    try {
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.77;
      lowpass = -400;
    }
    catch (e) {
    }
    fps = 60;
  }
  if (((view == 1 && bigScreen) && quality == 3) || quality == 2) { //high quality viz
    highQ();
  }
  else if (((view == 0 || !bigScreen)  && quality == 3) || quality == 1) {//low quality viz
    lowQ();
  }
}

$(window).on('resize', function (e) {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    setVizQ();
  }, 250);
});