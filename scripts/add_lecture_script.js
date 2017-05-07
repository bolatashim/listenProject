var topics = [];
var topicHTMLst = '<tr><td height="35px"></td><td><div class="topic_name">'
var topicHTMLmid = '</div><button class="delete" id="'
var topicHTMLend = '">&#10006</button></td></tr>'

/* Add a topic in html if enter pressed or button clicked */

$(document).ready(function(){
	$(".lecture_add_button").click(addTopic);

	$("#topic_input").on("keyup", function(e){
		if(e.keyCode == 13){
			addTopic();
		}
	})

	$("#topic_list").on("click", "button", function(){
		topics.splice($(this).attr("id"), 1);
		printList();
	})
})


function addTopic(){
	var topic = $("#topic_input").val();
	if(topic){
		$("#topic_list").append(topicHTMLst + topic + topicHTMLmid + topics.length +  topicHTMLend);
		topics.push(topic);
		$("#topic_input").val("");
		$("#topic_input").focus();
	}
}

function printList(){
	$("#topic_list").empty();
	for(var i = 0; i < topics.length; i++){
		$("#topic_list").append(topicHTMLst + topics[i] + topicHTMLmid + i + topicHTMLend)
	}
}