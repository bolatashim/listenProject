
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
  var courseKey = localStorage.courseCode;
  var coursesRef = database.ref("courses/" + courseKey);
  var studentsRef = database.ref("courses/" + courseKey + "/students");
  var lecturesRef = database.ref("courses/" + courseKey + "/lectures");
  var quizzesRef = database.ref("courses/" + courseKey + "/Quiz")

  function setStaticSomeElements() {
    $("#course-title-current").text(localStorage.courseCode + ": " + localStorage.courseTitle);
    $("#breadcode").text(localStorage.courseCode);
    if (localStorage.courseCode == "CS374") {
      $(".quickstart-lecture").css("border-top", "6px solid #EA5B23");
    }
  }

  quizzesRef.once("value", function(snapshot){
    snapshot.forEach(function(childSnap){
      var quiz = childSnap.val()
      if(quiz.completed){
        var title = quiz.title
        var totalStudents = quiz.totalStudent
        var questions = quiz.questions
        var correctScores = 0
        var totalScore = 0
        questions.forEach(function(question){
          correctScores += question.totalScore;
          totalScore += question.options.length;
        })
        var avgScore = correctScores/totalStudents
        avgScore = avgScore.toPrecision(2)
        var percentageScore = 100*avgScore/totalScore
        percentageScore = percentageScore.toPrecision(2)

        var html = `<tr>
            <td>
              <div class="quiz-entry">
                <div class="quiz-entry-title">
                  <div style="display:inline-block; width: 40%">
                    <h1 class="quiz-title">${title}</h1>
                  </div>
                  <div style="display: inline-block; width: 59%">
                    <div style="display: inline-block; width: 50%">
                      <h2 class="quiz-score">Average Score: <span class="avg-score">${avgScore}</span>/<span class="total-score">${totalScore}</span></h2>
                    </div>
                    <div style="display: inline-block; width: 49%">
                      <h2 class="quiz-score">Total Students: <span class="total-students">${totalStudents}</span> <i style="font-size: 30px"class="fa fa-angle-down"></i></h2>
                    </div>
                  </div>
                  <div class="percentage-score">
                    <div class="avg-percentage" style="width: ${percentageScore}%"></div>
                    <div class="total-percentage" style="width: ${100 - percentageScore}%"></div>
                  </div>
                </div>
              </div>
            </td>
          </tr>`

        $(".quiz-list").append(html)
      }
    })
    $(".progress").hide()
  })

  setStaticSomeElements();
});

