(function () {
	var fuckner = {
		lines: [],

		init: function () {
			var that = this;

			$.ajax('data/data.txt', {
				dataType: 'text',
				success: function (text) {
					that.lines = _.filter(text.split('\n'), function (line) {
						return line.trim() !== '';
					});
					that.splitUrls();
					that.sortLines();
					that.renderLines();
				}
			});
		},

		splitUrls: function() {
			this.lines = _.map(this.lines, function(line) {
				return {
					text: line.replace(/https?:\/\/\S+/g,"").trim(),
					urls: line.match(/https?:\/\/\S+/g)
				};
			});
		},

		sortLines: function () {
			var plainLetters = function (s) {
				var from = 'áéíóöőúüű',
					to = 'aeioouuu',
					l = s.length,
					retval = '',
					i;

				return _.map(s, function (letter, i) {
					var t = from.indexOf(s.charAt(i));
					if (t == -1) {
						return s.charAt(i);
					} else {
						return to.charAt(t) + 'x';
					}
				}).join('');
			};

			this.lines = this.lines.sort(function (a, b) {
				var pa = plainLetters(a.text.toLowerCase()),
					pb = plainLetters(b.text.toLowerCase());

				if (pa > pb) {
					return 1;
				} else if (pa < pb) {
					return -1;
				} else {
					return 0;
				}
			});
		},

		renderLines: function () {
			$('#because').html(_.map(this.lines, function (line) {
				if (line.urls == null || line.urls.length == 0) {
					return $('<span>' + line.text + '</span>');
				} else {
					return $('<span><a href="'+line.urls[_.random(line.urls.length-1)]+'">' + line.text + '</a></span>');
				}
			}));
		}
	};

	$(document).foundation();
	fuckner.init();
}());
