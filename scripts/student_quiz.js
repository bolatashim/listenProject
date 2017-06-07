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

var quiz_num = "0";
var quiz_title;

var active_quiz_index = -1;
var questionRef = database.ref("tsQuiz/" + quiz_num + "/questions");
var quizRef = database.ref("tsQuiz/" + quiz_num);

var answer = [];
var user_answer = [];
var question_num = 1;
var score = 0;

if(student_id === undefined || student_email === undefined || student_lecture === undefined || student_course === undefined){
	alert("Please login first.");
	document.location.href = 'file:student_login.html';
}

$( document ).ready(function(){

	$("#student_profile").text("ID: "+student_id);
	$("#student_course").text("Course: "+student_course.split(" ")[0]);
	
	$("#questions").on('click', '.options',function(){
		if($(this).attr("val") === "false"){
			$(this).removeClass("btn-default");
			$(this).addClass("btn-success");
			$(this).attr("val", "true");
			user_answer[($(this).attr("question")-1)].push($(this).attr("id"));
		}
		else{
			$(this).addClass("btn-default");
			$(this).removeClass("btn-success");
			$(this).attr("val", "false");
			var index = user_answer[($(this).attr("question")-1)].indexOf($(this).attr("id"));
			user_answer[($(this).attr("question")-1)].splice(index, 1);
		}
	});

	$("#submit").click(function(){
		for(var i = 0; i < user_answer.length; i ++){
			for(var j = 0; j < user_answer[i].length; j++){
				if(answer[i].includes(user_answer[i][j])){
					var answerRef = database.ref("tsQuiz/"+quiz_num+"/questions/"+i+"/options/"+user_answer[i][j]);
					score += 5;
					answerRef.update({
						numCorrect: answerRef.numCorrect+1
					});
				}
			}
		}

		$("#submit").removeClass("btn-default");
		$("#submit").addClass("btn-success");
		$("#submit").text("Submitted!")
		$("#inputarea").val("");
		$("#inputarea").focus();
		localStorage.setItem(quiz_title, true);
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
	user_answer.push([]);
	question_num++;
});

quizRef.on('child_added', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	if(key == "title"){
		quiz_title = value;
		if(localStorage.getItem(value)){
			alert("You already submitted your answer.");
			document.location.href = 'file:student_index.html';
		}
	}
})

