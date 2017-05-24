$( document ).ready(function() {

  var config = {
    apiKey: "AIzaSyCxnL1UyMBU51tJU5MAKmCxHPAaMpb2veY",
    authDomain: "listen-f5fcf.firebaseapp.com",
    databaseURL: "https://listen-f5fcf.firebaseio.com",
    projectId: "listen-f5fcf",
    storageBucket: "listen-f5fcf.appspot.com",
    messagingSenderId: "913421957842"
  };
  
  firebase.initializeApp(config);
  var database = firebase.database();
	var quizRef = database.ref("bolatQuiz");


	var variants = ["A.", "B.", "C.", "D", "E", "F", "G"];


  $("body").on("click", ".option-delete-btn", function() {
    var row = $(this).closest("tr");
    row.remove();
  });


  var questions = ["What is your name?", "What is more important?", "What is happening here?"]
  function addQuestions() {
  	for (var i = questions.length - 1; i >= 0; i--) {
  		var qu = questions[i];
  		var olli =
				'<li><span class="quiz-question-text">' + qu + '</span>' + 
					'<table class="table options-table">' + 
						'<tr class="new-option-row">' + 
							'<td class="class-text"><input id="q1-option-1"  class="option-text-box" type="text" name="" placeholder="New option"><button class="btn btn-primary btn-sm option-add-btn" >Add</button></td>' + 
						'</tr>' + 
					'</table>' + 
				'</li><br />';

				$(".questions-ordered-list").append(olli);


  	}
  }


  $("body").on("click", ".option-add-btn", function() {
  	var inpf = $(this).siblings("input");
  	if(!inpf.val() == "") {
  		//console.log($(this).closest("table").find("tr").length);
  		var optionrow = '<tr class="option-row">  <td  class="option-text">'+ '<input type="checkbox" > &nbsp &nbsp ' + inpf.val() + '</td> <td class="option-delete-btn"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td>    </tr>'
  		$(optionrow).insertBefore($(this).closest("tr"));
  		inpf.val("");
  		inpf.focus();
  	} else {
  		alert("Option text is empty");
  		$(this).siblings("input").focus();
  	}
  });

  $("body").on("keydown", ".option-text-box", function(evt) {
  	if (evt.keyCode == 13) {
  		console.log("enter pressed");
	  	if(!$(this).val() == "") {
	  		var optionrow = '<tr class="option-row">  <td  class="option-text">'+ '<input type="checkbox" > &nbsp &nbsp' + $(this).val() + '</td> <td class="option-delete-btn"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td>    </tr>'
	  		$(optionrow).insertBefore($(this).closest("tr"));
	  		$(this).val("");
	  		$(this).focus();
	  	} else {
	  		alert("Option text is empty");
	  		$(this).focus();
	  	}
  	}
  });


  $("body").on("click", ".btn-save-quiz", function(evt) {


		var listItems = $(".questions-ordered-list li");

		listItems.each(function(idx, li) {

		    var lis = $(li);
		    var optable = lis.find("table tr");
		    var options = [];
		    var optref = database.ref("bolatQuiz/questions/" + "Question " + idx + "/" + "options");
		    //the last row is the add row
		    for (var i = 0; i < optable.length-1; i++) {
		    	var tt = $(optable[i]);
		    	var opt = tt.find("td").eq(0).text().trim();
		    	var corwrong = tt.find("td").eq(0).find("input").prop("checked");
		    	optref.push({option: opt, correct: corwrong});
		    }
		});

  });

  addQuestions();

});