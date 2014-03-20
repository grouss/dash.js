if (window.location.href.indexOf("runner.html") > 0) {
	describe("Buffer Extension Suite", function () {
		var bufferExtension,
		context,
		system;

		beforeEach(function () {
			system = new dijon.System();
			system.mapValue("system", system);
			system.mapOutlet("system");
			context = new Dash.di.DashContext();
			system.injectInto(context);
		});

		it("Check Buffer Length with positive values greater than 0", function () {

			var bufferExtensions = MediaPlayer.dependencies.BufferExtensions();
			runs(function () {

				bufferExtensions.decideBufferLength(10).when(function (bufferLength) {
					expect(isNaN(bufferLength)).not.toBeTruthy();
				});
			});
		});

		it("Check Buffer Length with negative values lesser than 0", function () {
			var bufferExtensions = MediaPlayer.dependencies.BufferExtensions();
			runs(function () {
				bufferExtensions.decideBufferLength(-1).when(function (bufferLength) {
					expect(isNaN(bufferLength)).not.toBeTruthy();
				});
			});
		});

		it("Check if Buffer Length = 4 with negative values", function () {
			var bufferExtensions = MediaPlayer.dependencies.BufferExtensions();
			runs(function () {
				bufferExtensions.decideBufferLength(-1).when(function (bufferLength) {
					expect(bufferLength).toBe(4);
				});
			});
		});

		it("Check if Buffer Length = 4 with string value", function () {
			var bufferExtensions = MediaPlayer.dependencies.BufferExtensions();
			runs(function () {
				bufferExtensions.decideBufferLength("test").when(function (bufferLength) {
					expect(bufferLength).toBe(4);
				});
			});
		});

		it("Check the top quality Index for audio", function () {
			if (manifestRes.Period.AdaptationSet_asArray[0] != undefined) {

				var bufferExtensions = MediaPlayer.dependencies.BufferExtensions();
				bufferExtensions.updateData(manifestRes.Period.AdaptationSet_asArray[0], "audio");
				var result = bufferExtensions.getTopQualityIndex("audio");
				expect(result).toEqual(4);
			}
		});

		it("Check the top quality Index for video", function () {
			if (manifestRes.Period.AdaptationSet_asArray[0] != undefined) {
				var bufferExtensions = MediaPlayer.dependencies.BufferExtensions();
				bufferExtensions.updateData(manifestRes.Period.AdaptationSet_asArray[0], "video");
				var result = bufferExtensions.getTopQualityIndex("video");
				expect(result).toEqual(4);
			}
		});

		it("Deciding the Buffer Length with max duration", function () {

			var bufferExtensions,
			minBufferTime = 9,
			duration = 10;
			bufferExtensions = MediaPlayer.dependencies.BufferExtensions();
			bufferExtensions.decideBufferLength(minBufferTime, duration).then(function (result) {
				expect(result).toEqual(9);
			});
		});

		it("Deciding the Buffer Length when duration is lesser than minBufferTime", function () {

			var bufferExtensions,
			minBufferTime = 10,
			duration = 9;
			bufferExtensions = MediaPlayer.dependencies.BufferExtensions();
			bufferExtensions.decideBufferLength(minBufferTime, duration).then(function (result) {
				expect(result).toEqual(8);
			});
		});

		it("Deciding the Buffer Length when duration and minBufferTime are lesser than DEFAULT_MIN_BUFFER_TIME", function () {
			var bufferExtensions,
			minBufferTime = 4,
			duration = 5;
			bufferExtensions = MediaPlayer.dependencies.BufferExtensions();
			bufferExtensions.decideBufferLength(minBufferTime, duration).then(function (result) {
				expect(result).toEqual(4);
			});
		});

		it("Check the least buffer level", function () {

			var manifestModel,
			element,
			video;
			manifestModel = system.getObject("manifestModel");

			manifestModel.setValue(manifestRes);

			element = document.createElement('video');
			$(element).autoplay = true;
			video = system.getObject("videoModel");
			video.setElement($(element)[0]);

			bufferController.setVideoModel(video);
			bufferController.initialize("video", 0, manifestRes.Period.AdaptationSet[0], null, video, null, null, null);
			waits(1000);
			waitsFor(function () {

				if (bufferController.isReady() != undefined)
					return true;
			}, "waiting for buffer to get updated", 100);
			runs(function () {

				bufferController.updateBufferState();
				waitsFor(function () {
					if (bufferController.metricsModel.streamMetrics.video != undefined)
						return true;
				}, "waiting to add buffer", 100);
				runs(function () {

					var result = bufferController.metricsModel.streamMetrics.video.BufferLevel[0].level;
					expect(result).toEqual(0);
				});
			});
		});

		it("Get Target Buffer Value", function () {

			var bufferExtensions,
			minBufferTime = 4,
			duration = 5;
			bufferExtensions = MediaPlayer.dependencies.BufferExtensions();
			bufferExtensions.decideBufferLength(minBufferTime, duration).then(function (result) {
				var BufferTarget = bufferExtensions.getBufferTarget();
				expect(BufferTarget).toEqual(4);
			});
		});
	});
}
