var topics = [];

/* Add a topic in html if enter pressed or button clicked */

$(document).ready(function(){
	$("#add_topic").click(addTopic);

	$("#topic").on("keyup", function(e){
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
	var topic = $("#topic").val();
	if(topic){
		$("#topic_list").append('<div class="topic"><div class="topic_name">' + topic + '</div><div class="topic_btn"><button class="delete" id="' + topics.length + '">&#10006</button></div></div>');
		topics.push(topic);
		$("#topic").val("");
		$("#topic").focus();
	}
}

function printList(){
	$("#topic_list").empty();
	for(var i = 0; i < topics.length; i++){
		$("#topic_list").append('<div class="topic"><div class="topic_name">' + topics[i] + '</div><div class="topic_btn"><button class="delete" id="' + i + '">&#10006</button></div></div>')
	}
}