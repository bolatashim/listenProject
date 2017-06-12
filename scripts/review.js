var config = {
	apiKey: "AIzaSyCxnL1UyMBU51tJU5MAKmCxHPAaMpb2veY",
	databaseURL: "https://listen-f5fcf.firebaseio.com/",
};
firebase.initializeApp(config);
database = firebase.database();

/* dynamic data. hardcoded for now */
var course_code = localStorage.courseCode;
var lecture_key = localStorage.lectureKey;
var lecture_title = null;
var keyToChecked = new Map(); // TODO: Store in localStorage(?)

lectureRef = database.ref(`courses/${course_code}/lectures/${lecture_key}`);
lectureTitleRef = database.ref(`courses/${course_code}/lectures/${lecture_key}/title`);
tagsRef = database.ref(`courses/${course_code}/lectures/${lecture_key}/tags/`);
taRef = database.ref(`courses/${course_code}/taList`);

var taList = []

taRef.once('value').then(function(snapshot){
	snapshot.val().forEach(function(ta){
		taList.push(ta)
	})
})

$(document).ready(function () {
	$("#breadcrumb-course-code").html(course_code);
	$("#breadcrumb-lecture-name").html(lecture_key);
	setLectureTitleUpdater();
	setQuestionsAndTagsUpdater();
	setCheckboxListeners();
	setActionButtonListeners();
	setTagFilterListeners();
	setReplyBoxTogglers();
	setLectureActionListeners();
	setMoreActionsListeners();
	// updateActionButtonAvailability();
});

function setCheckboxListeners() {
	$('body').on('click', 'button[role=checkbox]', function () {
		let checked = $(this).attr('aria-checked');
		$(this).attr('aria-checked', checked == 'false' ?'true' :'false');
	});

	$('body').on('click', '.question button[role=checkbox]', function () {
		key = $(this).parents('.question').data('key');
		checked = $(this).attr('aria-checked');
		keyToChecked.set(key, checked);

		updateSelectAllCheckbox();
	});
}

function updateSelectAllCheckbox() {
	var numAll = $('.question button[role=checkbox]:visible').length;
	var numChecked = $('.question button[role=checkbox][aria-checked=true]:visible').length;

	if (numChecked == 0)
		$('#select-all-action').attr('aria-checked', 'false');
	else if (numChecked == numAll)
		$('#select-all-action').attr('aria-checked', 'true');
	else
		$('#select-all-action').attr('aria-checked', 'mixed');

	updateActionButtonAvailability();
}

function setActionButtonListeners() {
	$('#select-all-action').click(function () {
		let checked = $(this).attr('aria-checked');

		if (checked == 'false') {
			$('.question button[role=checkbox]').attr('aria-checked', 'true');
		}
		else {
			$('.question button[role=checkbox]').attr('aria-checked', 'false');
		}

		// Update keyToChecked
		$('.question button[role=checkbox]').each(function () {
			key = $(this).parents('.question').data('key');
			checked = $(this).attr('aria-checked');
			keyToChecked.set(key, checked);
		});

		updateActionButtonAvailability();
	});

	$('#forward-action').click(function () {
		var mail = ""
		for(var i = 0; i < taList.length; i++){
			if(i != taList.length-1){
				mail += taList[i] + ";"
			}else{
				mail += taList[i]
			}
		}
		var subject = ""
		$('.question button[role=checkbox][aria-checked=true]:visible').each(function () {
			questionDiv = $(this).parents('.question');
			var tag = questionDiv.data('tag');
			var key = questionDiv.data('key');
			var info = questionDiv.data("asker").split(",")
			var id = info[0]
			var email = info[1]
			var question = $(this).parents('.question').find(".text")
			question = question.html()
			question = encodeURIComponent(question)
			subject += "Student%20Number:%20" + id + "%20Email:%20" + email + "%0A" + "Question:%20" + question + "%0A%0A"
			tagsRef.child(`${tag}/${key}/answered`).set(true);
		});
		if(subject)
			window.open("mailto:" + mail + "?subject=" + course_code + ":%20Answer%20these%20Questions&body=" + subject)
	});

	$('#delete-action').click(function () {
		if (confirm('Delete selected questions FOREVER?\n')) {
			deleteAction();
		}
	});

	$('#mark-answered-action').click(function () {
		changeAnsweredAction(true);
	});

	$('#mark-unanswered-action').click(function () {
		changeAnsweredAction(false);
	});

	$('#make-quiz-action').click(function () {
		var quizQuestions = [];

		$('.question button[role=checkbox][aria-checked=true]:visible').each(function () {
			var question = $(this).parents('.question').find(".text");
			question = question.html();
			quizQuestions.push(question);
		});

		localStorage.quizQuestions = quizQuestions.join('$$$');
		console.log(quizQuestions);
		document.location.href = './quiz_maker.html';
	});
}

function updateActionButtonAvailability() {
	var numChecked = $('.question button[role=checkbox][aria-checked=true]:visible').length;

	var disabled = (numChecked == 0);
	$('#forward-action').prop('disabled', disabled);
	$('#delete-action').prop('disabled', disabled);
	$('#mark-answered-action').prop('disabled', disabled);
	$('#mark-unanswered-action').prop('disabled', disabled);

	var make_quiz_text = (numChecked == 0 ?"New Quiz" :"Add to New Quiz");
	$('#make-quiz-action').html(make_quiz_text);
}

function changeAnsweredAction(answered) {
	$('.question button[role=checkbox][aria-checked=true]:visible').each(function () {
		questionDiv = $(this).parents('.question');

		if (questionDiv == null) {
			console.log('questionDiv is null');
			return;
		}

		tag = questionDiv.data('tag');
		key = questionDiv.data('key');
		tagsRef.child(`${tag}/${key}/answered`).set(answered);
	});
}


function deleteAction() {
	$('.question button[role=checkbox][aria-checked=true]:visible').each(function () {
		questionDiv = $(this).parents('.question');
		tag = questionDiv.data('tag');
		key = questionDiv.data('key');
		tagsRef.child(`${tag}/${key}`).remove();
	});

	updateSelectAllCheckbox();
}

function setTagFilterListeners() {
	// TODO: Extract code that filters questions. Also store filter status in localStorage(?).
	// TODO: Right now updating questions resets/clears filters. Fix that.

	$('body').on('click', '.tags .tag', function() {
		$(this).toggleClass('selected');

		// Hide all questions
		if ($('.tags .tag.selected').length > 0) {
			$('.question').hide();

			$('.tags .tag.selected').each(function () {
				tag_key = $(this).html();

				$('.question[data-tag=' + tag_key + ']').show();
			});
		}
		else {
			$('.question').show();
		}

		updateSelectAllCheckbox();
	});
}

function setReplyBoxTogglers() {
	$('body').on('click', '.reply', function () {
		$(this).find('i').toggleClass('fa-angle-up');
		$(this).find('i').toggleClass('fa-angle-down');
		$(this).parents('.question').toggleClass('expanded');
		// $(this).parents('.question').find('.reply-box').toggle(400);
	});

	$('body').on('click', '.send', function () {
		var parent = $(this).parent(".reply-box")
		var text = parent.children("textarea").val()
		var email = parent.data("email")
		text = encodeURIComponent(text)
		window.open("mailto:" + email + "?subject=" + course_code + ":%20Question%20Answered&body=Answer:%20" + text)
		var key = $(this).parents('.question').data('key');
		var tag = $(this).parents('.question').data('tag')
		tagsRef.child(tag+"/"+key+"/answered").set(true)
	});
}

function setLectureActionListeners() {
	$('#edit-name-action').click(function () {
		$('#edit-name-action').toggle();
		$('#save-name-action').toggle();
		$('#lecture-name').html(`
			<input id='new-lecture-name' value='${lecture_title}'>
		`);
	});

	$('#save-name-action').click(function () {
		$('#edit-name-action').toggle();
		$('#save-name-action').toggle();

		new_lecture_key = $('#new-lecture-name').val();
		lectureTitleRef.set(new_lecture_key);
		$('#lecture-name').html(new_lecture_key);
	});
}

function setMoreActionsListeners() {
	$('body').on('click', '.more-actions .expand', function() {
		$(this).parents('.more-actions').find('.actions').toggle();
	});

	$('#delete-lecture-action').click(function () {
		if (confirm('Delete the WHOLE lecture FOREVER?')) {
			deleteLectureAction();
		}
	});
}

function setLectureTitleUpdater() {
	lectureTitleRef.on('value', function (snapshot) {
		lecture_title = snapshot.val();
		$('#lecture-name').html(lecture_title);
	})
}

function setQuestionsAndTagsUpdater() {
	tagsRef.on('value', function (snapshot) {
		tags = snapshot.val();

		console.log(tags);

		// Clear tags and questions
		$('.tags').empty();
		$('.questions').empty();

		if (tags == null) {
			$('.tags').append(`
				(No tags)
			`);

			$('.questions').append(`
				<tr><td><p style="text-align: center; padding: 10px">(No questions)</p></td></tr>
			`);
			return;
		}

		// Update tags
		Object.keys(tags).forEach(function (tag_key) {
			var tag = tags[tag_key];

			$('.tags').append(`
				<button class="tag">${tag_key}</button>
			`);

			// Update questions
			Object.keys(tag).forEach(function (question_key) {
				var question = tag[question_key];
				console.log(question);

				var email = question.email
				$('.questions').append(`
					<tr class="question ${question.answered ?'answered' :''}" data-tag="${tag_key}"
						data-key="${question_key}" data-asker="${question.asker},${question.email}">
						<td>
							<button role="checkbox"
								aria-checked="${keyToChecked.get(question_key) || 'false'}"></button>
						</td>
						<td><span class="tag">${tag_key}</span></td>
						<td>
							<span class="text">${question.text}</span>
							<span class="answered-label">(Answered)</span>
							<br>
							<span class="reply">Reply <i class="fa fa-angle-down"></i></span>
							<div class="reply-box" data-email=${email}>
								<div class="reply-box-wrapper">
									<div class="send-to"><b>To:</b> ${question.email}</div>
									<textarea placeholder="Your reply message"></textarea>
									<button class="send">Send</button>
								</div>
							</div>
						</td>
					</tr>
				`);
			});
		});

		// After updating DOM for questions update checkboxes
		updateSelectAllCheckbox();
	})
}

function deleteLectureAction() {
	lectureRef.remove();
	window.location = 'lectures_list_page.html';
}

function notImplementedYet() {

	alert('That doesnt work yet ¯\\_(ツ)_/¯');
}