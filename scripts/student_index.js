var config={
	apiKey: "AIzaSyBUROLOtK8FwnXVlCvcLJIz-HN07Q3sxEk",
	databaseURL: "https://listen-1887f.firebaseio.com/",
}
firebase.initializeApp(config);
var database = firebase.database();
var tagRef = database.ref("tags");
var tags = [];
var student_id = localStorage.id;
var student_email = localStorage.email;
var student_course = localStorage.course;

$( document ).ready(function(){
	$("#student_profile").text("ID: "+student_id);
	$("#student_course").text("Course: "+student_course);

	$(".tag").click(function(){
		if($(this).text()=="Create tag"){
			$("#selected_tag").html("<input class='input-sm cur_tag'></input>");
			$(".cur_tag").focus();
		}
		else{
			$("#selected_tag").html("<font class='cur_tag'>"+$(this).text()+"</font>");
			$("#inputarea").focus();
		}
	});
	/*
	$("#selected_tag").on('click', '.btn-default', function(){
		$("#selected_tag").html("");
	});
	*/
	$("#submit").click(function(){
		tagRef.push({
			id: student_id,
			email: student_email,
			question: $("#inputarea").val(),
		})
		$("#inputarea").val("");
	});
})
/*
tagRef.on('child_added', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	tag.push(value['tag']);
});
*/
