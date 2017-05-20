$( document ).ready(function() {
	$("#join").click(function(){
		localStorage.setItem("id", $("#student_id").val());
		localStorage.setItem("email", $("#student_email").val());

		document.location.href = 'file:student_index.html';
	});
})

