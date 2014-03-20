if (window.location.href.indexOf("runner.html") > 0) {
	describe("Stream Controller Suite", function () {
		var streamController,
		url,
		element,
		video,
		result,
		context,
		system,
		streams;

		beforeEach(function () {
			system = new dijon.System();
			system.mapValue("system", system);
			system.mapOutlet("system");
			context = new Dash.di.DashContext();
			system.injectInto(context);

			streamController = system.getObject('streamController');
			//url = "http://dash.edgesuite.net/envivio/dashpr/clear/Manifest.mpd";

			element = document.createElement('video');
			$(element).autoplay = true;
			video = system.getObject("videoModel");
			video.setElement($(element)[0]);
			streamController.setVideoModel(video);
		});

		it("Stream Controller - Check Manifest Data", function () {

			streamController.load(testUrl);
			waits(1000);
			runs(function () {
				waitsFor(function () {
					if (streamController.getManifestExt() != undefined)
						return true;
				}, "waiting for stream controller to load", 100);
				runs(function () {

					expect(streamController.getManifestExt()).not.toBe(null);
				});
			});
		});

		it("Stream Controller - Check Auto Play Property", function () {
			streamController.load(testUrl);
			var result = streamController.getAutoPlay();
			expect(result).toBe(true);
		});

		it("Stream Controller - Play", function () {
			streamController.load(testUrl);
			waits(1000);
			runs(function () {
				waitsFor(function () {
					if (streamController.getManifestExt() != undefined)
						return true;
				}, "waiting for stream controller to load", 100);
				runs(function () {

					streamController.play();
					bufferController = system.getObject("bufferController");
					bufferController.setVideoModel(video);
					expect(bufferController.metricsModel.getMetricsFor("video").PlayList[0].mstart).toBe(0);
				});
			});
		});

		it("Stream Controller - Pause", function () {
			streamController.load(testUrl);
			waits(1000);
			runs(function () {
				waitsFor(function () {
					if (streamController.getManifestExt() != undefined)
						return true;
				}, "waiting for stream controller to load", 100);
				runs(function () {
					streamController.pause();
					expect($(element)[0].paused).toBe(true);
				});
			});
		});

		it("Stream Controller - seek with time", function () {
			streams = system.getObject("stream");
			streamController.load(testUrl);
			waits(1000);
			runs(function () {
				waitsFor(function () {
					if (streamController.getManifestExt() != undefined)
						return true;
				}, "waiting for stream controller to load", 100);
				runs(function () {
					streams.setVideoModel(video);
					streamController.seek(0);
					bufferController = system.getObject("bufferController");
					expect(bufferController.metricsModel.getMetricsFor("video").PlayList[0].mstart).toBe(0);
				});
			});
		});

		it("Stream Controller - seek", function () {
			streams = system.getObject("stream");
			streamController.load(testUrl);
			waits(1000);
			runs(function () {
				waitsFor(function () {
					if (streamController.getManifestExt() != undefined)
						return true;
				}, "waiting for stream controller to load", 100);
				runs(function () {
					streams.setVideoModel(video);
					streamController.seek(0);
					bufferController = system.getObject("bufferController");
					expect(bufferController.metricsModel.getMetricsFor("video").PlayList[1].starttype).toBe("seek");
				});
			});
		});

		it("Stream Controller - reset", function () {

			streamController.load(testUrl);
			waits(1000);
			runs(function () {
				waitsFor(function () {
					if (streamController.getManifestExt() != undefined)
						return true;
				}, "waiting for stream controller to load", 100);
				runs(function () {

					streamController.reset();
					var result = streamController.getVideoModel();
					expect(result).not.toBe(null);
				});
			});
		});
	});
}
