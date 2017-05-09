var savedHTML = "<td class='q-saved'>Saved</td>";
var questions = [];

$(document).ready(function(){
	$(".question-list").on("click", ".q-txt", function(){
		$("#q-" + $(this).data("id")).animate({'opacity': 0}, 100, function(){
			var del_btn = $(this).children().last();
			del_btn.html("");
			del_btn.removeClass("q-del-btn").addClass("q-saved-del");
			var text = $(this).children().first();
			text.html("Answered").addClass("q-saved-txt");
			$(this).animate({'opacity': 1}, 100).delay(300);
			$(this).fadeOut(200, function(){parent.remove()})
		})
	})

	$(".question-list").on("click", ".q-del-btn", function(){
		$("#q-" + $(this).data("id")).remove()
	})
})