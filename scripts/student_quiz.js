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
var quiz_num = localStorage.quiz_index;

var activeLectureRef = database.ref("activeLecture");
var questionRef = database.ref("tsQuiz/" + quiz_num + "/questions");
var quizRef = database.ref("tsQuiz/" + quiz_num);
var answersRef = database.ref("tsQuiz/" + quiz_num + "/answers")

var answer = [];
var user_answer = [];
var question_num = 1;
var score = 0;
var totalStudent;

if(student_id === undefined || student_email === undefined || student_lecture === undefined || student_course === undefined){
	alert("Please login first.");
	document.location.href = 'file:student_login.html';
}

if(localStorage[localStorage.quiz_index] == "true"){
	alert("You already submitted your answer.");
	document.location.href = 'file:student_index.html';
}

$( document ).ready(function(){

	$("#student_profile").text("ID: "+student_id);
	$("#student_course").text("Course: "+student_course.split(" ")[0]);
	
	$("#questions").on('click', '.options',function(){
		if($(this).attr("val") === "false"){
			$(this).removeClass("btn-default");
			$(this).addClass("btn-success");
			$(this).attr("val", "true");
			user_answer[($(this).attr("question")-1)][$(this).attr("id")] = true;
		}
		else{
			$(this).addClass("btn-default");
			$(this).removeClass("btn-success");
			$(this).attr("val", "false");
			user_answer[($(this).attr("question")-1)][$(this).attr("id")] = false;
		}
	});

	$("#submit").click(function(){
		for(var i = 0; i < user_answer.length; i ++){
			var totalScoreRef = database.ref("tsQuiz/" + quiz_num + "/questions/" + i + "/totalScore")
			var score = 0;
			user_answer[i].keys().forEach(function(key){
				if(answer[i].includes(key) && user_answer[i][key])
					score++
				if(!answer[i].includes(key) && !user_answer[i][key])
					score++
			})
			totalScoreRef.transaction(function(total){
				if(total)
					return total + score
				else
					return 0
			})
		}

		database.ref("tsQuiz/"+quiz_num+"/totalStudent").set(totalStudent+1);
		localStorage.setItem(quiz_num, true);
		document.location.href = 'file:student_index.html';
	});
});

questionRef.on('child_added', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();

	var question = value["title"];
	var op1 = value["options"]["0"]["text"];
	var op2 = value["options"]["1"]["text"];
	var op3 = value["options"]["2"]["text"];
	var op4 = value["options"]["3"]["text"];
	answer.push(value["answer"]);

	var element = "<div class='panel panel-default'><h4>Q"+question_num+" "+question+"</h4><div><ul style='list-style: none;'>"
	+"<li><button id='0' question='"+question_num+"' class='options btn btn-default' val='false' style='text-align: left; white-space: normal;'>A. "+op1+"</button></li>"
	+"<li><button id='1' question='"+question_num+"' class='options btn btn-default' val='false' style='text-align: left; white-space: normal;'>B. "+op2+"</button></li>"
	+"<li><button id='2' question='"+question_num+"' class='options btn btn-default' val='false' style='text-align: left; white-space: normal;'>C. "+op3+"</button></li>"
	+"<li><button id='3' question='"+question_num+"' class='options btn btn-default' val='false' style='text-align: left; white-space: normal;'>D. "+op4+"</button></li>"
	+"</ul></div></div>"
	$('#questions').append(element);
	user_answer.push({0: false, 1: false, 2: false, 3: false});
	question_num++;
});

activeLectureRef.on('value', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	if(value["status"].includes("lecture")){
		document.location.href = 'file:student_index.html';
	}
});

quizRef.on('value', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	if(value["totalStudent"] != undefined){
		totalStudent = value["totalStudent"];
	}
});
