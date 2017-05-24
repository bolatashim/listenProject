var config = {
	apiKey: "AIzaSyCxnL1UyMBU51tJU5MAKmCxHPAaMpb2veY",
	databaseURL: "https://listen-f5fcf.firebaseio.com/",
};
firebase.initializeApp(config);
database = firebase.database();

/* dynamic data. hardcoded for now */
var course_code = localStorage.courseCode;
var lecture_title = localStorage.lectureKey;
var keyToChecked = new Map(); // TODO: Store in localStorage(?)

tagsRef = database.ref(`courses/${course_code}/lectures/${lecture_title}/tags/`);

$(document).ready(function () {
	$("#course-code").html(course_code)
	$("#lecture-name").html(lecture_title)
	setQuestionsAndTagsUpdater();
	setCheckboxListeners();
	setActionButtonListeners();
	setTagFilterListeners();
	setReplyBoxTogglers();
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
	numAll = $('.question button[role=checkbox]:visible').length;
	numChecked = $('.question button[role=checkbox][aria-checked=true]:visible').length;

	if (numChecked == 0)
		$('#select-all-action').attr('aria-checked', 'false');
	else if (numChecked == numAll)
		$('#select-all-action').attr('aria-checked', 'true');
	else
		$('#select-all-action').attr('aria-checked', 'mixed');
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
	});

	$('#forward-action').click(function () {
		notImplementedYet();
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
		$(this).parents('.question').find('.reply-box').toggle(400);
	});

	$('body').on('click', '.send', function () {
		notImplementedYet();
	});
}

function setQuestionsAndTagsUpdater() {
	tagsRef.on('value', function(snapshot) {
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

				$('.questions').append(`
					<tr class="question ${question.answered ?'answered' :''}" data-tag="${tag_key}"
						data-key="${question_key}">
						<td>
							<button role="checkbox"
								aria-checked="${keyToChecked.get(question_key) || 'false'}"></button>
						</td>
						<td><span class="tag">${tag_key}</span></td>
						<td>
							<span class="text">${question.text} An automatic table layout algorithm is commonly used by most browsers for table layout. The widths of the table and its cells depend on the content thereof.
</span>
							<span class="answered-label">(Answered)</span>

							<span class="reply">Reply <i class="fa fa-angle-down"></i></span>
							<div class="reply-box">
								<textarea placeholder="Your reply message"></textarea>
								<button class="send">Send</button>
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

function notImplementedYet() {
	alert('That doesnt work yet ¯\\_(ツ)_/¯');
}