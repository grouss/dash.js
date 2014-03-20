if (window.location.href.indexOf("runner.html") > 0) {
	describe("Text Track Extension Suite", function () {
		var textTrackExtensions,
		context,
		system,
		element,
		captionData = [],
		captionItem = {};

		beforeEach(function () {
			system = new dijon.System();
			system.mapValue("system", system);
			system.mapOutlet("system");
			context = new Dash.di.DashContext();
			system.injectInto(context);
			textTrackExtensions = system.getObject('textTrackExtensions');

			element = document.createElement('video');
			$(element).autoplay = true;

			captionItem.start = 0;
			captionItem.end = 10;
			captionItem.data = "Testing data";
			captionData.push(captionItem);
			captionItem.start = 1;
			captionItem.end = 20;
			captionItem.data = "Testing data2";
			captionData.push(captionItem);
		});

		it("Check track data with null caption data", function () {
			textTrackExtensions.addTextTrack($(element)[0], null, "Testing", "Eng", true).then(function (data) {
				expect(data.mode).toEqual("showing");
			});
		});

		it("Check track data - cue pauseOnExit with caption data", function () {
			textTrackExtensions.addTextTrack($(element)[0], captionData, "Testing", "Eng", true).then(function (data) {
				expect(data.cues[0].pauseOnExit).toBe(false);
			});
		});

		it("Check track data - cue pauseOnExit with caption data", function () {
			textTrackExtensions.addTextTrack($(element)[0], captionData, "Testing", "Eng", true).then(function (data) {
				expect(data.cues[0].snapToLines).toBe(true);
			});
		});

		it("Check track data - cue kind value with caption data", function () {
			textTrackExtensions.addTextTrack($(element)[0], captionData, "Testing", "Eng", true).then(function (data) {
				expect(data.kind).toEqual("captions");
			});
		});

		it("Check track data - cue startTime value with caption data", function () {
			textTrackExtensions.addTextTrack($(element)[0], captionData, "Testing", "Eng", true).then(function (data) {
				expect(data.cues[0].startTime).toEqual(1);
			});
		});

		it("Check track data - cue endTime value with caption data", function () {
			textTrackExtensions.addTextTrack($(element)[0], captionData, "Testing", "Eng", true).then(function (data) {
				expect(data.cues[0].endTime).toEqual(20);
			});
		});

		it("Check track data - cue text value with caption data", function () {
			textTrackExtensions.addTextTrack($(element)[0], captionData, "Testing", "Eng", true).then(function (data) {
				expect(data.cues[0].text).toEqual("Testing data2");
			});
		});

		it("Check track data - default value with caption data", function () {
			textTrackExtensions.addTextTrack($(element)[0], captionData, "Testing", "Eng", true).then(function (data) {
				expect(data.default).toBeTruthy();
				});
			});

			it("Check track data - cue size value with caption data", function () {
				textTrackExtensions.addTextTrack($(element)[0], captionData, "Testing", "Eng", true).then(function (data) {
					expect(data.cues[0].size).toEqual(100);
				});
			});

		});

	}
