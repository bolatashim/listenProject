var notAnsweredQuestions = [{"text": "Question 1 What are for loops used for?", "time": 1, "understand": true},
				{"text": "Question 2 Why does Hubo not move like I want him to?", "time": 2, "understand": false},
				{"text": "Question 3 What's the purpose of creating objects?", "time": 3, "understand": false},
				{"text": "Question 4 Random question because idk what to ask. Lengthened to a 2 line question", "time": 4, "understand": false},
				{"text": "Question 5 What's the point of using while loops?", "time": 5, "understand": true},
				{"text": "Question 6 What's the point of using while loops?", "time": 6, "understand": false},
				{"text": "Question 7 What's the point of using while loops?", "time": 7, "understand": true},
				{"text": "Question 8 What's the point of using while loops?", "time": 8, "understand": false},
				{"text": "Question 9 What's the point of using while loops?", "time": 9, "understand": false}];
var answeredQuestions = []
var sorting = "Time";

$(document).ready(function(){
	$(".question-list").on("click", ".q-txt", function(){
		if(!$("#q-" + $(this).data("id")).data("answered")){
			$("#q-" + $(this).data("id")).animate({'opacity': 0}, 100, function(){
				var del_btn = $(this).children().last();
				del_btn.html("");
				del_btn.removeClass("q-del-btn").addClass("q-answered-del");
				var text = $(this).children().first();
				text.html("Answered").addClass("q-answered-txt").css({"text-align": "center", "border-width": "1px 0px 1px 1px"});
				$(this).animate({'opacity': 1}, 100).delay(300);

				var entry = notAnsweredQuestions[text.data("id")];
				notAnsweredQuestions.splice(text.data("id"), 1);
				answeredQuestions.push(entry);
				$(this).fadeOut(200, function(){
					$(this).remove()
					printQuestions();
				})
			})
		}
	})

	$(".question-list").on("click", ".q-del-btn", function(){
		$("#q-" + $(this).data("id")).fadeOut(200, function(){
			$(this).remove();
			if($(this).parent().data("answered")){
				answeredQuestions.splice($(this).data("id"), 1);
			}else{
				notAnsweredQuestions.splice($(this).data("id"), 1);
			}
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

	$(".sorting").on("click", ".btn", function(){
		if($(this).attr("id") != sorting){
			$("#" + sorting).removeClass("active");
			sorting = $(this).attr("id");
			$(this).addClass("active");
		}
		sortQuestions();
		printQuestions();
	})
})

function timeCompareFunc(a, b){
	return a.time - b.time;
}
function understandCompareFunc(a, b){
	if(a.understand && !b.understand){
		return 1;
	}else if(!a.understand && b.understand){
		return -1;
	}else{
		return 0;
	}
}

function sortQuestions(){
	if(sorting == "Time"){
		notAnsweredQuestions.sort(timeCompareFunc);
		answeredQuestions.sort(timeCompareFunc);
	}else{
		notAnsweredQuestions.sort(understandCompareFunc);
		answeredQuestions.sort(understandCompareFunc);
	}
}

function printQuestions(){
	$(".question-list").empty();
	if(!$(".show-more-btn").data("expanded")){
		if(notAnsweredQuestions.length < 5){
			var index = 5 - notAnsweredQuestions.length;
			for(var i = 0; i < notAnsweredQuestions.length; i++){
				$(".question-list").append(`<tr class="question-entry" id="q-${i}"><td class="q-txt" data-id="${i}">${notAnsweredQuestions[i].text}</td><td class="q-del-btn" data-id="${i}">&#10006;</td></tr>`);
			}
			for(var i = 0; i < index; i++){
				$(".question-list").append(`<tr class="question-entry" id="q-${i}"><td class="q-txt q-answered-txt" data-id="${i}">${answeredQuestions[i].text}</td><td class="q-del-btn" data-id="${i}">&#10006;</td></tr>`);
			}
		}else{
			for(var i = 0; i < 5; i++){
				$(".question-list").append(`<tr class="question-entry" id="q-${i}"><td class="q-txt" data-id="${i}">${notAnsweredQuestions[i].text}</td><td class="q-del-btn" data-id="${i}">&#10006;</td></tr>`);
			}
		}
	}else{
			for(var i = 0; i < notAnsweredQuestions.length; i++){
				$(".question-list").append(`<tr class="question-entry" id="q-${i}"><td class="q-txt" data-id="${i}">${notAnsweredQuestions[i].text}</td><td class="q-del-btn" data-id="${i}">&#10006;</td></tr>`);
			}
			for(var i = 0; i < answeredQuestions.length; i++){
				$(".question-list").append(`<tr class="question-entry" id="q-${i}"><td class="q-txt q-answered-txt" data-id="${i}">${answeredQuestions[i].text}</td><td class="q-del-btn" data-id="${i}">&#10006;</td></tr>`);
			}
	}
}