var topics = [];

/* Add a topic in html if enter pressed or button clicked */

$("#add_topic").click(addTopic);

$("#topic").on("keyup", function(e){
	if(e.keyCode == 13){
		addTopic();
	}
})

function addTopic(){
	var topic = $("#topic").val();
	if(topic){
		$("#topic_list").append('<div class="topic">' + topic + '</div>');
		topics.push(topic);
		$("#topic").val("");
		$("#topic").focus();
	}
}