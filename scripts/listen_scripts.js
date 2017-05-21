
$( document ).ready(function() {

  var config = {
    apiKey: "AIzaSyCxnL1UyMBU51tJU5MAKmCxHPAaMpb2veY",
    authDomain: "listen-f5fcf.firebaseapp.com",
    databaseURL: "https://listen-f5fcf.firebaseio.com",
    projectId: "listen-f5fcf",
    storageBucket: "listen-f5fcf.appspot.com",
    messagingSenderId: "913421957842"
  };
  
  firebase.initializeApp(config);

  var database = firebase.database();


  var activelectureRef = database.ref("activeLecture");

  var profsRef = database.ref("professors");
  var coursesRef = database.ref("professors/" );
  var lecturesRef = database.ref("professors/courses/lectures");
  var tagsRef = database.ref("professors/courses/lectures/tags");









  //Toggle active & inactive states
  $("#cs101tab").click(function () {
    if (!$(this).hasClass("listen-active-tab")) {
      $("#cs101tab").toggleClass("listen-active-tab listen-inactive-tab");
      $("#cs101content").toggleClass("listen-active-content listen-inactive-content");
      $("#cs374tab").toggleClass("listen-inactive-tab listen-active-tab");
      $("#cs374content").toggleClass("listen-inactive-content listen-active-content"); 
    }
  });

  $("#cs374tab").click(function () {
    if(!$(this).hasClass("listen-active-tab")) {
      $("#cs374tab").toggleClass("listen-active-tab listen-inactive-tab");
      $("#cs374content").toggleClass("listen-active-content listen-inactive-content");
      $("#cs101tab").toggleClass("listen-inactive-tab listen-active-tab");
      $("#cs101content").toggleClass("listen-inactive-content listen-active-content");
    }
  });


$("#cs101course").click(function(){
  window.location.href = "./lectures_list_page.html";
});



	$("#help_add_lecture_page").click(function (){
		if(!$("#breadcrumb").data("status")){
			$("#breadcrumb").append("<li id='explanation'>You can plan your lecture in this page.</li>");
			$("#breadcrumb").data("status", true);
		}
		else{
			$("#explanation").remove();
			$("#breadcrumb").data("status", false);
		}
	});

  $("#help_home").click(function (){
    if(!$("#breadcrumb").data("status")){
      $("#breadcrumb").append("<li id='explanation'>You can manage your courses in this page.</li>");
      $("#breadcrumb").data("status", true);
    }
    else{
      $("#explanation").remove();
      $("#breadcrumb").data("status", false);
    }
  });

  $("#help_review_lecture_page").click(function (){
    if(!$("#breadcrumb").data("status")){
      $("#breadcrumb").append("<li id='explanation'>You can review specific data on class.</li>");
      $("#breadcrumb").data("status", true);
    }
    else{
      $("#explanation").remove();
      $("#breadcrumb").data("status", false);
    }
  });
});


