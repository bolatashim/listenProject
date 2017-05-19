var data = {"notAnsweredQ": [{"text": "What are for loops used for?", "time": 1, "tag": "forloop"},
															{"text": "Why does Hubo not move like I want him to?", "time": 2, "tag":"homework"},
															{"text": "What's the purpose of creating objects?", "time": 3, "tag":"objects"},
															{"text": "Random question because idk what to ask.", "time": 4, "tag":"forloop"},
															{"text": "What's the point of learning CS101?", "time": 5, "tag":"general"},
															{"text": "What's the point of using while loops instead of for?", "time": 6, "tag":"whileloop"},
															{"text": "I am confused as to what range is.", "time": 7, "tag":"forloop"}],
											"answeredQ": []}

var notAnsweredQuestions = data.notAnsweredQ;
var answeredQuestions = data.answeredQ;

$(document).ready(function(){
	printQuestions();
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
})

function printQuestions(){
	$(".question-list").empty();
	if(!$(".show-more-btn").data("expanded")){
		var class_type = `"`;
		if(notAnsweredQuestions.length < 5){
			var index = 5 - notAnsweredQuestions.length;
			printNotAnswered(notAnsweredQuestions.length);
			printAnswered(index);
		}else{
			printNotAnswered(5)
		}
	}else{
		printNotAnswered(notAnsweredQuestions.length)
		printAnswered(answeredQuestions.length)
	}
	if(notAnsweredQuestions.length + answeredQuestions.length < 6)
		$(".show-more-btn").css("visibility", "hidden");
	else
		$(".show-more-btn").css("visibility", "visible");
}

function printNotAnswered(index){
	for(var i = 0; i < index; i++){
		$(".question-list").append(`<tr class="question-entry" id="q-${i}">
			<td class="q-txt" data-id="${i}">
			<p class="q-details"> <span style="color:#337ab7">#${notAnsweredQuestions[i].tag}</span> 
			Time: ${notAnsweredQuestions[i].time}</p>${notAnsweredQuestions[i].text}</td>
			<td class="q-del-btn" data-id="${i}">&#10006;</td></tr>`);
	}
}

function printAnswered(index){
	for(var i = 0; i < index; i++){
		if(answeredQuestions[i]){
			$(".question-list").append(`<tr class="question-entry" id="q-${i}">
				<td class="q-txt q-answered-txt q-understand" data-id="${i}">
				<p class="q-details" style="color: #efefef"> #${answeredQuestions[i].tag}
				Time: ${answeredQuestions[i].time}</p>${answeredQuestions[i].text}</td>
				<td class="q-del-btn" data-id="${i}">&#10006;</td></tr>`);
		}
	}
}