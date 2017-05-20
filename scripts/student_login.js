var config={
	apiKey: "AIzaSyBUROLOtK8FwnXVlCvcLJIz-HN07Q3sxEk",
	databaseURL: "https://listen-1887f.firebaseio.com/",
}
firebase.initializeApp(config);
var database = firebase.database();
var activeLectureRef = database.ref("activeLecture");
var studentListRef = database.ref("studentList");
var activeLecture = [];

$( document ).ready(function() {
	$("#join").click(function(){
		var id = $("#student_id").val();
		var email = $("#student_email").val();
		var course = $("#student_course").val();

		if(jQuery.inArray(id, studentList) != -1){
			localStorage.setItem("id", id);
			localStorage.setItem("email", email);
			localStorage.setItem("course", course);
			document.location.href = 'file:student_index.html';
		}
		else{
			alert("You are not registered in course "+course+". Tell your instructor to add you in this course");
		}
	});
})

activeLectureRef.on('child_added', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	activeLecture.push(value["course"]);
	$("#student_course").html("<option>"+value["course"]+"</option>");
});