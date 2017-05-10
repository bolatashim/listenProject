var parts = [];
var partHTMLst = '<tr><td height="35px"></td><td><div id="part" class="part_name" contenteditable="true">'
var partHTMLmid = '</div><button class="delete" id="'
var partHTMLend = '">&#10006</button></td></tr>'

/* Add a part in html if enter pressed or button clicked */

$(document).ready(function(){
	$("#add_part").click(addpart);
	$("#input_title").select();
	$("#input_part").on("keyup", function(e){
		if(e.keyCode == 13){
			addpart();
		}
	})

	$("#part_list").on("click", "button", function(){
		parts.splice($(this).attr("id"), 1);
		printList();
	})

	$("#part").on("click", "button", function(){
		$(this).select();
	})
})

function addpart(){
	var part = $("#input_part").val();
	if(part){
		$("#part_list").append(partHTMLst + part + partHTMLmid + parts.length +  partHTMLend);
		parts.push(part);
		$("#input_part").val("add your part names here");
		$("#input_part").select();
		$("#input_part").focus();
	}
}

function printList(){
	$("#part_list").empty();
	for(var i = 0; i < parts.length; i++){
		$("#part_list").append(partHTMLst + parts[i] + partHTMLmid + i + partHTMLend)
	}
}
