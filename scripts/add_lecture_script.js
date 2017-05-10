var topics = [];
var topicHTMLst = '<tr><td height="35px"></td><td><div id="topic" class="topic_name" contenteditable="true">'
var topicHTMLmid = '</div><button class="delete" id="'
var topicHTMLend = '">&#10006</button></td></tr>'

/* Add a topic in html if enter pressed or button clicked */

$(document).ready(function(){
	$("#add_topic").click(addTopic);
	$("#input_title").select();
	$("#input_topic").on("keyup", function(e){
		if(e.keyCode == 13){
			addTopic();
		}
	})

	$("#topic_list").on("click", "button", function(){
		topics.splice($(this).attr("id"), 1);
		printList();
	})

	$("#topic").on("click", "button", function(){
		$(this).select();
	})
})

function addTopic(){
	var topic = $("#input_topic").val();
	if(topic){
		$("#topic_list").append(topicHTMLst + topic + topicHTMLmid + topics.length +  topicHTMLend);
		topics.push(topic);
		$("#input_topic").val("add your topic parts here");
		$("#input_topic").select();
		$("#input_topic").focus();
	}
}

function printList(){
	$("#topic_list").empty();
	for(var i = 0; i < topics.length; i++){
		$("#topic_list").append(topicHTMLst + topics[i] + topicHTMLmid + i + topicHTMLend)
	}
}
