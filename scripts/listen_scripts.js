
$( document ).ready(function() {
  //Toggle active & inactive states
  $("#cs101tab").click(function () {
    if (!$(this).hasClass("listen-active-tab")) {
      $("#cs101tab").toggleClass("listen-active-tab listen-inactive-tab");
      $("#cs101content").toggleClass("listen-active-content listen-inactive-content");
      $("#cs374tab").toggleClass("listen-inactive-tab listen-active-tab");
      $("#cs374content").toggleClass("listen-inactive-content listen-active-content"); 
    }
  });

  $("#cs374tab").click(function () {
    if(!$(this).hasClass("listen-active-tab")) {
      $("#cs374tab").toggleClass("listen-active-tab listen-inactive-tab");
      $("#cs374content").toggleClass("listen-active-content listen-inactive-content");
      $("#cs101tab").toggleClass("listen-inactive-tab listen-active-tab");
      $("#cs101content").toggleClass("listen-inactive-content listen-active-content");
    }
  });

	$("#add_topic").click(function () {
		var input = $("#input_topic").val();
		$("#topic_list").append("<li>"+input+"</li>");
		$("#input_topic").val("");
		e.preventDefault();
	});
});


