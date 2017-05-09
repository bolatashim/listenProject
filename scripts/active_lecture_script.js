var questions = [{"text": "Question 1 What are for loops used for?", "answered": false},
				{"text": "Question 2 Why does Hubo not move like I want him to?", "answered": false},
				{"text": "Question 3 What's the purpose of creating objects?", "answered": false},
				{"text": "Question 4 Random question because idk what to ask. Lengthened to a 2 line question", "answered": false},
				{"text": "Question 5 What's the point of using while loops?", "answered": false},
				{"text": "Question 6 What's the point of using while loops?", "answered": false},
				{"text": "Question 7 What's the point of using while loops?", "answered": false},
				{"text": "Question 8 What's the point of using while loops?", "answered": false},
				{"text": "Question 9 What's the point of using while loops?", "answered": false}];

$(document).ready(function(){
	$(".question-list").on("click", ".q-txt", function(){
		$("#q-" + $(this).data("id")).animate({'opacity': 0}, 100, function(){
			var del_btn = $(this).children().last();
			del_btn.html("");
			del_btn.removeClass("q-del-btn").addClass("q-answered-del");
			var text = $(this).children().first();
			text.html("Answered").addClass("q-answered-txt").css({"text-align": "center", "border-width": "1px 0px 1px 1px"});
			$(this).animate({'opacity': 1}, 100).delay(300);

			var entry = questions[text.data("id")];
			questions.splice(text.data("id"), 1);
			entry.answered = true;
			questions.push(entry);
			$(this).fadeOut(200, function(){
				$(this).remove()
				printQuestions();
			})
		})
	})

	$(".question-list").on("click", ".q-del-btn", function(){
		$("#q-" + $(this).data("id")).fadeOut(200, function(){
			$(this).remove()
			questions.splice($(this).data("id"), 1);
			printQuestions();
		});
	})

	$(".show-more-btn").on("click", function(){
		if($(this).data("expanded")){
			$(this).data("expanded", false);
			$(this).html("Show More")
		}else{
			$(this).data("expanded", true);
			$(this).html("Show Less")
		}
		printQuestions();
	})
})

function printQuestions(){
	$(".question-list").empty();
	var index = questions.length;
	if(!$(".show-more-btn").data("expanded"))
		index = 5;
	for(var i = 0; i < index; i++){
		if(questions[i].answered){
			$(".question-list").append(`<tr class="question-entry" id="q-${i}"><td class="q-txt q-answered-txt" data-id="${i}">${questions[i].text}</td><td class="q-del-btn" data-id="${i}">&#10006;</td></tr>`);
		}else{
			$(".question-list").append(`<tr class="question-entry" id="q-${i}"><td class="q-txt" data-id="${i}">${questions[i].text}</td><td class="q-del-btn" data-id="${i}">&#10006;</td></tr>`);
		}
	}
}