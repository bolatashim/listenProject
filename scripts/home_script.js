
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

  var courseKey = "none";
  var lectureKey = "none";



  var database = firebase.database();
  var activelectureRef = database.ref("activeLecture")
  var courseRef = database.ref("courses/" + courseKey);
  var lectureRef = database.ref("courses/" + courseKey + "/lectures" + lectureKey);



  function addLecture(number, title) {
    lectureKey = "lecture " + number;
    lectureRef.set({title: title});
    
  }




});


