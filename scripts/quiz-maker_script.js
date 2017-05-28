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


  $("body").on("click", ".question-delete-btn", function() {
    $(this).closest("li").remove();

  });



  var questions = ["What is your name?", "What is more important? testing longer ext", "What is happening here?"]
  function addQuestions() {
    for (var i = questions.length - 1; i >= 0; i--) {
      var qu = questions[i];
      var olli =
        '<li><div class="quiz-question-line"><span class="quiz-question-text">' + qu + '</span> <a href="#" class="question-edit-action">EDIT</a><button class="quiz-question-save">Save</button><span class="glyphicon glyphicon-remove question-delete-btn" aria-hidden="true"></span></div>' + 
          '<table class="table options-table">' + 
            '<tr class="new-option-row">' + 
              '<td class="new-option-add-area"><input id="q1-option-1"  class="option-text-box" type="text" name="" placeholder="New option"><button class="btn btn-primary btn-sm option-add-btn" >Add</button></td>' + 
            '</tr>' + 
          '</table>' + 
        '</li>';

        $(".questions-ordered-list").append(olli);
    }  
    $(".quiz-question-save").toggle();
  }


  function addMoreQuestion() {
    var olli =
      '<li><div class="quiz-question-line"><span class="quiz-question-text">' + '</span> <a href="#" class="question-edit-action">EDIT</a><button class="quiz-question-save">Save</button><span class="glyphicon glyphicon-remove question-delete-btn" aria-hidden="true"></span></div>' + 
        '<table class="table options-table">' + 
          '<tr class="new-option-row">' + 
            '<td class="class-text"><input id="q1-option-1"  class="option-text-box" type="text" name="" placeholder="New option"><button class="btn btn-primary btn-sm option-add-btn" >Add</button></td>' + 
          '</tr>' + 
        '</table>' + 
      '</li>';
    $(".questions-ordered-list").append(olli);
    $whatineed = $("li").last().children(".quiz-question-line").children(".question-edit-action");
    $whatineed.trigger("click");
    $whatineed.siblings(".quiz-question-text").children(".new-quiz-question-name").attr("placeholder","New Question");
    $whatineed.siblings(".quiz-question-text").children(".new-quiz-question-name").focus();
    $whatineed.siblings(".quiz-question-save").toggle();
  }




  $("body").on("click", ".question-edit-action", function() {
    console.log("he");
    var old_quiz_question = $(this).siblings(".quiz-question-text").text();
    $(this).toggle();
    $(this).siblings('.quiz-question-text').html(`
      <input class='new-quiz-question-name' style="width: 70%;" value='${old_quiz_question}'>
    `);
    $(this).siblings('.quiz-question-text').children(".new-quiz-question-name").focus();
    $(this).siblings('.quiz-question-text').children(".new-quiz-question-name").select();
    $(this).siblings(".quiz-question-save").toggle();
  });

  $("body").on("click", ".quiz-question-save", function() {
    $(this).siblings(".question-edit-action").toggle();
    var new_quiz_question = $(this).siblings("span").children(".new-quiz-question-name").val();
    $(this).siblings(".quiz-question-text").html(new_quiz_question);
    //send to firebase
    $(this).toggle();
  });


  $("body").on("click", ".option-edit-action", function() {
  
    var old_quiz_option = $(this).siblings(".quiz-option-text").text();
    $(this).toggle();
    $(this).siblings('.quiz-option-text').html(`
      <input class='new-quiz-option-name' style="width: 70%" value='${old_quiz_option}'>
    `);
    $(this).siblings('.quiz-option-text').children(".new-quiz-option-name").focus();
    $(this).siblings('.quiz-option-text').children(".new-quiz-option-name").select();
    $(this).siblings(".quiz-option-save").css("display", "inline");
  });


  $("body").on("click", ".quiz-option-save", function() {
    $(this).siblings(".option-edit-action").toggle();
    var new_quiz_option = $(this).siblings("span").children(".new-quiz-option-name").val();
    $(this).siblings(".quiz-option-text").html(new_quiz_option);
    //send to firebase
    $(this).toggle();
  });

  $("body").on("keydown", ".new-quiz-option-name", function(evt) {
    if (evt.keyCode == 13) {
      $(this).parent(".quiz-option-text").siblings(".option-edit-action").toggle();
      var new_quiz_option = $(this).val();
      $(this).parent(".quiz-option-text").siblings(".quiz-option-save").toggle();
      //send to firebase
      $(this).parent(".quiz-option-text").html(new_quiz_option);
    }
  });

  $("body").on("click", "#addAnotherQuestion", function() {
    addMoreQuestion();
  });

  $("body").on("click", "#showadddeletebtn", function() {
    $(".option-add-btn").toggle();
  });

  $("body").on("click", ".option-add-btn", function() {
    var inpf = $(this).siblings("input");
    if(!inpf.val() == "") {
      var optionrow = '<tr class="option-row">  <td  class="option-text">'+ '<input type="checkbox" > &nbsp &nbsp ' + '<span class="quiz-option-text">' +  inpf.val() + '</span>' + ' <a href="#" class="option-edit-action">edit</a><button style="display:none" class="quiz-option-save">Save</button> </td> <td><span class="glyphicon glyphicon-remove option-delete-btn" aria-hidden="true"></span></td>    </tr>'
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
        var optionrow = '<tr class="option-row">  <td  class="option-text">'+ '<input type="checkbox" > &nbsp &nbsp ' + '<span class="quiz-option-text">' +  $(this).val() + '</span>' + ' <a href="#" class="option-edit-action">edit</a><button style="display:none" class="quiz-option-save">Save</button> </td> <td><span class="glyphicon glyphicon-remove option-delete-btn" aria-hidden="true"></span></td>    </tr>'
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