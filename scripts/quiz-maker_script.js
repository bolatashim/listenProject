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

  var newQuizRef = database.ref("courses/"+localStorage.courseCode+"/Quiz");

  var newIndex = 0;
  
  newQuizRef.once("value", function(data){ newIndex = data.numChildren()});
  
  $("body").on("click", ".option-delete-btn", function() {
    var row = $(this).closest("tr");
    row.remove();
    checkToDisplay();
  });


  $("body").on("click", ".question-delete-btn", function() {
    $(this).closest("li").remove();
    checkToDisplay();
  });

  var questions = [];

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

  $(".quiz-title-save").toggle();

  $("body").on("click", ".title-edit-action", function() {
    var old_quiz_question = $(this).siblings(".quiz-title-text").text();
    $(this).toggle();
    $(this).siblings('.quiz-title-text').html(`
      <input class='new-quiz-question-name' style="width: 70%;" value='${old_quiz_question}'>
    `);
    $(this).siblings('.quiz-title-text').children(".new-quiz-question-name").focus();
    $(this).siblings('.quiz-title-text').children(".new-quiz-question-name").select();
    $(this).siblings(".quiz-title-save").toggle();
    checkToDisplay();
  });

  $("body").on("click", ".quiz-title-save", function() {
    $(this).siblings(".title-edit-action").toggle();
    var new_quiz_question = $(this).siblings("span").children(".new-quiz-question-name").val();
    $(this).siblings(".quiz-title-text").html(new_quiz_question);
    //send to firebase
    $(this).toggle();
    checkToDisplay();
  });




  $("body").on("click", ".question-edit-action", function() {
    var old_quiz_question = $(this).siblings(".quiz-question-text").text();
    $(this).toggle();
    $(this).siblings('.quiz-question-text').html(`
      <input class='new-quiz-question-name' style="width: 70%;" value='${old_quiz_question}'>
    `);
    $(this).siblings('.quiz-question-text').children(".new-quiz-question-name").focus();
    $(this).siblings('.quiz-question-text').children(".new-quiz-question-name").select();
    $(this).siblings(".quiz-question-save").toggle();
    checkToDisplay();
  });

  $("body").on("click", ".quiz-question-save", function() {
    $(this).siblings(".question-edit-action").toggle();
    var new_quiz_question = $(this).siblings("span").children(".new-quiz-question-name").val();
    $(this).siblings(".quiz-question-text").html(new_quiz_question);
    //send to firebase
    $(this).toggle();
    checkToDisplay();
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
    checkToDisplay();
  });


  $("body").on("click", ".quiz-option-save", function() {
    $(this).siblings(".option-edit-action").toggle();
    var new_quiz_option = $(this).siblings("span").children(".new-quiz-option-name").val();
    $(this).siblings(".quiz-option-text").html(new_quiz_option);
    //send to firebase
    $(this).toggle();
    checkToDisplay();
  });

  $("body").on("keydown", ".new-quiz-option-name", function(evt) {
    if (evt.keyCode == 13) {
      $(this).parent(".quiz-option-text").siblings(".option-edit-action").toggle();
      var new_quiz_option = $(this).val();
      $(this).parent(".quiz-option-text").siblings(".quiz-option-save").toggle();
      //send to firebase
      $(this).parent(".quiz-option-text").html(new_quiz_option);
    }
    checkToDisplay();
  });

  $("body").on("click", "#addAnotherQuestion", function() {
    addMoreQuestion();
    checkToDisplay();
  });

  $("body").on("click", "#showadddeletebtn", function() {
    $(".option-add-btn").toggle();
    checkToDisplay();
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
    checkToDisplay();
  });

  $("body").on("keydown", ".option-text-box", function(evt) {
    if (evt.keyCode == 13) {
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
    checkToDisplay();
  });


  $("body").on("click", "#btn-checksave-quiz", function(evt) {
    saveAll();

  });

  $("body").on("click", ".btn-save-quiz", function(evt) {
    saveAll();
    
    var listItems = $(".questions-ordered-list li");

    var mainquizRef = database.ref("courses/"+localStorage.courseCode+"/Quiz/" + newIndex + "/");
    var quizTitle = $(".quiz-title-text").text();
    mainquizRef.set({title: quizTitle, totalStudent: 0});
    
    listItems.each(function(idx, li) {
        var lis = $(li);
        var qion = lis.children(".quiz-question-line").children(".quiz-question-text").text();
        var optable = lis.find("table tr.option-row");
        var corrects = "";
        var quizoptions = [];
        var newQuestionAdded = database.ref("courses/"+localStorage.courseCode+"/Quiz/" + newIndex + "/questions/" + idx);

        for (var i = 0; i < optable.length; i++) {
          var optionText = $(optable[i]).find("td").eq(0).children("span.quiz-option-text").text().trim();
          var correctness = $(optable[i]).find("td").eq(0).find("input").prop("checked");
          quizoptions.push(optionText);
          if (correctness) {
            if (!corrects.length == 0)
              corrects += ("," + i);
            else
              corrects += i
          }
        }
        
        newQuestionAdded.set({title: qion, answer: corrects});
        for (var i = 0; i < quizoptions.length; i++) {
          database.ref("courses/"+localStorage.courseCode+"/Quiz/" + newIndex + "/questions/" + idx + "/options/" + i + "/").set({text: quizoptions[i], numCorrect: 0});
        }
    });
    alert("Quiz has been successfully saved");
    document.location.href = './lectures_list_page.html'
  });



  function saveAll() {
    if ($(".quiz-title-save").is(":visible")) {
      $(".quiz-title-save").trigger("click");
    }

    $(".questions-ordered-list").children().each(function(i,li){
      var litem = $(li);
      if (litem.children(".quiz-question-line").children("button.quiz-question-save").is(":visible")) {
        litem.children(".quiz-question-line").children("button.quiz-question-save").trigger("click");
      }
      litem.find("table tr").each(function(i, row) { 
        if ($(row).find("td").eq(0).children("button.quiz-option-save").is(":visible")) {
          $(row).find("td").eq(0).children("button.quiz-option-save").trigger("click");
        }
      });
    });
  }


  function checkToDisplay() {
    $(".questions-ordered-list").children().each(function(i,li){
      var litem = $(li);
      var optNum = litem.find("table tr").length;
      if (optNum <= 4) {
        if (!litem.find("table tr.new-option-row").is(":visible")) {
          litem.find("table tr.new-option-row").toggle();
        }
      } else {
        if (litem.find("table tr.new-option-row").is(":visible")) {
          litem.find("table tr.new-option-row").toggle();
        }
      }
    });
  }

  if (localStorage.quizQuestions) {
    questions = localStorage.quizQuestions.split('$$$');
    console.log(questions);
  }

  if (localStorage.lectureKey && localStorage.courseCode) {
    var title = localStorage.courseCode + " : " + "Lecture " + localStorage.lectureKey + " Quiz";
    $(".quiz-title-text").text(title);
  }

  
  addQuestions();
  
  if (questions.length == 0)
    addMoreQuestion();
});