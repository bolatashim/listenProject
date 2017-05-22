var config = {
	apiKey: "AIzaSyCxnL1UyMBU51tJU5MAKmCxHPAaMpb2veY",
	databaseURL: "https://listen-f5fcf.firebaseio.com/",
};
firebase.initializeApp(config);
database = firebase.database();

/* dynamic data. hardcoded for now */
var course_code = localStorage.courseCode;
var lecture_title = localStorage.lectureKey;

tagsRef = database.ref(`courses/${course_code}/lectures/${lecture_title}/tags/`);

$(document).ready(function () {
	setQuestionsAndTagsUpdater();
	setCheckboxListeners();
	setTagFilterListeners();
	setReplyBoxTogglers();
});

function setCheckboxListeners() {
	$('body').on('click', 'button[role=checkbox]', function() {
		let checked = $(this).attr('aria-checked');
		$(this).attr('aria-checked', checked == 'true' ?'false' :'true');
	});
}

function setTagFilterListeners() {
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
	});
}

function setReplyBoxTogglers() {
	$('body').on('click', '.reply', function () {
		$(this).parent('.question').children('.reply-box').toggle();
	});

	$('body').on('click', '.send', function () {
		alert('That doesnt work yet ¯\\_(ツ)_/¯');
	});
}

function setQuestionsAndTagsUpdater() {
	tagsRef.on('value', function(snapshot) {
		tags = snapshot.val();

		console.log(tags);

		if (tags == null)
			return;

		// Clear tags and questions
		$('.tags').empty();
		$('.questions').empty();

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
					<div class="question ${question.answered ?'answered' :''}" data-tag="${tag_key}">
						<button role="checkbox" aria-checked="false"></button>
						<span class="tag">${tag_key}</span>
						<span class="text">${question.text}</span>
						<span class="answered-label">Answered</span>

						<a href="#" class="reply">Reply</a>
						<div class="reply-box">
							<textarea placeholder="Your reply message"></textarea>
							<button class="send">Send</button>
						</div>
					</div>
				`);
			});
		});
	})
}