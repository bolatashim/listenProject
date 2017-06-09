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

if(student_id === undefined || student_email === undefined || student_lecture === undefined){
	alert("Please login first.");
	document.location.href = 'file:student_login.html';
}

var activeLectureRef = database.ref("activeLecture");
var lectureRef = database.ref("courses/"+student_course.split(" ")[0]+"/lectures/"+student_lecture);
var tagRef = database.ref("courses/"+student_course.split(" ")[0]+"/lectures/"+student_lecture+"/tags");
var tags = [];

$( document ).ready(function(){
	$("#student_profile").text("ID: "+student_id);
	$("#student_course").text("Course: "+student_course.split(" ")[0]);
	$(".cur_tag").focus();

	$("#tags").on('click', '.tag',function(){
		if($(this).text()=="Create tag"){
			$("#selected_tag").html("<input class='input-sm cur_tag'></input>");
			$(".cur_tag").focus();
		}
		else{
			$("#selected_tag").html("<input class='input-sm cur_tag' value='"+$(this).text()+"'></input>");
			$("#inputarea").focus();
		}
	});

	$("#submit").click(function(){
		if($(".cur_tag").val() == ""){
			$(".cur_tag").addClass("btn-danger");
			$(".cur_tag").focus();
			setTimeout(function(){
				$(".cur_tag").removeClass("btn-danger");}, 1000);
			return;
		}
		var addtagRef = database.ref("courses/"+student_course.split(" ")[0]+"/lectures/"+student_lecture+"/tags/"+$(".cur_tag").val());
		addtagRef.push({
			answered: false,
			asker: student_id,
			email: student_email,
			text: $("#inputarea").val(),
			time: $.now(),
		})
		$("#submit").removeClass("btn-default");
		$("#submit").addClass("btn-success");
		$("#submit").text("Submitted!")
		$("#inputarea").val("");
		$("#inputarea").focus();
		setTimeout(function(){
			$("#submit").addClass("btn-default");
			$("#submit").removeClass("btn-success");
			$("#submit").text("Submit!");}, 1000);
	});
})

tagRef.on('child_added', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	$("#tags").append(" <button class='btn tag'>"+key+"</button>");
	tags.push(key);
});

activeLectureRef.on('value', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	if(value["status"].includes("quiz")){
		localStorage.setItem("quiz_index", value["status"].split(", ")[1]);
		if(localStorage[localStorage.quiz_index] != "true"){
			document.location.href = 'file:student_quiz.html';
		}
	}
});

