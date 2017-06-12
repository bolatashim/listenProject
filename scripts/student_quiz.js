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
var questionRef = database.ref("courses/"+localStorage.course.split(" ")[0]+"/Quiz/" + quiz_num + "/questions");
var quizRef = database.ref("courses/"+localStorage.course.split(" ")[0]+"/Quiz/" + quiz_num);
var answersRef = database.ref("courses/"+localStorage.course.split(" ")[0]+"/Quiz" + quiz_num + "/answers")

var answer = [];
var user_answer = [];
var question_num = 1;
var score = 0;
var totalStudent;

if(student_id === undefined || student_email === undefined || student_lecture === undefined || student_course === undefined){
	alert("Please login first.");
	document.location.href = './student_login.html';
}

if(localStorage[localStorage.quiz_index] == "true"){
	alert("You already submitted your answer.");
	document.location.href = './student_index.html';
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
			var totalScoreRef = database.ref("courses/"+localStorage.course.split(" ")[0]+"/Quiz/" + quiz_num + "/questions/" + i + "/totalScore")
			var score = 0;
			Object.keys(user_answer[i]).forEach(function(key){
				if(answer[i].includes(key) && user_answer[i][key])
					score++
				if(!answer[i].includes(key) && !user_answer[i][key])
					score++
			})
			totalScoreRef.transaction(function(total){
				if(total)
					return total + score
				else
					return score
			})
		}

		database.ref("courses/"+localStorage.course.split(" ")[0]+"/Quiz/"+quiz_num+"/totalStudent").set(totalStudent+1);
		localStorage.setItem(quiz_num, true);
		localStorage.setItem("quiz_index", "none");
		document.location.href = './student_index.html';
	});
});

questionRef.on('child_added', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();

	var question = value["title"];
	var element = "<div class='panel panel-default'><h4>Q"+question_num+" "+question+"</h4><div><ul style='list-style: none;'>"

	database.ref("courses/"+localStorage.course.split(" ")[0]+"/Quiz/" + quiz_num + "/questions/"+(question_num-1)+"/options").once('value', function(snapshot){
		var option_num = 0;
		var obj = {}
		snapshot.forEach(function(childSnapshot){
			obj[option_num] = false
			var childkey = childSnapshot.key;
			var childvalue = childSnapshot.val();
			element += "<li><button id='" + option_num + "' question='"+question_num+"' class='options btn btn-default' val='false' style='text-align: left; white-space: normal;'>";
			element += String.fromCharCode(option_num+65)+". "+childvalue.text+"</button></li>";
			option_num++;
		})
		user_answer.push(obj)
	})
	answer.push(value["answer"]);
	element += "</ul></div></div>";
	$('#questions').append(element);
	question_num++;
});

activeLectureRef.on('value', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	if(value["status"].includes("lecture")){
		document.location.href = './student_index.html';
	}
});

quizRef.on('value', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	if(value["totalStudent"] != undefined){
		totalStudent = value["totalStudent"];
	}
});
