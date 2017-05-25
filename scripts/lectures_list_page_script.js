
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
  var lectureToday = 0;
  var lectureKey;
  var qTotal = 0;
  var allStudents = 0;

  function setLectureTodayKey() {
    lecturesRef.once("value", function(data) {
      var prev = 0;
      $.when(prev = data.numChildren()).done(function() {
        lectureToday = prev + 1;
        lectureKey = "Lecture " + lectureToday;
        setTodayLectureLabel();
        return;
      });  
    });
  }

  function setTotalStudentsNum() {
    studentsRef.once("value", function(data) {
      $.when(allStudents = data.numChildren()).done(function() {
        $("#students-registered").text(allStudents);
      });
    }); 
  }
  
  function todayDateGet() {
    var months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    return months[month] + " " + day + ", " + year;
  }

  function pushPrevLecture(all) {
    all = all.sort(function(a,b) {
      if(a.num < b.num)
        return 1;
      if(a.num > b.num)
        return -1;
      return 0;
    });

    for (var i = 0; i < all.length; i++) {
      var html = '<tr class="takemetoreviewpage">' + 
                  '<td class="lNumber">' + all[i].num + '</td>' +
                  '<td class="lTitle">' + all[i].title + '</td>' +
                  '<td class="lDate">' + all[i].date + '</td>' +
                  '<td class="lQuestions">' + all[i].questions + '</td>' +
                '</tr>'
      $(html).insertAfter(".starterclassrow");
    }
  }

  $("#prev-lectures-table").on("click", ".takemetoreviewpage", function() {
    var lecNum = $(this).find("td").eq(0).text();
    localStorage.lectureKey = "Lecture " + lecNum;
    document.location.href = './review.html'
  });



  function displayPrevLectures() {
    var all = [];
    lecturesRef.once("value", function(data) {
      $.when(
        data.forEach(function(lecture) {
          var q = lecture.val().totalQuestions;
          qTotal += q;
          all.push({num: lecture.val().number, title: lecture.val().title, date: lecture.val().time, questions: q});
        })
        ).done(function() {
        $("#questions-asked").text(qTotal);
        pushPrevLecture(all);
      });
      $(".progress").hide()
    });
  }
  

  function lectureStart(key, title, number) {
    lectureRef = database.ref("courses/" + courseKey + "/lectures/" + key);
    lectureRef.set({time: todayDateGet(), title: title, number: number});
    var activeLecture = database.ref("activeLecture");
    $.when(activeLecture.remove()).done(activeLecture.push({course: localStorage.courseCode + " " + localStorage.courseTitle, lecture: lectureKey}));
  }

  function setTodayLectureLabel() {
    var txt = "Lecture " + lectureToday;
    $("#lecture-today").text(txt);
    var currweek = lectureToday/2;
    if (lectureToday%2 != 0)
      currweek = (lectureToday+1)/2
    $("#current-week").text(currweek);
  }

  function setSomeElements() {
    $("#course-title-current").text(localStorage.courseCode + ": " + localStorage.courseTitle);
    $("#breadcode").text(localStorage.courseCode);
    $("#today-lecture-tablehead").text("Today's Lecture (" + todayDateGet() +")");
    if (localStorage.courseCode == "CS374") {
      $(".quickstart-lecture").css("border-top", "6px solid #EA5B23");
    }
  }

  $("#start-lecture-today").click(function() {
      console.log("here");
      if ($("#today-lecture-title").val() == "") {
        if(confirm("Do you wish to proceed without setting the lecture title?")){
          document.location.href = './lectures_list_page.html'
        }else{
          $("#today-lecture-title").focus();
          return;
        }
      }
      setTodayLectureLabel();
      console.log(lectureToday);
      var ltitle = $("#today-lecture-title").val();
      lectureStart(lectureKey, ltitle, lectureToday);
      localStorage.courseCode = courseKey;
      localStorage.lectureKey = lectureKey;
      localStorage.lectureTitle = ltitle;
      document.location.href = './active_lecture.html';
  });

  setLectureTodayKey();
  setTotalStudentsNum();
  setSomeElements();
  displayPrevLectures();
});

