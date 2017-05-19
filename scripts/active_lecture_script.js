var data = [{"tagName": "forloop", "questions": [{"text": "What are for loops used for?", "time": 1},
												{"text": "Random question because idk what to ask.", "time": 4},
												{"text": "I am confused as to what range is.", "time": 7}]},
			{"tagName": "homework", "questions": [{"text": "Why does Hubo not move like I want him to?", "time": 2}]},
			{"tagName": "objects", "questions": [{"text": "What's the purpose of creating objects?", "time": 3}]},
			{"tagName": "general", "questions": [{"text": "What's the point of learning CS101?", "time": 5}]},
			{"tagName": "whileloop", "questions": [{"text": "What's the point of using while loops instead of for?", "time": 6}]}]

var tags = []
var questions = []
var name = ""

data.forEach(function(tag){
	tag.questions.forEach(function(question){
		question.tag = tag.tagName
		question.answered = false
		questions.push(question)
	})
	var obj = {"tagName": tag.tagName, "numQs": tag.questions.length}
	tags.push(obj)
})

sortQuestions()
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

				questions[text.data("id")].answered = true;
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

	$(".tag-area").on("click", ".tag-entry", function(){
		if($(this).hasClass("selected-tag")){
			name = ""
			printQuestions()
			$(this).removeClass("selected-tag")
		}else{
			$(".tag-area").find(".selected-tag").removeClass("selected-tag")
			name = $(this).data("name")
			printQuestions()
			$(this).addClass("selected-tag")
		}
	})
})

function sortQuestions(){
	questions.sort(timeCompare)
	questions.sort(answeredCompare)
}

function timeCompare(a, b){
	return a.time - b.time
}

function answeredCompare(a, b){
	if((a.answered && b.answered) || (!a.answered && !b.answered)){
		return 0
	}else if(a.answered && !b.answered){
		return 1
	}else{
		return -1
	}
}

function tagsCompare(a, b){
	return b.numQs - a.numQs
}

function printQuestions(){
	$(".question-list").empty();
	sortQuestions()
	if(!$(".show-more-btn").data("expanded")){
		var i = 0
		var printed = 0
		while(printed < 5 && i < questions.length){
			printed += printQ(i)
			i++
		}
	}else{
		for(var i = 0; i < questions.length; i++)
			printQ(i)
	}

	if(questions.length < 6)
		$(".show-more-btn").css("visibility", "hidden");
	else
		$(".show-more-btn").css("visibility", "visible");
}

function printQ(i){
	if(!name || questions[i].tag == name){
		if(!questions[i].answered){
			$(".question-list").append(`<tr class="question-entry" id="q-${i}">
				<td class="q-txt" data-id="${i}">
				<p class="q-details"> <span style="color:#337ab7">#${questions[i].tag}</span> 
				Time: ${questions[i].time}</p>${questions[i].text}</td>
				<td class="q-del-btn" data-id="${i}">&#10006;</td></tr>`);
		}else{
			$(".question-list").append(`<tr class="question-entry" id="q-${i}">
				<td class="q-txt q-answered-txt q-understand" data-id="${i}">
				<p class="q-details" style="color: #efefef"> #${questions[i].tag}
				Time: ${questions[i].time}</p>${questions[i].text}</td>
				<td class="q-del-btn" data-id="${i}">&#10006;</td></tr>`);
		}
		return 1
	}
	return 0
}


function printTags(){
	tags.forEach(function(tag){
		$(".tag-area").append(`<h5 class="tag-entry" data-name="${tag.tagName}"><a>#${tag.tagName}</a> <span style="color: orange">(${tag.numQs})</span></h5>`)
	})
}