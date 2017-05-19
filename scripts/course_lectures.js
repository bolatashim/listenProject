

$( document ).ready(function() {



	var config = {
    apiKey: "AIzaSyBnGKjR_JCCB_5xi_W3FE-EP1S_2KxdDnQ",
    authDomain: "hci-mypart.firebaseapp.com",
    databaseURL: "https://hci-mypart.firebaseio.com",
    projectId: "hci-mypart",
    storageBucket: "hci-mypart.appspot.com",
    messagingSenderId: "840120058870"
  };

  firebase.initializeApp(config);
  var database = firebase.database();

	var coursesRef = database.ref("courses");
	var lecturesRef = database.ref("lectures");
	function addCourses() {



		$.when(coursesRef.push(
		{
			code: "CS101", title: "Introduction to Computer Science", lectures: lecturesRef
		}
		)).done(		$.when(coursesRef.push(
		{
			course: "CS374", title: "Introduction to Human-Compuer Interaction"
		}
		)).done(		$.when(coursesRef.push(
		{
			course: "CS204", title: "Discrete Mathematics"
		}
		)).done(		$.when(coursesRef.push(
		{
			course: "CS206", title: "Data Structures"
		}
		)).done(function() {
			//lecturesRef.push({lecture: "lecture"});
			another();
		}))));






	}

	function another() {
		coursesRef.once("value", function(data) {
			data.forEach(function(course){
				if(course.val().code == "CS101"){
					course.lectures.push({lecture:"hello"});
					console.log("found do nothing");
				}
			});
		});
	}

	addCourses();

	for (var i = 0; i < 20; i++) {

	}


});