var config={
	apiKey: "AIzaSyCxnL1UyMBU51tJU5MAKmCxHPAaMpb2veY",
	databaseURL: "https://listen-f5fcf.firebaseio.com/",
}
firebase.initializeApp(config);
var database = firebase.database();
var student_id = localStorage.id;
var student_email = localStorage.email;
var student_course = localStorage.course.split(" ")[0];
var student_lecture = localStorage.lecture;
var lectureRef = database.ref("courses/"+student_course+"/lectures/"+student_lecture);
var tagRef = database.ref("courses/"+student_course+"/lectures/"+student_lecture+"/tags");
var tags = [];

$( document ).ready(function(){
	$("#student_profile").text("ID: "+student_id);
	$("#student_course").text("Course: "+student_course);

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
		var addtagRef = database.ref("courses/"+student_course+"/lectures/"+student_lecture+"/tags/"+$(".cur_tag").val());
		addtagRef.push({
			answered: false,
			asker: student_id,
			email: student_email,
			text: $("#inputarea").val(),
			time: Date($.now()),
		})
		alert("submited");
		$("#inputarea").val("");
	});
})

tagRef.on('child_added', function(snapshot){
	var key = snapshot.key;
	var value = snapshot.val();
	$("#tags").append(" <button class='btn tag'>"+key+"</button>");
	tags.push(key);
});
