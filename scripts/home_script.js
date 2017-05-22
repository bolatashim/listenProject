
$( document ).ready(function() {


  $(".clickable-course-card").click(function() {
    var code = $(this).children(".course-card-code").text();
    var title = $(this).children(".course-card-title").text();

    localStorage.courseCode = code;
    localStorage.courseTitle = title;

    document.location.href = './lectures_list_page.html';
  });

  $(".clickingbad-course-card").click(function() {
  	alert("It is not 'Add a course' period. Please refer to team Listen() for assistance.");
  });

});


