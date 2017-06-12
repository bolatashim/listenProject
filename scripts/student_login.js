var config={
	apiKey: "AIzaSyCxnL1UyMBU51tJU5MAKmCxHPAaMpb2veY",
	databaseURL: "https://listen-f5fcf.firebaseio.com/",
}
firebase.initializeApp(config);
var database = firebase.database();
var activeLectureRef = database.ref("activeLecture");
var activeLecture = [];
var quiz_mode = false;
localStorage.removeItem("id");
localStorage.removeItem("email");
localStorage.removeItem("course");
localStorage.removeItem("lecture");

//localStorage.clear();
/*
var studentRef = database.ref("courses/CS101/students");
studentRef.update({
	20150000: "hcilisten@gmail.com",
	20150001: "hcilisten@gmail.com",
	20150002: "hcilisten@gmail.com",
});
*/
/*
localStorage.setItem("id", 20150000);
localStorage.setItem("email", "hcilisten@gmail");
localStorage.setItem("course", "CS101");
localStorage.setItem("lecture", "Lecture 1");
*/

$( document ).ready(function() {
	$("#join").click(function(){
		var id = $("#student_id").val();
		var email = $("#student_email").val();
		var course = $("#student_course").val();
		var studentRef = database.ref("courses/"+course.split(" ")[0]+"/students");
		
  		studentRef.once('value', function(snapshot){
  			if(snapshot.hasChild(id)){
  				localStorage.setItem("id", id);
				localStorage.setItem("email", email);
				localStorage.setItem("course", course);
				localStorage.setItem("lecture", find_lecture(course));
				if(quiz_mode)
					document.location.href = './student_quiz.html';
				else
					document.location.href = './student_index.html';
  			}
  			else{
  				alert("We are sorry! Currently, you cannot join course "+course+". The course is not activated yet, or you are not registered in the course");
  			}
  		});
	});
})

activeLectureRef.on('child_added', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	if(key == "status" && value.includes("quiz")){
		quiz_mode = true;
		localStorage.setItem("quiz_index", value.split(", ")[1]);
		return;
	}
	else if(key == "status" && value.includes("lecture")){
		quiz_mode = false;
		return;
	}
	$("#student_course").append("<option id="+value["course"]+">"+value["course"]+"</option>");
	activeLecture.push({course: value["course"], lecture: value["lecture"]});
});

activeLectureRef.on('value', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	if(value["status"].includes("quiz")){
		quiz_mode = true;
		localStorage.setItem("quiz_index", value["status"].split(", ")[1]);
		return;
	}
	else if(value["status"].includes("lecture")){
		quiz_mode = false;
		return;
	}
});

activeLectureRef.on('child_removed', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	var index = 0;
	while(index < activeLecture.length){
		if(value["course"] == activeLecture[index]["course"])
			break;
		index++;
	}
	activeLecture.splice(index, 1);
	$("#student_course").html("");
	for(var cnt = 0; cnt < activeLecture.length; cnt++){
		$("#student_course").append("<option id="+activeLecture[cnt]["course"]+">"+activeLecture[cnt]["course"]+"</option>")
	}
});

function find_lecture(course){
	for(var i = 0; i < activeLecture.length; i++){
		if(activeLecture[i]["course"] == course){
			return activeLecture[i]["lecture"];
		}
	}
	alert("No such course found!");
	return -1;
}