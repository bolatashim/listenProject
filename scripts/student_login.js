var config={
	apiKey: "AIzaSyCxnL1UyMBU51tJU5MAKmCxHPAaMpb2veY",
	databaseURL: "https://listen-f5fcf.firebaseio.com/",
}
firebase.initializeApp(config);
var database = firebase.database();
var activeLectureRef = database.ref("activeLecture");
var activeLecture = [];
localStorage.clear();
/*
var studentRef = database.ref("courses/CS101/students");
studentRef.update({
	20150000: "hcilisten@gmail.com",
	20150001: "hcilisten@gmail.com",
	20150002: "hcilisten@gmail.com",
});
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
				document.location.href = 'file:student_index.html';
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
	$("#student_course").append("<option id="+value["course"]+">"+value["course"]+"</option>");
	activeLecture.push({course: value["course"], lecture: value["lecture"]});
});

activeLectureRef.on('child_removed', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	$("#"+value["course"]).remove();
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