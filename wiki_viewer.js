
//first, we do an srsearch (1st api call) where we retrieve the titles (10 of them)
//and with which we create an obj of objects, which will hold title + info + pageid
//we perform a 2nd api call, this time to get the pageids of every title 

$(document).ready(function(){
  $('#titleText, #random, #search').fadeIn(1000);
  
  //random article
  $("#random").click(function(){
    window.open("http://en.wikipedia.org/wiki/Special:Random");
  });
  
  //search button
  $('#search').click(function(){
    $("#random, #search").slideUp(function(){
      $('#searchBox, #searchClick, #backToMain').fadeIn();
      });
  });
  
  //back button
  $('#backToMain').click(function(){
    $('#searchBox, #searchClick, #backToMain, #testHere0:visible, #testHere1:visible, #testHere2:visible, #testHere3:visible, #testHere4:visible, #testHere5:visible, #testHere6:visible, #testHere7:visible, #testHere8:visible, #testHere9:visible').slideUp(function(){
      $('#random, #search').fadeIn();
    })
  });
  
  //enter click
  $('#searchBox').keypress(function(e){
    var key = e.which;
    if(key === 13){
      $('#searchClick').click();
    }
  });
  
  //search click
  //first, do a srsearch, then use titles to get the pageids
  //https://en.wikipedia.org/w/api.php?&action=query&list=search&srsearch=donald%20trump&callback=?
  var callMe = "", titlesHere = "", titlesArr = {}, searchMe = "", sortUs = [], wordCount;
  $("#searchClick").click(function(){
    //add search terms to titles
    callMe = "https://en.wikipedia.org/w/api.php?&action=query&list=search&srsearch=";
    titlesHere = "https://en.wikipedia.org/w/api.php?&action=query&titles=";
    searchMe = document.getElementById('searchBox').value.split(' ');
    
    //add search terms to srsearch
    searchMe.forEach(function(elem){
      callMe += elem + "%20";
    });
    //remove the extra '%20'
    callMe = callMe.substring(0, callMe.length - 3);

    callMe += "&format=json&callback=?";
    
    $.getJSON(callMe, function(data){
      if(data.query.search[0] === undefined){
        $('#testHere0').html("Sorry, didn't find anything :( <br>Check your spelling, or try another search").slideDown();
        $('#testHere1:visible, #testHere2:visible, #testHere3:visible, #testHere4:visible, #testHere5:visible, #testHere6:visible, #testHere7:visible, #testHere8:visible, #testHere9:visible').slideUp();
      }
      else{
      for(var i = 0; i < 10; i++){
        titlesArr[i] = {};
        titlesArr[i].title = data.query.search[i].title;
        titlesArr[i].snippet = data.query.search[i].snippet + "...";
        titlesArr[i].words = data.query.search[i].wordcount;
        titlesHere += data.query.search[i].title + "|";
      }
      
     //remove the extra |
    titlesHere = titlesHere.substring(0, titlesHere.length - 1);
    titlesHere += "&indexpageids=&format=json&callback=?"; 
        
    //pageids stuff
    $.getJSON(titlesHere, function(data2){
      sortUs = data2.query.pageids;
      for(var j = 0; j < 10; j++){
        for(var x = 0; x < 10; x++){
          var sortMe = sortUs[x];
          if(data2.query.pages[sortMe].title === titlesArr[j].title){
        titlesArr[j].pageid = "http://en.wikipedia.org/?curid=" + data2.query.pages[sortMe].pageid;
        var $showInfo = '#testHere' + j;
        $($showInfo).html("<strong>> " + titlesArr[j].title + "</strong><br><strong>></strong> word count - " + titlesArr[j].words + "<br><strong>></strong> '..." + titlesArr[j].snippet + "'").wrapInner("<a href='" + titlesArr[j].pageid + "' target='_blank'></a>").slideDown();
          }
        }
      }
    });//getJSON pageids
    }//else
      
    });//getJSON titles
    
  });//searchclick
  
});