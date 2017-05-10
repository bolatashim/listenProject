var data = [{"name": "Objects and Loops", "notAnsweredQ": [{"text": "What are for loops used for?", "time": 1, "understand": true},
															{"text": "Why does Hubo not move like I want him to?", "time": 2, "understand": false},
															{"text": "What's the purpose of creating objects?", "time": 3, "understand": false},
															{"text": "Random question because idk what to ask.", "time": 4, "understand": false},
															{"text": "What's the point of learning CS101?", "time": 5, "understand": false},
															{"text": "What's the point of using while loops instead of for?", "time": 6, "understand": true},
															{"text": "I am confused as to what range is.", "time": 7, "understand": false}],
											"answeredQ": [],
											"understand_per": 60},
			{"name": "Functions", "notAnsweredQ": [{"text": "What are parameters?", "time": 1, "understand": false},
															{"text": "What is the difference between parameter and argument?", "time": 2, "understand": true},
															{"text": "Why do you need to make functions?", "time": 3, "understand": true},
															{"text": "What is the meaning of 'def'?", "time": 4, "understand": true}],
											"answeredQ": [],
											"understand_per": 90},
			{"name": "Lists", "notAnsweredQ": [{"text": "How can I get a desired entry in a list?", "time": 1, "understand": false},
															{"text": "Why do indexes start at the number 0?", "time": 2, "understand": true},
															{"text": "How can I know if a certain thing is inside of a list?", "time": 3, "understand": false},
															{"text": "Is it possible to just get a certain part of the list?", "time": 4, "understand": false},
															{"text": "How do i delete something inside of a list?", "time": 5, "understand": false},
															{"text": "How to add something into a list?", "time": 6, "understand": false}],
											"answeredQ": [],
											"understand_per": 30}];
var sorting = "Time";
var part = 0;

var notAnsweredQuestions = data[part].notAnsweredQ;
var answeredQuestions = data[part].answeredQ;

$(document).ready(function(){
	printQuestions();
	changeDisplayEles();

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

	$("#next").on("click", function(){
		$(".active-lecture-area").animate({'opacity': 0}, 200, function(){
			part++;
			notAnsweredQuestions = data[part].notAnsweredQ;
			answeredQuestions = data[part].answeredQ;
			sortQuestions();
			printQuestions();
			changeDisplayEles();
			$(this).animate({'opacity': 1}, 200);
		});
	})

	$("#prev").on("click", function(){
		$(".active-lecture-area").animate({'opacity': 0}, 200, function(){
			part--;
			notAnsweredQuestions = data[part].notAnsweredQ;
			answeredQuestions = data[part].answeredQ;
			sortQuestions();
			printQuestions();
			changeDisplayEles();
			$(this).animate({'opacity': 1}, 200);
		});
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
		if(notAnsweredQuestions[i].understand){
			$(".question-list").append(`<tr class="question-entry" id="q-${i}">
				<td class="q-txt q-understand" data-id="${i}">${notAnsweredQuestions[i].text}
				<p class="q-details"> Time: ${notAnsweredQuestions[i].time}</p></td>
				<td class="q-del-btn" data-id="${i}">&#10006;</td></tr>`);
		}else{
			$(".question-list").append(`<tr class="question-entry" id="q-${i}">
				<td class="q-txt q-not-understand" data-id="${i}">${notAnsweredQuestions[i].text}
				<p class="q-details"> Time: ${notAnsweredQuestions[i].time}</p></td>
				<td class="q-del-btn" data-id="${i}">&#10006;</td></tr>`);
		}
	}
}

function printAnswered(index){
	for(var i = 0; i < index; i++){
		if(answeredQuestions[i]){
			if(answeredQuestions[i].understand){
				$(".question-list").append(`<tr class="question-entry" id="q-${i}">
					<td class="q-txt q-answered-txt q-understand" data-id="${i}">${answeredQuestions[i].text}
					<p class="q-details" style="color: #efefef"> Time: ${answeredQuestions[i].time}</p>
					<td class="q-del-btn" data-id="${i}">&#10006;</td></tr>`);
			}else{
				$(".question-list").append(`<tr class="question-entry" id="q-${i}">
					<td class="q-txt q-answered-txt q-not-understand" data-id="${i}">${answeredQuestions[i].text}
					<p class="q-details" style="color: #efefef"> Time: ${answeredQuestions[i].time}</p></td>
					<td class="q-del-btn" data-id="${i}">&#10006;</td></tr>`);
			}
		}
	}
}

function changeDisplayEles(){
	$("#prev").css("visibility", "visible");
	$("#next").css("visibility", "visible");
	if(part == 0)
		$("#prev").css("visibility", "hidden");
	if(part + 1 == data.length)
		$("#next").css("visibility", "hidden");

	$("#part-number").html("Lecture 8: Part " + (part + 1));
	$("#part-name").html(data[part].name);
	$(".understanding-bar-yes").css("width", data[part].understand_per + "%");
	$(".understanding-bar-yes").html(data[part].understand_per + "%");
	$(".understanding-bar-no").css("width", 100 - data[part].understand_per + "%")
	$(".understanding-bar-no").html(100 - data[part].understand_per + "%");
}