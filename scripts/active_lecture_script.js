var data = [{"tagName": "forloop", "questions": [{"text": "What are for loops used for?", "time": 1},
												{"text": "Random question because idk what to ask.", "time": 4},
												{"text": "I am confused as to what range is.", "time": 7}]},
			{"tagName": "homework", "questions": [{"text": "Why does Hubo not move like I want him to?", "time": 2}]},
			{"tagName": "objects", "questions": [{"text": "What's the purpose of creating objects?", "time": 3}]},
			{"tagName": "general", "questions": [{"text": "What's the point of learning CS101?", "time": 5}]},
			{"tagName": "whileloop", "questions": [{"text": "What's the point of using while loops instead of for?", "time": 6, "tag":"whileloop"}]}]

var tags = []
var notAnsweredQuestions = []
var answeredQuestions = []	

data.forEach(function(tag){
	tag.questions.forEach(function(question){
		question.tag = tag.tagName
		notAnsweredQuestions.push(question)
	})
	var obj = {"tagName": tag.tagName, "numQs": tag.questions.length}
	tags.push(obj)
})

function sortQuestions(questions){
	questions.sort(timeCompare)
}

function timeCompare(a, b){
	return a.time - b.time
}

function tagsCompare(a, b){
	return b.numQs - a.numQs
}

sortQuestions(notAnsweredQuestions)
tags.sort(tagsCompare)

$(document).ready(function(){
	printQuestions();
	printTags();
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

function printQuestions(name){
	$(".question-list").empty();
	if(!$(".show-more-btn").data("expanded")){
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

function printTags(){
	tags.forEach(function(tag){
		$(".tag-area").append(`<h5 class="tag-entry" data-name="${tag.tagName}"><a>#${tag.tagName}</a> <span style="color: orange">(${tag.numQs})</span></h5>`)
	})
}