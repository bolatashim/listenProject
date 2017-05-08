$( document ).ready(function(){
	$(".q_list").on("click", "div", function(){
		if($(this).data("selected")){
			$(this).data("selected", false);
			$(this).removeClass("q_entry_sel", 100);
		}else{
			$(this).data("selected", true);
			$(this).addClass("q_entry_sel", 100);
		}
	})
})
