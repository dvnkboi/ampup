
//client side scraping to get info (kinda heavy)

//scraping artist image and setting player gradient
function scrapeimg(name,element){
    var globalurl;
    var scraperes = [];
    element.forEach(function(img){
        scraperes.push($(document).find(img));
    });
    var search=name.split("-")[0].split("&")[0].trim().split(",")[0].trim().split("ft.")[0].trim().split("vs")[0].trim().split("Ft.")[0].trim().split("feat.")[0].trim().split("Feat.")[0].trim().split(' ').join('-');
    search = deUmlaut(search);
    var url = encodeURIComponent('https://genius.com/artists/' + search);
    ////console.log(search);
    ////console.log(url);
    ////////console.log(name);
    ////////console.log(search);
    ////////console.log(url);
    fetch(`https://api.allorigins.win/get?url=${url}`)
    .then(response => {
    if (response.ok) return response.json()
    throw new Error('Network response was not ok.')
    })
    .then(function(data){
        //var res = data.find();
        var base64;
        var quick = data.contents;
        ////////console.log(quick);
        var index = quick.search("user_avatar");
        var quick = quick.substring(index,quick.lenght);
        index = quick.search("url\\('");
        quick = quick.substring(index+5,quick.lenght);
        var imgurl = quick.split("'")[0];
        //imgurl='https://api.allorigins.win/get?url=${url' + imgurl + '}';
        ////////console.log(imgurl);
        globalurl = imgurl;
        /*
        try{
            toDataURL(
              imgurl,
              function(dataUrl) {
                  base64 = dataUrl;
                  scraperes.forEach(image => {
                      if(dataUrl){
                          image.attr("src",dataUrl);
                          //console.log("base64");
                      }
                      else{
                          image.attr("src",imgurl);
                          //console.log("img source");
                      }

                  }); 
            });
        }
        catch(e){
            //console.log("getting dominant color failed");
        }
        */
        scraperes.forEach( image => image.attr("src",imgurl) ); 
        //////console.log(scraperes);

        ////console.log(imgurl);
        //scraperes.each(function() {
        //    $(this).prop("src",imgurl))
        //    $(this).children('.time').after($('.inner'));
        //});
        //$(scraperes).prop("src",imgurl);
    });
    $(element[0])
    .on('load', function() { 

    })
    .on('error', function(){
    setTimeout(function(){
        $(this).prop("src","https://cdn.discordapp.com/attachments/331151226756530176/725817255484719124/AURFavicon.webp");
    },5000);
    });
}

//scraping artist info and links 
function scrapeinfo(name){
    var spotify;
    var soundcloud;
    var twitter;
    var other;
    var wikipedia;
    var youtube;
    var instagram;
    var facebook;
    var info = [];
    var search=name.split("-")[0].split("&")[0].trim().split(",")[0].trim().split("ft.")[0].trim().split("vs")[0].trim().split("Ft.")[0].trim().split("feat.")[0].trim().split("Feat.")[0].trim().split(' ').join('-');
    search = deUmlaut(search);
    info.push(search);
    var callbackinfo = [search,,];
    var linksearch = name.split("-")[0].split("&")[0].split(' ').join('+');
    linksearch = linksearch.slice(0, -1);
    var url = encodeURIComponent('https://genius.com/artists/' + search);
    var geniusurl = 'https://genius.com/artists/' + search;
    //////console.log('https://google.com/search?q='+linksearch);
    var linkurl = encodeURIComponent('https://google.com/search?q='+linksearch+"+website");
    //////console.log(linkurl);
        
    fetch(`https://api.allorigins.win/get?url=${url}`)
    .then(response => {
	if (response.ok) return response.json()
	throw new Error('Network response was not ok.')
    })
    .then(function(data){
        //var res = data.find();
        var quick = data.contents;
        //////console.log(quick);
        var index = quick.search("rich_text_formatting");
        var quick = quick.substring(index,quick.lenght);
        index = quick.search("<p>");
        quick = quick.substring(index,quick.lenght);
        var desc;  
        try{
            desc = quick.split("</p>")[0];
            desc += quick.split("</p>")[1].split("</p>")[0];
        }
        catch(e){}
        if(desc.includes('img')){
            try{
                desc = quick.split("</p>")[1].split("</p>")[0];
                desc+= quick.split("</p>")[1].split("</p>")[1].split("</p>")[0];
            }
            catch(e){}
        }
        if(desc.includes('img')){
            try{
                desc = quick.split("</p>")[0];
                desc += quick.split("</p>")[1].split("</p>")[0];
            }
            catch(e){}
        }
        desc = desc.split(" ",60).join(" ") + "..." +"</p>";
        if(desc == "..." +"</p>"){
            desc = "this artist doesn't currently have a description.";
        }
        desc.replace("....","...");
        //console.log("description:" + desc);
        info[1]=desc;
        var lenghtLim = info[1].split(" ",60) + "";
        
        $("#artistInfo").html(info[1].trim());
        if($("#artistInfo").html().includes("</div>") || $("#artistInfo").html().includes("html") || $("#artistInfo").html().includes("You can search Genius by using the search bar above, or")){
            $("#artistInfo").html("this artist doesn't currently have a description.");
        }
        
        ////console.log(info);
    });
    
    fetch(`https://api.allorigins.win/get?url=${linkurl}`)
    .then(response => {	if (response.ok) return response.json()
	throw new Error('Network response was not ok.')
    })
    .then(function(data){
        //var res = data.find();
        var quick = data.contents;
        ////////console.log(quick);
        var index = quick.search("kCrYT");
        quick = quick.substring(index,quick.lenght);
        var n=20;var i=0;
        for(i=2;i<n+2;i++){
            var index = quick.search("kCrYT");
            quick = quick.substring(index,quick.lenght);
            index = quick.search("<a href=");
            if((quick.substring(index,index+20).includes("/search?q="))){
                continue;
                }
            //////console.log(quick);
            quick = quick.substring(index+16,quick.lenght);
            var link = quick.split('"')[0];
            //////console.log(link);
            link = link.split("&amp")[0];
            //////console.log("link:" + link);
            info[i] = decodeURIComponent(link);
            //////console.log(link);
            try{
              var domain = info[i].split("//")[1].split(".com")[0].split(".org")[0];
              if(domain.includes(".")){
                domain=domain.split(".")[1];
              }
            }
            catch(e){
              
            }
            ////console.log(domain);
            if(typeof domain !== 'undefined'){
                if(domain === "spotify" && typeof spotify === 'undefined'){
                    ////////console.error("spotify be like whoa");
                    spotify = info[i];
                    //////console.log("spotify :" + spotify);
                    if(info[2]!="ick="){
                        $("#artistlink2")
                        .prop("href",spotify)
                        .html("Spotify");
                    }
                }
                else if(domain === "soundcloud" && typeof soundcloud === 'undefined'){
                    ////////console.error("soundcloud be like whoa");
                    soundcloud = info[i];
                    //////console.log("soundcloud :" + soundcloud);
                    if(info[2]!="ick="){
                        $("#artistlink3")
                        .prop("href",soundcloud)
                        .html("SoundCloud");
                    }
                }
                else if(domain === "twitter" && typeof twitter === 'undefined'){
                    ////////console.error("twitter be like whoa");
                    twitter = info[i];
                    //////console.log("twitter :" + twitter);
                    if(info[2]!="ick="){
                        $("#artistlink4")
                        .prop("href",twitter)
                        .html("Twitter");
                    }
                }
                else if(domain === "wikipedia" && typeof wikipedia === 'undefined'){
                    ////////console.error("wiki be like whoa");
                    wikipedia = info[i];
                    //////console.log("wiki :" + wikipedia);
                    if(info[2]!="ick="){
                        $("#artistlink5")
                        .prop("href",wikipedia)
                        .html("Wikipedia");
                    }
                }
                else if(domain.includes(info[0].split("-")[0]) && typeof other === 'undefined'){
                    ////////console.error("artist be like whoa");
                    other = info[i];
                    //////console.log("artist website:" + other);
                    if(info[2]!="ick="){
                        $("#artistlink1")
                        .prop("href",other)
                        .html("Official Website");
                    }
                }
                else if(domain === "youtube" && typeof youtube === 'undefined'){
                    ////////console.error("artist be like whoa");
                    youtube = info[i];
                    ////////console.log("youtube:" + youtube);
                    if(info[2]!="ick="){
                        $("#artistlink6")
                        .prop("href",youtube)
                        .html("Youtube");
                    }
                }
                else if(domain === "instagram" && typeof instagram === 'undefined'){
                    ////////console.error("artist be like whoa");
                    instagram = info[i];
                    ////////console.log("instagram:" + instagram);
                    if(info[2]!="ick="){
                        $("#artistlink7")
                        .prop("href",instagram)
                        .html("Instagram");
                    }
                }
                else if(domain === "facebook" && typeof facebook === 'undefined'){
                    ////////console.error("artist be like whoa");
                    facebook = info[i];
                    ////////console.log("facebook:" + facebook);
                    if(info[2]!="ick="){
                        $("#artistlink8")
                        .prop("href",facebook)
                        .html("Facebook");
                    }
                }
            }
            else{
                $("#artistlink8")
                .html("We're sorry!We failed to load links...");
                ////console.log("failed to load links...");
            }
            

        }
        $("#about").html("About " + titleCase(info[0].replace("-"," ")) + "");
        $("#geniuslink").prop("href",geniusurl);    
        if(info[2]!="ick="){
            $(".artistlinks").css("pointer-events","auto");
        }
        else{
            $(".artistlinks")
            .css("pointer-events","none")
            .css("cursor","not-allowed");
        }
    });

}

//scraping news
function scrapenews(s){
    var news=[];
    var head;
    var url = encodeURIComponent('https://news.google.com/rss/search?q=' + s + '&hl=en-US&gl=US&ceid=US:en'); //set url to insider term search
    
    fetch(`https://api.allorigins.win/get?url=${url}`)
    .then(response => {
	if (response.ok) return response.json()
	throw new Error('Network response was not ok.')
    })
    .then(function(data){
        var parser = new DOMParser();
        var xml = parser.parseFromString(data.contents,"text/xml");
        var temp;
        for(var i=0;i<15;i++){
          temp = xml.getElementsByTagName("item")[i];
          news[i]={
            "title" : temp.getElementsByTagName("title")[0].innerHTML,
            "link" : temp.getElementsByTagName("link")[0].innerHTML,
            "pubDate" : temp.getElementsByTagName("pubDate")[0].innerHTML,
            "source" : temp.getElementsByTagName("source")[0].innerHTML
          }
        }
        //////console.log(news);
      
    if (news.length == 0){
        ////////console.log("couldnt load :(");
        $("#newsSection").append("could not load news :(");
    }
      
    else{
        console.log(news);
        
    }
    });
}



function titleCase(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       // You do not need to check if i is larger than splitStr length, as your for does that for you
       // Assign it back to the array
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
   // Directly return the joined string
   return splitStr.join(' '); 
}