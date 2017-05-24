var config={
	apiKey: "AIzaSyCxnL1UyMBU51tJU5MAKmCxHPAaMpb2veY",
	databaseURL: "https://listen-f5fcf.firebaseio.com/",
}
firebase.initializeApp(config);
var database = firebase.database();
var student_id = localStorage.id;
var student_email = localStorage.email;
var student_course = localStorage.course;
var student_lecture = localStorage.lecture;

var quizRef = database.ref("courses/" + student_course.split(" ")[0] + "/quizzes");
var active_quiz_index = -1;

var answer = [];

$( document ).ready(function(){
	if(student_id === undefined || student_email === undefined || student_lecture === undefined || student_course === undefined){
		alert("Please login first.");
		document.location.href = 'file:student_login.html';
	}

	$("#student_profile").text("ID: "+student_id);
	$("#student_course").text("Course: "+student_course.split(" ")[0]);
	
	
	for(var i = 0; i < 6; i++){
		var question = "What is recursion?";
		var op1 = "For loop";
		var op2 = "A function within a function";
		var op3 = "How do I know";
		var op4 = "I don't know";

		var element = "<div class='panel panel-default'><h3>Q"+(i+1)+" "+question+"</h3><div><ul style='list-style: none;'>"
		+"<li><button class='options btn btn-default' val='false' style='text-align: left; white-space: normal;'>A. "+op1+"</button></li>"
		+"<li><button class='options btn btn-default' val='false' style='text-align: left; white-space: normal;'>B. "+op2+"</button></li>"
		+"<li><button class='options btn btn-default' val='false' style='text-align: left; white-space: normal;'>C. "+op3+"</button></li>"
		+"<li><button class='options btn btn-default' val='false' style='text-align: left; white-space: normal;'>D. "+op4+"</button></li>"
		+"</ul></div></div>"
		$('#questions').append(element);
	}
	
	$("#questions").on('click', '.options',function(){
		if($(this).attr("val") === "false"){
			$(this).removeClass("btn-default");
			$(this).addClass("btn-success");
			$(this).attr("val", "true");
		}
		else{
			$(this).addClass("btn-default");
			$(this).removeClass("btn-success");
			$(this).attr("val", "false");
		}
	});

});

quizRef.on('child_added', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	if(key === "active quiz") active_quiz_index = value;
});

