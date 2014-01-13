/*global $, _ */

(function () {
	'use strict';

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
					text: line.replace(/https?:\/\/\S+/g, '').trim(),
					urls: line.match(/https?:\/\/\S+/g)
				};
			});
		},

		sortLines: function () {
			var plainLetters = function (s) {
					var from = 'áéíóöőúüű',
						to = 'aeioouuu';

					s = s.replace(/<(?:.|\n)*?>/gm, '').toLowerCase();
					return _.map(s, function (letter, i) {
						var t = from.indexOf(s.charAt(i));
						if (t === -1) {
							return s.charAt(i);
						} else {
							return to.charAt(t) + 'x';
						}
					}).join('');
				},
				plainLines = {};

			_.each(this.lines, function (line) {
				plainLines[line.text] = plainLetters(line.text);
			});

			this.lines = this.lines.sort(function (a, b) {
				if (plainLines[a.text] > plainLines[b.text]) {
					return 1;
				} else if (plainLines[a.text] < plainLines[b.text]) {
					return -1;
				} else {
					return 0;
				}
			});
		},

		renderLines: function () {
			var tags = 0,
				urls = 0;

			$('#because').html(_.map(this.lines, function (line) {
				tags++;
				if (line.urls === null || line.urls.length === 0) {
					return $('<span>' + line.text + '</span>');
				} else {
					urls += line.urls.length;
					if (line.urls.length > 1) {
						return $('<span><a href="' + line.urls[0] + '">' + line.text + '</a> ' + _.map(_.rest(line.urls), function (url, i) {
							return '<a href="' + url + '">[&nbsp;' + (i + 2) + '&nbsp;]</a>';
						}).join(' ') + '</span>');
					} else {
						return $('<span><a href="' + line.urls[0] + '">' + line.text + '</a></span>');
					}
				}
			}));

			$('#tags').html(tags + ' téma');
			$('#urls').html(urls + ' URL');
		}
	};

	$(document).foundation();
	fuckner.init();
}());
