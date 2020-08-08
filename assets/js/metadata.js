

/*
function mainLoop() {
  setTimeout(function() { 
      $.get( "ampupradio.com/state", function( data ) {
        if(data == 'true'){
            setTimeout(function(){
                $.get( "ampupradio.com/history.json", function( data ) {
                    console.log(data.song);
                });
            },8500);
        }
        console.log(data);
      });
    mainLoop();                   
  }, 250)
} 
*/
var prevState = 1;
var currentState = 999;
var marker = 0;
var firstSetup = 0;
var aurLess;
var blured = false;
var w = window.innerWidth;
var deviceCheck = 0;
var globalData = null;
var songChanged = 0;
var metaNoChange = 0;
var songExpectedTime = 100;
var metaChanged = false;
var correctLimit = 0;
var preloadLimit = 0;
var correctedMeta = false;
var tmpOffset;
var songChanging = false;
var currentArtist;
var blurTimer = 0;
var blurInterval;
var histSet = false;
var histData;
var networkCheck = true;
var correctMetaOnFocusRunning = false;

$(window).ready(function () {

  ping('https://ampupradio.com/').then(function (delta) {
    console.log('Ping pong lol ' + String(delta) + ' ms');
    if (delta > 500) {
      connFail++;
      connWarn++;
    }
  }).catch(function (err) {
    console.error('Could not ping remote URL', err);
  });

  function mainLoop() { //main loop 

    prevState = currentState; //reset
    setTimeout(function () {
      if (firstSetup == 0) { // first launch of player
        firstSetup++;
      }
      if ((songExpectedTime < 30 || currentState < 30) && !histSet) { //setting historized data while theres 30 seconds left in the song
        $.ajax({
          url: "https://ampupradio.com/history.json",
          dataType: "json",
          success: function (data) {
            histData = data;
            histSet = true;
            setTimeout(function () { //so as to not keep updating historized data while the codition of currenttime < 30 is true, gives 10 seconds of padding too
              histSet = false;
            }, 40000);
            console.log("historized meta set");
          }
        });
      }
      if ((songExpectedTime < 10 || currentState < 10) && marker === 0) { //start song changing sequence once 
        marker = 1;
        console.log("song go BRRRRR");
        songChanged++;
        tmpOffset = metadataOffset;
        if (metadataOffset >= 5) {
          tmpOffset = metadataOffset - Math.sqrt(metadataOffset); //calculate the offset if more than 5 second expected offset 
          console.log("meta be like ", tmpOffset); //doing point data analysis square root seemed to be the closest approximation for delay above expected time delays
        }
        var audioSyncOffset = 0;
        try {
          audioSyncOffset = Math.abs(timer - Math.floor(audio.currentTime)); // try and keep metadata changes and song changes synced 
        }
        catch (e) {
          console.log("meta not good very bad"); //chrome will not let u play audio without user's consent hence the try catch audio not set => cannot read blah blah
        }
        if (correctedMeta == false ) { // if the meta has already been corrected by the force function dont rerun the meta function
          setMetadata(tmpOffset, histData, 10 , audioSyncOffset * 1000 + 12000); //setting metadata 
        }
        setTimeout(function () { //reset ability to run metadata function
          marker = 0;
        }, 12500);
      }
      if (songExpectedTime < currentState / 2) { // update the timer to current time left on the song 
        $.ajax({
          url: "https://ampupradio.com/state",
          dataType: "text",
          success: function (data) {
            songExpectedTime = Math.floor(parseInt(data)); // expected time drops with the loop while currentState updates approx <=5 times per song
            currentState = Math.floor(parseInt(data));
          }
        });
      }
      songExpectedTime = songExpectedTime - 1.050;
      resyncAudio();
      mainLoop();

    }, 1050)
  }

  mainLoop();

  $(window).on("blur focus", function (e) {
    var prevType = $(this).data("prevType");
    if (prevType != e.type) { //  reduce double fire issues
      switch (e.type) {
        case "blur":
          blured = true;
          if (!isFirefox) {
            $(":root").css({
              "--quick": "none",
              "--med": "all 150ms cubic-bezier(.52,.1,.51,.9)",
              "--slow": "all 600ms cubic-bezier(.52,.1,.51,.9)",
            });
          }
          blurInterval = setInterval(function () {
            blurTimer++;
            if (!navigator.onLine) {
              networkCheck = navigator.onLine;
            }
          }, 1000);
          break;
        case "focus":
          clearInterval(blurInterval);
          if (((blurTimer > currentState / 2 && currentState / 2 > 30) || blurTimer > 60) && !playing && blured) {
            //location.reload();
          }
          if (blured) {
            if (networkCheck === false && navigator.onLine) {
              location.reload();
            }
            else if (networkCheck === false && !navigator.onLine) {
              connFail += 3;
              connWarn += 3;
              if (connFail > 2) {
                $("#connWarn").css({
                  "pointer-events": "auto",
                  "opacity": "1"
                });
                $("#connWarnText").html("Make sure you're connected");
                resetWarm();
              }
            }
          }
          blurTimer = 0;
          $.ajax({
            url: "https://ampupradio.com/state",
            dataType: "text",
            success: function (data) {
              songExpectedTime = data;
              currentState = data;
            }
          });
          if (!correctMetaOnFocusRunning) {
            correctMetaOnFocus(5);
          }
          if (!isFirefox) {
            $(":root").css({
              "--quick": "all 100ms cubic-bezier(.52,.1,.51,.9)",
              "--med": "all 300ms cubic-bezier(.52,.1,.51,.9)",
              "--slow": "all 600ms cubic-bezier(.52,.1,.51,.9)",
            });
          }
          blured = false;
          break;
      }
    }

    $(this).data("prevType", e.type);
  });

});

function correctMetaOnFocus(tries) {
  correctMetaOnFocusRunning = true;
  if (tries > 0) {
    if (!songChanging && blured && !correctedMeta) {
      $.ajax({
        url: "https://ampupradio.com/history.json",
        dataType: "json",
        success: function (data) {
          try {
            if (data.song[5].artist != $("#currentArtist").text()) {
              forceMetadata();
              metaChanged = true;
              console.log("META WRONG", data.song[5].artist, $("#currentArtist").text());
              metaNoChange = 0;
              songChanged = 0;
              correctedMeta = true;
              setTimeout(function () {
                correctedMeta = false;
              }, 2000);
            }
          }
          catch (e) {
            console.log(e);
          }
        }
      });
    }
    setTimeout(() => correctMetaOnFocus(tries - 1), 1000);
    return;
  }
  else {
    console.log("whoa");
    correctMetaOnFocusRunning = false;
    return;
  }
}


function preloadImg(data) {
  if (preloadLimit == 0) {
    var imgArr = ["https://ampupradio.com/assets/img/artists/" +
      data.song[0].artist.split(' ').join('_') + ".png",
    "https://ampupradio.com/assets/img/artists/" +
    data.song[1].artist.split(' ').join('_') + ".png",
    "https://ampupradio.com/assets/img/artists/" +
    data.song[2].artist.split(' ').join('_') + ".png",
    "https://ampupradio.com/assets/img/artists/" +
    data.song[3].artist.split(' ').join('_') + ".png",
    "https://ampupradio.com/assets/img/artists/" +
    data.song[4].artist.split(' ').join('_') + ".png"];
    preloadImages(imgArr, true);
    preloadLimit = 4;
  }
  preloadLimit--;
}

function setMetadata(offset, histData, tries, startDelay) {
  if(!songChanging){ //if setMetadata is running dont run again
    songChanging = true;
    setTimeout(() => { //compensate for server delay
      $.ajax({
        url: "https://ampupradio.com/history.json",
        dataType: "json",
        success: function (data) {
          if (!histData) { //if historized meta (copy of metadata before change) is present 
            setTimeout(function () {
              console.log(data, histData, false);
              Hcheck = data.song.slice(); //legacy code will be removed
              metaAnimate(data); // function to animate the diferent elements with metadata
              setTimeout(function () {
                songChanging = false;
              }, 3000);
            }, ((offset) * 1000) - 5000); // compensate for a bit of padding to error and duplicate check
            preloadImg(data); //preload first 5 items of metadata (faster image loading)
            return;
          }
          if (JSON.stringify(data) == JSON.stringify(histData) && tries > 0) { //if the next song is the same as current song aka duplicate metadata
            console.log("meta was duplicated");
            console.log(data.song[5].artist, histData.song[5].artist);
            setTimeout(function () {
              setMetadata(offset - 100, histData, tries - 1); // retry after a 500ms delay
            }, 500);
            return;
          }
          else if (JSON.stringify(data) == JSON.stringify(histData) && tries <= 0) { // if number of tries exceeded and meta still wrong
            songChanging = false;
            forceMetadata(); // function to go look for metadata with no animations (redundant)
            preloadLimit--;  // lower preload counter so that more images can be preloaded
            return;
          }
          else { //if metadata function is running for the first time (no historized data present) aka first load sequence
            setTimeout(function () {
              console.log(data, histData, true);
              Hcheck = data.song.slice();
              metaAnimate(data);
              setTimeout(function () {
                songChanging = false;
              }, 3000);
            }, ((offset) * 1000) - 5000);
            preloadImg(data);
            return;
          }
        }
      });
    },startDelay);
  }
}

function getImage(artist, id) {
  artist = artist + ".png";
  artist = artist.split(' ').join('_');
  var altArtist = artist.split("_").join(" ");
  altArtist = altArtist
    .split("-")[0].split("&")[0].trim().split(",")[0].trim().split("ft.")[0].trim().split("vs")[0].trim().split("Ft.")[0].trim().split("feat.")[0].trim().split("Feat.")[0].trim().split(' ').join('-');
  try {
    var img = $(document).find(id);
    img.attr("src", "");
    img.attr('src', "https://ampupradio.com/assets/img/artists/" + artist);
    img.on("load", function () {
      connFail = 0;
      connWarn = 0;

      if ($(this).get(0).naturalWidth != $(this).get(0).naturalHeight) {
        getImgBgColor("#" + $(this).attr("id"));
      }
      else {
        $(this).css("background", "none");
      }
    });
    img.on("error", function () {
      getImage("AmpUpRadio", id);
      connFail++;
      connWarn++;
    });
  }
  catch (e) {
    scrapeimg(altArtist, [id]);
  }
}


function getDesc(artist, id) {
  artist = artist + ".txt";
  artist = artist.split(' ').join('_');
  $.ajax({
    url: "https://ampupradio.com/assets/text/desc/" + artist,
    type: 'get',
    dataType: 'text',
    async: true,
    crossDomain: 'true',
    success: function (data, status) {
      var desc = $(document).find(id);
      var i = data.lastIndexOf("</p>");
      if (i != -1) {

        data = data.substring(0, i).trim();
        var j = data.lastIndexOf(".");
        if (j != -1) {
          data = data.substring(0, j).trim() + "... </p>";
        }
        else {
          j = data.lastIndexOf(",");
          if (j != -1) {
            data = data.substring(0, j).trim() + "... </p>";
          }
          else {
            data = data.substring(0, i).trim() + "... </p>";
          }
        }
      }
      else {
        data = data.trim().replace("...", "") + "...";
      }

      desc.html(data);
      connFail = 0;
      connWarn = 0;
    },
    error: function (xhr, statusText) {
      if (connFail > 2) {
        $("#connWarn").css({
          "pointer-events": "auto",
          "opacity": "1"
        });
        $("#connWarnText").html("Make sure you're connected");
        resetWarm();
      }
      connFail++;
    }
  });
}
var dataArr = [];
function getLinks(artist) {
  artist = artist + ".txt";
  artist = artist.split(' ').join('_');
  $.ajax({
    url: "https://ampupradio.com/assets/text/links/" + artist,
    type: 'get',
    dataType: 'text',
    async: true,
    crossDomain: 'true',
    success: function (data, status) {
      data = data.split(",");
      //console.log(data);
      dataArr = data;
      connFail = 0;
      connWarn = 0;
      // var links = $(document).find(id);
      //apply logic to change links 
    },
    error: function (xhr, statusText) {
      if (connFail > 2) {
        $("#connWarn").css({
          "pointer-events": "auto",
          "opacity": "1"
        });
        $("#connWarnText").html("Make sure you're connected");
        resetWarm();
      }
      connFail++;
    }
  });
}



function addAudio() {
  $("#audioCont").html('&nbsp; &nbsp; <audio id="audio" style="position: absolute;display: none;" preload="none"></audio>');
  audio = document.getElementById("audio");
  //audio= $('#audio')[0];
  audio.crossOrigin = "anonymous";
  audio.src = StrmURL;
  audio.load();
  audio.volume = 0;
}

function deUmlaut(value) {
  value = value.toLowerCase();
  value = value.replace(/ä/g, 'a');
  value = value.replace(/ö/g, 'o');
  value = value.replace(/ü/g, 'u');
  value = value.replace(/ß/g, 's');
  value = value.replace(/ /g, '-');
  value = value.replace(/\./g, '');
  value = value.replace(/,/g, '');
  value = value.replace(/\(/g, '');
  value = value.replace(/\)/g, '');
  return value;
}



function fadeOut(element, direction, delay, callback) {
  var elem = $(document).find(element);
  setTimeout(function () {
    if (direction == "up") {
      $(elem).css({
        "transform": "translateY(100px)",
        "opacity": "0"
      });
    }
    else if (direction == "down") {
      $(elem).css({
        "transform": "translateY(-100px)",
        "opacity": "0"
      });
    }
    else if (direction == "left") {
      $(elem).css({
        "transform": "translateX(-100px)",
        "opacity": "0"
      });
    }
    else if (direction == "right") {
      $(elem).css({
        "transform": "translateX(100px)",
        "opacity": "0"
      });
    }
    else if (direction == "none") {
      $(elem).css({
        "transform": "translate(0px,0px)",
        "opacity": "0"
      });
    }
    setTimeout(function () {
      try {
        callback();
      }
      catch (e) { }
    }, delay + 500);
  }, delay);
}

function fadeIn(element, delay) {
  var elem = $(document).find(element);
  setTimeout(function () {
    if ($(elem).is("img")) {

      $(elem).on('load', function () {
        $(elem).css({
          "transform": "translate(0px,0px)",
          "opacity": "1"
        });
        if ($(elem).attr("id") == "scrapedpic") {
          $("#currentImgCont").css({
            "transform": "translate(0px,0px)",
            "opacity": "1"
          });
          $("#likeCont").css({
            "opacity": "1"
          });
        }
      }).each(function () {
        if ($(this).complete || $(this).completedPercentage > 80) {
          $(elem).css({
            "transform": "translate(0px,0px)",
            "opacity": "1"
          });
          if ($(elem).attr("id") == "scrapedpic") {
            $("#currentImgCont").css({
              "transform": "translate(0px,0px)",
              "opacity": "1"
            });
            $("#likeCont").css({
              "opacity": "1"
            });
          }
          fadeIn(element, delay);
        }
      });
    }
    else {
      $(elem).css({
        "transform": "translate(0px,0px)",
        "opacity": "1"
      });
    }
    setTimeout(function () {
      $(elem).css({
        "transform": "translate(0px,0px)",
        "opacity": "1"
      });
      if ($(elem).attr("id") == "scrapedpic") {
        $("#currentImgCont").css({
          "transform": "translate(0px,0px)",
          "opacity": "1"
        });
        $("#likeCont").css({
          "opacity": "1"
        });
      }
    }, 2000);
  }, delay);
}




function metaAnimate(data) {

  globalData = data.song.slice();
  aurLess = data.song.slice();
  var f;
  var found = aurLess
    .some(function (item, index) {
      f = index;
      return item.artist.includes("AmpUpRadio");
    });
  if (found) {
    aurLess.splice(f, 1);
  }
  if (firstSetup != 0) {
    //main song
    setSessionMeta(data);

    $("#likeCont").css({
      "opacity": "0"
    });

    fadeOut("#currentImgCont", "left", 100, function () {
      getImage(data.song[5].artist, "#scrapedpic");
      fadeIn("#scrapedpic", 1500);
    });

    //fadeOut("#scrapedpic","left",0,function(){
    //});

    fadeOut("#currentArtist", "left", 150, function () {
      $("#currentArtist").html(data.song[5].artist);
      fadeIn("#currentArtist", 1550);
    });

    fadeOut("#currentTitle", "left", 200, function () {
      $("#currentTitle").html(data.song[5].title);
      fadeIn("#currentTitle", 1600);
    });
    getRatingColor("#scrapedpic", "#likeCont");
    getDesc(data.song[5].artist, "#artistInfo");
    getLinks(data.song[5].artist);


    if (!data.song[5].artist.includes("AmpUpRadio")) {
      //recent 1
      fadeOut("#Himg1", "up", 1000, function () {
        getImage(aurLess[6].artist, "#Himg1");
        fadeIn("#Himg1", 1500);
      });

      fadeOut("#recentArtist1", "up", 1000, function () {
        $("#recentArtist1").html(aurLess[6].artist);
        fadeIn("#recentArtist1", 1500);
      });

      fadeOut("#recentTitle1", "up", 1000, function () {
        $("#recentTitle1").html(aurLess[6].title);
        fadeIn("#recentTitle1", 1500);
      });

      //recent 2
      fadeOut("#Himg2", "up", 1050, function () {
        getImage(aurLess[7].artist, "#Himg2");
        fadeIn("#Himg2", 1550);
      });

      fadeOut("#recentArtist2", "up", 1050, function () {
        $("#recentArtist2").html(aurLess[7].artist);
        fadeIn("#recentArtist2", 1550);
      });

      fadeOut("#recentTitle2", "up", 1050, function () {
        $("#recentTitle2").html(aurLess[7].title);
        fadeIn("#recentTitle2", 1550);
      });


      //recent 3 
      fadeOut("#Himg3", "up", 1100, function () {
        getImage(aurLess[8].artist, "#Himg3");
        fadeIn("#Himg3", 1600);
      });

      fadeOut("#recentArtist3", "up", 1100, function () {
        $("#recentArtist3").html(aurLess[8].artist);
        fadeIn("#recentArtist3", 1600);
      });

      fadeOut("#recentTitle3", "up", 1100, function () {
        $("#recentTitle3").html(aurLess[8].title);
        fadeIn("#recentTitle3", 1600);
      });
    }

  }
  else {
    setSessionMeta(data);

    $("#likeCont").css({
      "opacity": "0"
    });

    fadeOut("#currentImgCont", "left", 100, function () {
    });

    fadeOut("#scrapedpic", "left", 0, function () {
      setTimeout(function () {
        getImage(data.song[5].artist, "#scrapedpic");
      }, 1000);
      fadeIn("#scrapedpic", 1000);
    });


    fadeOut("#currentArtist", "left", 100, function () {
      $("#currentArtist").html(data.song[5].artist);
      fadeIn("#currentArtist", 1000);
    });

    fadeOut("#currentTitle", "left", 100, function () {
      $("#currentTitle").html(data.song[5].title);
      fadeIn("#currentTitle", 1000);
    });


    getDesc(aurLess[5].artist, "#artistInfo");
    getLinks(aurLess[5].artist);
    getRatingColor("#scrapedpic", "#likeCont");


    fadeOut("#Himg1", "up", 100, function () {
      getImage(aurLess[6].artist, "#Himg1");
      fadeIn("#Himg1", 1000);
    });

    fadeOut("#recentArtist1", "up", 100, function () {
      $("#recentArtist1").html(aurLess[6].artist);
      fadeIn("#recentArtist1", 1000);
    });

    fadeOut("#recentTitle1", "up", 100, function () {
      $("#recentTitle1").html(aurLess[6].title);
      fadeIn("#recentTitle1", 1000);
    });


    fadeOut("#Himg2", "up", 100, function () {
      getImage(aurLess[7].artist, "#Himg2");
      fadeIn("#Himg2", 1050);
    });

    fadeOut("#recentArtist2", "up", 100, function () {
      $("#recentArtist2").html(aurLess[7].artist);
      fadeIn("#recentArtist2", 1050);
    });

    fadeOut("#recentTitle2", "up", 100, function () {
      $("#recentTitle2").html(aurLess[7].title);
      fadeIn("#recentTitle2", 1050);
    });



    fadeOut("#Himg3", "up", 100, function () {
      getImage(aurLess[8].artist, "#Himg3");
      fadeIn("#Himg3", 1100);
    });

    fadeOut("#recentArtist3", "up", 100, function () {
      $("#recentArtist3").html(aurLess[8].artist);
      fadeIn("#recentArtist3", 1100);
    });

    fadeOut("#recentTitle3", "up", 100, function () {
      $("#recentTitle3").html(aurLess[8].title);
      fadeIn("#recentTitle3", 1100);
    });
  }

}

function forceMetadata() {
  if (correctLimit == 0) {
    $.ajax({
      url: "https://ampupradio.com/history.json",
      dataType: "json",
      success: function (data) {
        var currentArtist = data.song[5].artist;
        setTimeout(function () {
          if ($("#currentArtist").text().trim() != currentArtist.trim() && songChanged > 1) {
            forceMetadata();
            return false;
          }
        }, 2000);
        console.log(data.song);
        setTimeout(function () {
          forceMetaLoad(data);
        }, 500);
      }
    });
    correctLimit = 1;
  }
  setTimeout(function () {
    correctLimit = 0;
  }, 2000);
}

function forceMetaLoad(data, aurLess) {
  aurLess = data.song.slice();
  var f;
  var found = aurLess
    .some(function (item, index) {
      f = index;
      return item.artist.includes("AmpUpRadio");
    });
  if (found) {
    aurLess.splice(f, 1);
  }

  setSessionMeta(data);

  getImage(data.song[5].artist, "#scrapedpic");
  $("#currentArtist").html(aurLess[5].artist);
  $("#currentTitle").html(aurLess[5].title);
  getDesc(data.song[5].artist, "#artistInfo");
  getLinks(data.song[5].artist);
  getRatingColor("#scrapedpic", "#likeCont");

  getImage(aurLess[6].artist, "#Himg1");
  $("#recentArtist1").html(aurLess[6].artist);
  $("#recentTitle1").html(aurLess[6].title);

  getImage(aurLess[7].artist, "#Himg2");
  $("#recentArtist2").html(aurLess[7].artist);
  $("#recentTitle2").html(aurLess[7].title);

  getImage(aurLess[8].artist, "#Himg3");
  $("#recentArtist3").html(aurLess[8].artist);
  $("#recentTitle3").html(aurLess[8].title);
}

function isFocused() {
  return document.hasFocus() || document.getElementById('iframe').contentWindow.document.hasFocus();
}

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour: " : " hours: ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute: " : " minutes: ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
}
function setSessionMeta(data) {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: data.song[5].title,
      artist: data.song[5].artist,
      artwork: [{
        src: "https://ampupradio.com/assets/img/artists/"
          + data.song[5].artist.split(' ').join('_') + ".png", type: "image/png"
      }]
    });
  }
}


function getRatingColor(img, cont) {
  var fac = new FastAverageColor(),
    container = $(document).find(cont),
    img = $(document).find(img);
  var color;
  $(img).on("load", function () {
    color = fac.getColor(img[0]);
    container.css("background", color.rgb);
    if (color.isDark) {
      $("#likeDislike").css("filter", "invert(1)");
    }
    else {
      $("#likeDislike").css("filter", "invert(0)");
    }
  });
}

function getImgBgColor(img) {
  var fac = new FastAverageColor();
  img = $(document).find(img);
  img.css("background", "var(--grd)");
  var color;
  color = fac.getColor(img[0]);
  console.log(color.rgb);
  img.css("background", color.rgb);

}
